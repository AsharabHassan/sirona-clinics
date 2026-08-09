import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PRIVATE_DIR = process.env.OUTREACH_PRIVATE_DIR
  ? path.resolve(process.env.OUTREACH_PRIVATE_DIR)
  : path.join(ROOT, "outreach-private");
const STATE_PATH = path.join(PRIVATE_DIR, "state.json");
const EVIDENCE_PATH = path.join(PRIVATE_DIR, "recipient-evidence.json");
const RESEARCH_PATH = path.join(PRIVATE_DIR, "research-queue.json");
const APPROVAL_DIR = path.join(PRIVATE_DIR, "approvals");
const CONFIG = readJson(path.join(ROOT, "outreach-loop.config.json"));
const PROFILES = readJson(path.join(ROOT, "data", "clinic-profiles.json"));
const PRODUCT_LABELS = {
  "silk-skin": "VELURIA Silk Skin",
  "ultra-lift": "VELURIA Ultra Lift",
  "pearl-tone": "VELURIA Pearl Tone",
  "hair-force-plus": "VELURIA Hair Force+",
};
const STOP_EVENTS = new Set(["hard_bounce", "unsubscribe", "complaint", "explicit_stop"]);
const HIGH_INTENT_EVENTS = new Set(["positive_reply", "booking_click", "clinic_gate_submit", "demo_launch", "ai_complete", "booked"]);
const REPLY_CLASSIFICATIONS = new Set(["positive", "question", "pricing", "timing", "referral", "not_now", "out_of_office", "decline", "stop"]);
const ALLOWED_EVENTS = new Set([
  "sent", "delivered", "hard_bounce", "positive_reply", "negative_reply", "booking_click", "booked",
  "cancelled", "attended", "no_show", "qualified", "unsubscribe", "complaint", "explicit_stop",
  "linkedin_invite", "linkedin_accept", "linkedin_reply", "application_view", "clinic_gate_submit",
  "demo_launch", "ai_complete", "ai_brain_view", "reply_draft_prepared",
]);

function tokenKey() {
  const secret = process.env.OUTREACH_TOKEN_SECRET;
  if (!secret || secret.length < 32) throw new Error("OUTREACH_TOKEN_SECRET must contain at least 32 characters");
  return crypto.createHash("sha256").update(secret, "utf8").digest();
}

function issueToken({ contactId, clinicSlug, experiment = "control" }) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", tokenKey(), iv);
  const payload = JSON.stringify({
    v: 1,
    campaignId: CONFIG.campaignId,
    contactId,
    clinicSlug,
    experiment,
    expiresAt: Date.now() + 90 * 24 * 60 * 60 * 1000,
  });
  const encrypted = Buffer.concat([cipher.update(payload, "utf8"), cipher.final()]);
  return [iv, encrypted, cipher.getAuthTag()].map((value) => value.toString("base64url")).join(".");
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function args() {
  const [command = "status", ...rest] = process.argv.slice(2);
  const options = {};
  for (let index = 0; index < rest.length; index += 1) {
    const value = rest[index];
    if (!value.startsWith("--")) continue;
    const key = value.slice(2);
    options[key] = rest[index + 1]?.startsWith("--") ? true : rest[++index] ?? true;
  }
  return { command, options };
}

function defaultState() {
  return {
    version: 2,
    campaignId: CONFIG.campaignId,
    status: "PAUSED",
    pausedReason: "Five approved senders, a 500-person cleared queue, final daily packet approval and explicit activation are required.",
    updatedAt: new Date().toISOString(),
    distinctPeopleContacted: 0,
    lastRunId: null,
    activeLocks: {},
    contacts: {},
    clinics: {},
    sendReceipts: [],
    events: [],
    cohorts: [],
    currentExperiment: {
      variable: "email_1_hook",
      control: "product_relevance",
      variant: "patient_growth_relevance",
      status: "WAITING_FOR_CLEARED_COHORT",
    },
  };
}

function loadState() {
  if (!fs.existsSync(STATE_PATH)) return defaultState();
  const loaded = readJson(STATE_PATH);
  const migrating = Number(loaded.version ?? 1) < 2;
  const receipts = loaded.sendReceipts ?? [];
  return {
    ...defaultState(),
    ...loaded,
    version: 2,
    status: migrating ? "PAUSED" : loaded.status,
    pausedReason: migrating ? defaultState().pausedReason : loaded.pausedReason,
    distinctPeopleContacted: migrating
      ? new Set(receipts.filter((receipt) => receipt.stage === "email-1").map((receipt) => receipt.contactId)).size
      : loaded.distinctPeopleContacted ?? 0,
    contacts: loaded.contacts ?? {},
    clinics: loaded.clinics ?? {},
    activeLocks: loaded.activeLocks ?? {},
    sendReceipts: receipts,
    events: loaded.events ?? [],
    cohorts: loaded.cohorts ?? [],
    currentExperiment: migrating ? defaultState().currentExperiment : loaded.currentExperiment ?? defaultState().currentExperiment,
  };
}

function saveState(state) {
  state.updatedAt = new Date().toISOString();
  writeJson(STATE_PATH, state);
}

function loadResearch() {
  if (!fs.existsSync(RESEARCH_PATH)) return [];
  const value = readJson(RESEARCH_PATH);
  return Array.isArray(value) ? value : [];
}

function londonParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: CONFIG.timezone,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  return Object.fromEntries(parts.map(({ type, value }) => [type, value]));
}

function londonDateKey(date = new Date()) {
  const p = londonParts(date);
  return `${p.year}-${p.month}-${p.day}`;
}

function clockGate(date = new Date()) {
  const parts = londonParts(date);
  const time = `${parts.hour}:${parts.minute}`;
  const sunday = parts.weekday === "Sun";
  const inWindow = CONFIG.sendWindows.some((window) => {
    const [hour, minute] = window.split(":").map(Number);
    const start = hour * 60 + minute;
    const current = Number(parts.hour) * 60 + Number(parts.minute);
    return current >= start && current < start + 60;
  });
  const beforeLatestStart = time < CONFIG.latestStart;
  const beforeHardStop = time < CONFIG.hardStop;
  return {
    timezone: CONFIG.timezone,
    weekday: parts.weekday,
    date: londonDateKey(date),
    time,
    allowed: !sunday && inWindow && beforeLatestStart && beforeHardStop,
    reason: sunday
      ? "SUNDAY_LOCKOUT"
      : !beforeHardStop
        ? "AFTER_1800_LOCKOUT"
        : !beforeLatestStart
          ? "AFTER_1745_START_LOCKOUT"
          : !inWindow
            ? "OUTSIDE_APPROVED_WINDOWS"
            : "ALLOWED",
  };
}

function addBusinessDays(iso, amount) {
  const date = new Date(iso);
  let remaining = amount;
  while (remaining > 0) {
    date.setUTCDate(date.getUTCDate() + 1);
    if (londonParts(date).weekday !== "Sun") remaining -= 1;
  }
  return date.toISOString();
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"') {
      if (quoted && text[index + 1] === '"') { field += '"'; index += 1; }
      else quoted = !quoted;
    } else if (char === "," && !quoted) { row.push(field); field = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[index + 1] === "\n") index += 1;
      row.push(field);
      if (row.some((value) => value.length > 0)) rows.push(row);
      row = []; field = "";
    } else field += char;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [headers, ...body] = rows;
  return body.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

function normalize(value) {
  return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function slugify(value) {
  return normalize(value).replace(/\s+/g, "-");
}

function isUrl(value) {
  try { const url = new URL(String(value)); return url.protocol === "https:" || url.protocol === "http:"; }
  catch { return false; }
}

function isWorkEmail(email) {
  const value = String(email ?? "").trim().toLowerCase();
  const domain = value.split("@")[1] ?? "";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    && !new Set(["gmail.com", "hotmail.com", "outlook.com", "yahoo.com", "icloud.com", "aol.com", "googlemail.com"]).has(domain);
}

function clinicKey(record) {
  try { return new URL(record.officialWebsite).hostname.replace(/^www\./, "").toLowerCase(); }
  catch { return normalize(record.clinicName); }
}

function profileFor(record) {
  return PROFILES.find((profile) =>
    (profile.status === "verified" || (process.env.OUTREACH_ALLOW_DEMO_PROFILE === "yes" && profile.status === "demo"))
    && (profile.slug === record.profileSlug || normalize(profile.clinicName) === normalize(record.clinicName)),
  );
}

function resolveSenders() {
  return CONFIG.senderPool.map((sender) => ({
    id: sender.id,
    email: String(process.env[sender.emailEnv] ?? "").trim().toLowerCase(),
    name: String(process.env[sender.nameEnv] ?? "").trim(),
    authenticated: String(process.env[sender.authenticatedEnv] ?? "").toLowerCase() === "yes",
  }));
}

function senderFailures() {
  const senders = resolveSenders();
  const failures = [];
  const emails = new Set();
  for (const sender of senders) {
    if (!sender.email) failures.push(`${sender.id}: MISSING_EMAIL`);
    else if (!sender.email.endsWith("@sironaaesthetics.co.uk")) failures.push(`${sender.id}: NON_SIRONA_EMAIL`);
    else if (emails.has(sender.email)) failures.push(`${sender.id}: DUPLICATE_EMAIL`);
    else emails.add(sender.email);
    if (!sender.name) failures.push(`${sender.id}: MISSING_REAL_SENDER_NAME`);
    if (!sender.authenticated) failures.push(`${sender.id}: AUTHENTICATION_NOT_APPROVED`);
  }
  return failures;
}

function normalizeResearchRecord(input, index = 0) {
  const get = (...keys) => keys.map((key) => input[key]).find((value) => value !== undefined && value !== "") ?? "";
  const clinicName = String(get("clinicName", "Business Name", "Clinic Name")).trim();
  const personName = String(get("personName", "Contact Name", "Person Name")).trim();
  const officialWebsite = String(get("officialWebsite", "Website", "Official Website")).trim();
  return {
    id: String(get("id", "researchId") || `research-${slugify(clinicName || "clinic")}-${slugify(personName || "person")}-${index + 1}`),
    discoveredAt: String(get("discoveredAt") || new Date().toISOString()),
    discoverySourceUrl: String(get("discoverySourceUrl", "Discovery Source URL")).trim(),
    clinicName,
    officialWebsite,
    city: String(get("city", "City", "Location")).trim(),
    officialSourceUrl: String(get("officialSourceUrl", "Official Source URL")).trim(),
    companiesHouseNumber: String(get("companiesHouseNumber", "Companies House Number")).trim(),
    companiesHouseStatus: String(get("companiesHouseStatus", "Companies House Status")).trim().toLowerCase(),
    clinicFit: String(get("clinicFit", "Clinic Fit")).trim().toLowerCase(),
    verifiedServices: Array.isArray(input.verifiedServices) ? input.verifiedServices : String(get("verifiedServices", "Verified Services")).split(";").map((value) => value.trim()).filter(Boolean),
    clinicSignal: String(get("clinicSignal", "Clinic Signal")).trim(),
    profileSlug: String(get("profileSlug", "Profile Slug")).trim(),
    contactId: String(get("contactId", "Contact Id")).trim(),
    personName,
    currentRole: String(get("currentRole", "Current Role", "Role")).trim(),
    personOrder: Math.max(1, Math.min(2, Number(get("personOrder", "Person Order") || 1))),
    salesNavigatorAccountUrl: String(get("salesNavigatorAccountUrl", "Sales Navigator Account URL")).trim(),
    salesNavigatorLeadUrl: String(get("salesNavigatorLeadUrl", "Sales Navigator Lead URL")).trim(),
    salesQlChecked: input.salesQlChecked === true || String(get("salesQlChecked", "SalesQL Checked")).toLowerCase() === "yes",
    workEmail: String(get("workEmail", "Email", "Work Email")).trim().toLowerCase(),
    emailStatus: String(get("emailStatus", "Email Status")).trim().toLowerCase(),
    identityMatch: String(get("identityMatch", "Identity Match")).trim().toLowerCase(),
    ghlChecked: input.ghlChecked === true || String(get("ghlChecked", "GHL Checked")).toLowerCase() === "yes",
    dnd: input.dnd === true || String(get("dnd", "DND")).toLowerCase() === "yes",
    unsubscribed: input.unsubscribed === true || String(get("unsubscribed", "Unsubscribed")).toLowerCase() === "yes",
    suppressed: input.suppressed === true || String(get("suppressed", "Suppressed")).toLowerCase() === "yes",
    hardBounce: input.hardBounce === true || String(get("hardBounce", "Hard Bounce")).toLowerCase() === "yes",
    explicitStop: input.explicitStop === true || String(get("explicitStop", "Explicit Stop")).toLowerCase() === "yes",
    connectionState: String(get("connectionState", "LinkedIn State")).trim().toLowerCase() || "unresolved",
    verifiedAt: String(get("verifiedAt", "Verified At")).trim(),
  };
}

function researchMissing(record) {
  const missing = [];
  if (!record.clinicName) missing.push("MISSING_CLINIC_NAME");
  if (!isUrl(record.discoverySourceUrl)) missing.push("MISSING_DISCOVERY_SOURCE");
  if (!isUrl(record.officialWebsite)) missing.push("MISSING_OFFICIAL_WEBSITE");
  if (!record.city) missing.push("MISSING_UK_LOCATION");
  if (!isUrl(record.officialSourceUrl)) missing.push("MISSING_OFFICIAL_PERSONALISATION_SOURCE");
  if (record.companiesHouseStatus !== "active") missing.push("CORPORATE_STATUS_NOT_ACTIVE");
  if (record.clinicFit !== "qualified") missing.push("CLINIC_FIT_NOT_APPROVED");
  if (!record.verifiedServices.length) missing.push("MISSING_VERIFIED_SERVICES");
  if (!record.clinicSignal) missing.push("MISSING_CLINIC_SIGNAL");
  if (!record.profileSlug) missing.push("MISSING_PROFILE_SLUG");
  if (!record.contactId) missing.push("MISSING_GHL_CONTACT_ID");
  if (!record.personName) missing.push("MISSING_PERSON_NAME");
  if (!record.currentRole) missing.push("MISSING_CURRENT_ROLE");
  if (!isUrl(record.salesNavigatorAccountUrl)) missing.push("MISSING_SALES_NAVIGATOR_ACCOUNT");
  if (!isUrl(record.salesNavigatorLeadUrl)) missing.push("MISSING_SALES_NAVIGATOR_LEAD");
  if (!record.salesQlChecked) missing.push("SALESQL_NOT_CHECKED");
  if (record.identityMatch !== "exact") missing.push("IDENTITY_NOT_EXACT");
  if (record.emailStatus !== "verified") missing.push("EMAIL_NOT_VERIFIED");
  if (!isWorkEmail(record.workEmail)) missing.push("NOT_VERIFIED_WORK_EMAIL");
  if (!record.ghlChecked) missing.push("GHL_NOT_CHECKED");
  if (!record.verifiedAt) missing.push("MISSING_VERIFICATION_DATE");
  if (record.dnd || record.unsubscribed || record.suppressed || record.hardBounce || record.explicitStop) missing.push("SUPPRESSION_OR_STOP_SIGNAL");
  if (!profileFor(record)) missing.push("NO_APPROVED_PERSONALISED_PROFILE");
  return [...new Set(missing)];
}

function researchStage(record) {
  const missing = researchMissing(record);
  if (!record.officialWebsite) return "discovered";
  if (missing.some((item) => item.includes("CLINIC") || item.includes("CORPORATE") || item.includes("OFFICIAL_WEBSITE"))) return "clinic_verification";
  if (!record.salesNavigatorAccountUrl || !record.salesNavigatorLeadUrl) return "account_matching";
  if (!record.workEmail || record.emailStatus !== "verified") return "email_verification";
  if (!record.ghlChecked) return "crm_check";
  if (missing.length) return "profile_and_qa";
  return "approval_ready";
}

function researchStatus() {
  const queue = loadResearch();
  const counts = {};
  for (const record of queue) {
    const stage = researchStage(record);
    counts[stage] = (counts[stage] ?? 0) + 1;
  }
  const ready = counts.approval_ready ?? 0;
  return {
    total: queue.length,
    counts,
    approvalReady: ready,
    readyQueueMinimum: CONFIG.readyQueueMinimum,
    readyFor100DailyLaunch: ready >= CONFIG.readyQueueMinimum,
    dailyDiscoveryTarget: CONFIG.researchCandidatesPerDay,
    dailyApprovalTarget: CONFIG.researchApprovalsPerDay,
  };
}

function validateProfiles() {
  const errors = [];
  const slugs = new Set();
  for (const profile of PROFILES) {
    if (slugs.has(profile.slug)) errors.push(`${profile.slug}: duplicate slug`);
    slugs.add(profile.slug);
    if (!/^[a-z0-9-]+$/.test(profile.slug)) errors.push(`${profile.slug}: unsafe slug`);
    if (!Array.isArray(profile.evidence) || profile.evidence.length === 0) errors.push(`${profile.slug}: missing evidence`);
    if (profile.status === "verified" && profile.legalEntityType !== "corporate") errors.push(`${profile.slug}: verified outreach profile must be corporate`);
    for (const source of profile.evidence ?? []) if (!isUrl(source.url)) errors.push(`${profile.slug}: invalid evidence URL`);
  }
  return errors;
}

function activationReadiness() {
  const blockers = [];
  const senderIssues = senderFailures();
  blockers.push(...senderIssues);
  if (!process.env.OUTREACH_TOKEN_SECRET || process.env.OUTREACH_TOKEN_SECRET.length < 32) blockers.push("TOKEN_SECRET_NOT_CONFIGURED");
  if (!process.env.GHL_OUTREACH_EVENT_WEBHOOK_URL) blockers.push("GHL_OUTREACH_EVENT_WEBHOOK_NOT_CONFIGURED");
  const research = researchStatus();
  if (research.approvalReady < CONFIG.readyQueueMinimum) blockers.push(`READY_QUEUE_BELOW_${CONFIG.readyQueueMinimum}`);
  const profileErrors = validateProfiles();
  if (profileErrors.length) blockers.push("PROFILE_CATALOGUE_INVALID");
  return { ready: blockers.length === 0, blockers, senderIssues, profileErrors, research };
}

function firstName(fullName) {
  return String(fullName).trim().split(/\s+/)[0] || "there";
}

function truncate(value, max) {
  const text = String(value).replace(/\s+/g, " ").trim();
  return text.length <= max ? text : `${text.slice(0, max - 3).trim()}...`;
}

function buildDrafts(record, profile, token) {
  const first = firstName(record.personName);
  const signal = record.clinicSignal || profile.signals[0].detail;
  const products = profile.relevantProducts.map((id) => PRODUCT_LABELS[id]).join(", ");
  const productUrl = `https://demo.sironaaesthetics.agency/r/${token}/email-1`;
  const funnelUrl = `https://demo.sironaaesthetics.agency/r/${token}/email-2`;
  const applicationUrl = `https://demo.sironaaesthetics.agency/r/${token}/email-3`;
  const brainUrl = `https://demo.sironaaesthetics.agency/r/${token}/email-4`;
  const optOut = "If this is not relevant, reply and I will not follow up.";
  const signature = "Best,\nJacqui\nSirona Aesthetics";
  const connectionNote = truncate(`Hi ${first}, I noticed ${profile.clinicName}'s work in ${record.verifiedServices[0]}. I am with Sirona Aesthetics and thought our VELURIA clinic work may be relevant.`, 178);
  return {
    email1: {
      subject: `${profile.clinicName}: a VELURIA skin-quality idea`,
      body: `Hi ${first},\n\nI noticed ${signal.toLowerCase()}\n\nVELURIA is PBSerum's four-product professional cosmetic range for skin-quality and scalp or hair pathways. Based on ${profile.clinicName}'s current offering, the most relevant starting point appears to be ${products}.\n\nI prepared a private product-fit example for your clinic: ${productUrl}\n\nWould this type of pathway be worth exploring?\n\n${signature}\n\n${optOut}`,
    },
    email2: {
      subject: `The VELURIA growth opportunity for ${profile.clinicName}`,
      body: `Hi ${first},\n\nThe reason I connected VELURIA with ${profile.clinicName} is not simply to add another product. Sirona pairs the range and training with a clinic-branded patient funnel.\n\nThe page below shows how paid campaigns and existing-client reactivation could create informed consultation opportunities, using gross revenue examples rather than profit claims:\n${funnelUrl}\n\nWould it be useful to map the model to your current services?\n\n${signature}\n\n${optOut}`,
    },
    email3: {
      subject: `A before-and-after application for ${profile.clinicName}`,
      body: `Hi ${first},\n\nI prepared the patient-facing part of the VELURIA idea for ${profile.clinicName}. It lets a patient explore a concern or use a permitted photograph, see an illustrative before-and-after experience, understand the relevant VELURIA pathway and move towards the clinic calendar.\n\nYou can test the doctor-facing preview here: ${applicationUrl}\n\nThe visual is the engagement point. Your clinic remains responsible for consultation, suitability and treatment.\n\n${signature}\n\n${optOut}`,
    },
    email4: {
      subject: `How the AI Sales Brain follows a VELURIA enquiry`,
      body: `Hi ${first},\n\nThe final part of the example is the optional AI Sales Brain. It knows which campaign produced the lead, what concern the patient explored, the consented analysis summary and the matched VELURIA pathway.\n\nIt can then coordinate approved messaging, calling, scheduling and handoff agents so each follow-up starts with the right context. The Brain is an additional, separately priced implementation:\n${brainUrl}\n\nIf this is worth examining, the free 20-minute VELURIA Clinic Growth Map is the place to review the right first phase for ${profile.clinicName}.\n\n${signature}\n\n${optOut}`,
    },
    linkedin: {
      connectionNote,
      messages: [
        `Thanks for connecting, ${first}. I prepared a private VELURIA product-fit example around ${profile.clinicName}'s ${record.verifiedServices[0]} work: ${productUrl}`,
        `The second part shows how the VELURIA range can connect to a clinic-branded acquisition funnel rather than sit as a product-only promotion: ${funnelUrl}`,
        `I also built the doctor preview of the before-and-after application. It shows the patient journey, VELURIA match and consultation handoff: ${applicationUrl}`,
        `The final page explains the optional AI Sales Brain, including campaign and analysis context across messaging, calling and booking agents: ${brainUrl}`,
      ],
    },
    links: { productUrl, funnelUrl, applicationUrl, brainUrl },
    personalisationSource: record.officialSourceUrl,
  };
}

function qaDrafts(drafts) {
  const failures = [];
  const text = JSON.stringify(drafts);
  if (/[\u2013\u2014]/u.test(text)) failures.push("LONG_DASH_PRESENT");
  if (/guarantee|guaranteed|fill your chairs|buying patients|ensure patients book/i.test(text)) failures.push("PROHIBITED_GUARANTEE_LANGUAGE");
  for (const id of ["email1", "email2", "email3", "email4"]) {
    if (!drafts[id].body.includes("If this is not relevant")) failures.push(`${id.toUpperCase()}_MISSING_OPT_OUT_COPY`);
  }
  if (drafts.linkedin.connectionNote.length > 180) failures.push("LINKEDIN_NOTE_TOO_LONG");
  return failures;
}

function researchImport(options) {
  const input = path.resolve(String(options.input || ""));
  if (!fs.existsSync(input)) throw new Error("research-import requires --input <json-or-csv>");
  const extension = path.extname(input).toLowerCase();
  const parsed = extension === ".json" ? readJson(input) : parseCsv(fs.readFileSync(input, "utf8"));
  if (!Array.isArray(parsed)) throw new Error("Research input must contain a list of records");
  const existing = loadResearch();
  const byIdentity = new Map(existing.map((record) => [`${clinicKey(record)}|${normalize(record.personName)}|${record.workEmail}`, record]));
  let inserted = 0;
  let updated = 0;
  parsed.forEach((item, index) => {
    const record = normalizeResearchRecord(item, index);
    const key = `${clinicKey(record)}|${normalize(record.personName)}|${record.workEmail}`;
    if (byIdentity.has(key)) { byIdentity.set(key, { ...byIdentity.get(key), ...record }); updated += 1; }
    else { byIdentity.set(key, record); inserted += 1; }
  });
  const queue = [...byIdentity.values()];
  writeJson(RESEARCH_PATH, queue);
  return { inserted, updated, ...researchStatus() };
}

function researchBrief() {
  return {
    dailyCandidateTarget: CONFIG.researchCandidatesPerDay,
    dailyApprovalTarget: CONFIG.researchApprovalsPerDay,
    allowedDiscoverySources: ["public search engines", "public UK clinic directories", "Google Business listings", "professional association directories", "existing Sirona CRM"],
    verificationChain: ["official clinic website", "Companies House", "Sales Navigator account", "Sales Navigator lead", "SalesQL work email", "Sirona GoHighLevel suppression check"],
    prohibited: ["automated LinkedIn scraping", "bulk LinkedIn interaction", "invented clinic facts", "unverified personal email", "identity-by-name-only"],
    requiredStages: ["discovered", "clinic_verification", "account_matching", "email_verification", "crm_check", "profile_and_qa", "approval_ready"],
  };
}

function introductionHoldReasons(record, state, selectedClinicKeys, now) {
  const reasons = researchMissing(record);
  const key = clinicKey(record);
  if (state.activeLocks[record.contactId]) reasons.push("CONTACT_ALREADY_LOCKED");
  if (state.sendReceipts.some((receipt) => receipt.contactId === record.contactId && receipt.stage === "email-1")) reasons.push("INTRODUCTION_ALREADY_SENT");
  if (selectedClinicKeys.has(key)) reasons.push("ANOTHER_PERSON_AT_CLINIC_ALREADY_SELECTED_TODAY");
  const clinic = state.clinics[key];
  if (clinic?.stoppedAt || clinic?.bookedAt || clinic?.engagedAt) reasons.push("CLINIC_ENGAGED_OR_SUPPRESSED");
  if (record.personOrder === 2) {
    if (!clinic?.firstContactAt) reasons.push("PRIMARY_PERSON_NOT_CONTACTED");
    else if (new Date(now) < new Date(addBusinessDays(clinic.firstContactAt, CONFIG.secondPersonDelayBusinessDays))) reasons.push("SECOND_PERSON_DELAY_NOT_MET");
  }
  return [...new Set(reasons)];
}

function createRunId(prefix = "vl") {
  return `${prefix}-${new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}-${crypto.randomBytes(3).toString("hex")}`;
}

function reservedSenderUsage(state, date) {
  const usage = Object.fromEntries(resolveSenders().map((sender) => [sender.id, { new: 0, total: 0, windows: {} }]));
  for (const receipt of state.sendReceipts) {
    if (londonDateKey(new Date(receipt.sentAt)) !== date || !usage[receipt.senderId]) continue;
    usage[receipt.senderId].total += 1;
    if (receipt.stage === "email-1") usage[receipt.senderId].new += 1;
  }
  if (!fs.existsSync(APPROVAL_DIR)) return usage;
  const reservingStatuses = new Set(["APPROVAL_REQUIRED", "APPROVED_WAITING_FOR_WINDOW", "READY_FOR_MANUAL_SEND"]);
  for (const name of fs.readdirSync(APPROVAL_DIR)) {
    if (!name.endsWith(".json")) continue;
    const packet = readJson(path.join(APPROVAL_DIR, name));
    const packetDate = packet.scheduledDate || londonDateKey(new Date(packet.createdAt));
    if (packetDate !== date || !reservingStatuses.has(packet.status)) continue;
    for (const item of packet.cleared ?? []) {
      const senderUsage = usage[item.sender?.id];
      if (!senderUsage) continue;
      const alreadySent = state.sendReceipts.some((receipt) => receipt.runId === packet.runId && receipt.contactId === item.contactId && receipt.stage === item.stage);
      if (alreadySent) continue;
      senderUsage.total += 1;
      if (item.stage === "email-1") {
        senderUsage.new += 1;
        senderUsage.windows[item.window] = (senderUsage.windows[item.window] ?? 0) + 1;
      }
    }
  }
  return usage;
}

function prepareIntroductions(options) {
  const state = loadState();
  const queue = loadResearch();
  const senders = resolveSenders();
  const senderIssues = senderFailures();
  if (senderIssues.length) throw new Error(`SENDER_POOL_NOT_READY: ${senderIssues.join(", ")}`);
  const requestedTarget = Math.min(Number(options.limit || CONFIG.newPeoplePerDay), CONFIG.newPeoplePerDay);
  const now = options.at ? new Date(String(options.at)).toISOString() : new Date().toISOString();
  const scheduledDate = londonDateKey(new Date(now));
  const senderUsage = reservedSenderUsage(state, scheduledDate);
  const alreadyReservedToday = Object.values(senderUsage).reduce((sum, item) => sum + item.new, 0);
  const limit = Math.min(requestedTarget, Math.max(0, CONFIG.newPeoplePerDay - alreadyReservedToday));
  const runId = createRunId("vl-new");
  const cleared = [];
  const held = [];
  const selectedClinics = new Set();
  for (const record of queue) {
    if (cleared.length >= limit) break;
    const reasons = introductionHoldReasons(record, state, selectedClinics, now);
    if (reasons.length) { held.push({ researchId: record.id, clinic: record.clinicName, person: record.personName, reasons }); continue; }
    const profile = profileFor(record);
    const token = issueToken({ contactId: record.contactId, clinicSlug: profile.slug, experiment: options.variant || "control" });
    const drafts = buildDrafts(record, profile, token);
    const qa = qaDrafts(drafts);
    if (qa.length) { held.push({ researchId: record.id, clinic: record.clinicName, person: record.personName, reasons: qa }); continue; }
    let sender = null;
    for (let offset = 0; offset < senders.length; offset += 1) {
      const candidate = senders[(alreadyReservedToday + cleared.length + offset) % senders.length];
      const usage = senderUsage[candidate.id];
      if (usage.new < CONFIG.newPeoplePerSenderPerDay && usage.total < CONFIG.totalMessagesPerSenderPerDay) {
        sender = candidate;
        break;
      }
    }
    if (!sender) {
      held.push({ researchId: record.id, clinic: record.clinicName, person: record.personName, reasons: ["ALL_SENDERS_AT_DAILY_CAP"] });
      break;
    }
    const ordinal = alreadyReservedToday + cleared.length;
    const window = ordinal < CONFIG.newPeoplePerWindow ? CONFIG.sendWindows[0] : CONFIG.sendWindows[1];
    const item = {
      researchId: record.id,
      contactId: record.contactId,
      clinicKey: clinicKey(record),
      clinic: record.clinicName,
      person: record.personName,
      personOrder: record.personOrder,
      role: record.currentRole,
      workEmail: record.workEmail,
      sender,
      window,
      linkedinPriority: cleared.length < CONFIG.linkedin.maxInvitationsPerDay,
      salesNavigatorAccountUrl: record.salesNavigatorAccountUrl,
      salesNavigatorLeadUrl: record.salesNavigatorLeadUrl,
      profileSlug: profile.slug,
      officialSourceUrl: record.officialSourceUrl,
      experiment: options.variant || "control",
      stage: "email-1",
      drafts,
      schedule: Object.fromEntries(CONFIG.email.stages.map((stage) => [stage.id, addBusinessDays(now, stage.delayBusinessDays)])),
      approval: "PENDING",
      recipientToken: token,
    };
    cleared.push(item);
    senderUsage[sender.id].new += 1;
    senderUsage[sender.id].total += 1;
    senderUsage[sender.id].windows[window] = (senderUsage[sender.id].windows[window] ?? 0) + 1;
    selectedClinics.add(item.clinicKey);
  }
  const senderCounts = Object.fromEntries(senders.map((sender) => [sender.id, cleared.filter((item) => item.sender.id === sender.id).length]));
  const packet = {
    runId,
    type: "INTRODUCTIONS",
    status: "APPROVAL_REQUIRED",
    createdAt: new Date().toISOString(),
    scheduledDate,
    locationId: CONFIG.locationId,
    target: requestedTarget,
    cleared,
    held,
    senderCounts,
    shortfall: Math.max(0, requestedTarget - cleared.length),
    alreadyReservedToday,
  };
  writeJson(path.join(APPROVAL_DIR, `${runId}.json`), packet);
  state.lastRunId = runId;
  for (const item of cleared) state.activeLocks[item.contactId] = runId;
  saveState(state);
  return packet;
}

function nextDueStage(contact) {
  return CONFIG.email.stages.find((stage) => !contact.sentStages?.includes(stage.id));
}

function prepareFollowups(options) {
  const state = loadState();
  const at = options.at ? new Date(String(options.at)) : new Date();
  const scheduledDate = londonDateKey(at);
  const senderUsage = reservedSenderUsage(state, scheduledDate);
  const runId = createRunId("vl-followup");
  const perSender = {};
  const cleared = [];
  const held = [];
  for (const contact of Object.values(state.contacts)) {
    if (contact.stoppedAt || contact.engagedAt || contact.bookedAt) continue;
    const stage = nextDueStage(contact);
    if (!stage || stage.id === "email-1") continue;
    const dueAt = contact.schedule?.[stage.id];
    if (!dueAt || new Date(dueAt) > at) continue;
    const reservedToday = senderUsage[contact.sender.id]?.total;
    const alreadySelected = perSender[contact.sender.id] ?? 0;
    if (reservedToday === undefined || reservedToday + alreadySelected >= CONFIG.totalMessagesPerSenderPerDay) {
      held.push({ contactId: contact.contactId, person: contact.person, stage: stage.id, reasons: ["SENDER_DAILY_TOTAL_CAP"] });
      continue;
    }
    perSender[contact.sender.id] = alreadySelected + 1;
    cleared.push({
      contactId: contact.contactId,
      clinicKey: contact.clinicKey,
      clinic: contact.clinic,
      person: contact.person,
      workEmail: contact.workEmail,
      sender: contact.sender,
      stage: stage.id,
      draft: contact.drafts[stage.id.replace("-", "")],
      recipientToken: contact.recipientToken,
      approval: "PENDING",
    });
  }
  const packet = { runId, type: "FOLLOWUPS", status: "APPROVAL_REQUIRED", createdAt: new Date().toISOString(), scheduledDate, locationId: CONFIG.locationId, cleared, held };
  writeJson(path.join(APPROVAL_DIR, `${runId}.json`), packet);
  state.lastRunId = runId;
  saveState(state);
  return packet;
}

function prepareReply(options) {
  if (!options.contact || !options.classification) throw new Error("prepare-reply requires --contact and --classification");
  const classification = String(options.classification).toLowerCase();
  if (!REPLY_CLASSIFICATIONS.has(classification)) throw new Error(`Unsupported reply classification: ${classification}`);
  const state = loadState();
  const contact = state.contacts[options.contact];
  if (!contact) throw new Error("Reply contact is not present in the receipt-backed campaign ledger");
  const occurredAt = options.at || new Date().toISOString();
  const clinic = state.clinics[contact.clinicKey] ?? { clinicKey: contact.clinicKey, clinic: contact.clinic };

  if (classification === "stop" || classification === "decline") {
    contact.stoppedAt = occurredAt;
    contact.stopReason = classification === "stop" ? "explicit_stop" : "negative_reply";
    clinic.stoppedAt = occurredAt;
    clinic.stopReason = contact.stopReason;
    state.clinics[contact.clinicKey] = clinic;
    delete state.activeLocks[options.contact];
    state.events.push({ id: crypto.randomUUID(), contactId: options.contact, event: contact.stopReason, stage: "reply", occurredAt, runId: null, note: "No further promotional follow-up." });
    saveState(state);
    return { contactId: options.contact, classification, status: "SUPPRESSED_NO_REPLY_PACKET", stoppedAt: occurredAt };
  }

  if (!options["draft-file"]) throw new Error("A personalised human-review draft is required via --draft-file");
  const draftPath = path.resolve(String(options["draft-file"]));
  if (!fs.existsSync(draftPath)) throw new Error("Reply draft file does not exist");
  const body = fs.readFileSync(draftPath, "utf8").trim();
  if (!body) throw new Error("Reply draft is empty");
  if (/[\u2013\u2014]/u.test(body)) throw new Error("Reply draft contains a long dash");
  if (/guarantee|guaranteed|fill your chairs|buying patients|ensure patients book/i.test(body)) throw new Error("Reply draft contains prohibited guarantee language");

  const scheduledDate = londonDateKey(new Date(occurredAt));
  const senderUsage = reservedSenderUsage(state, scheduledDate)[contact.sender.id];
  if (!senderUsage || senderUsage.total >= CONFIG.totalMessagesPerSenderPerDay) throw new Error("SENDER_DAILY_TOTAL_CAP");

  const runId = createRunId("vl-reply");
  const item = {
    contactId: contact.contactId,
    clinicKey: contact.clinicKey,
    clinic: contact.clinic,
    person: contact.person,
    workEmail: contact.workEmail,
    sender: contact.sender,
    channel: String(options.channel || "email").toLowerCase(),
    classification,
    stage: "reply",
    draft: { subject: options.subject || `Re: VELURIA for ${contact.clinic}`, body },
    approval: "PENDING",
  };
  const packet = {
    runId,
    type: "REPLY",
    status: "APPROVAL_REQUIRED",
    createdAt: new Date().toISOString(),
    scheduledDate,
    locationId: CONFIG.locationId,
    cleared: [item],
    held: [],
  };
  writeJson(path.join(APPROVAL_DIR, `${runId}.json`), packet);
  contact.engagedAt = occurredAt;
  contact.engagementEvent = `reply_${classification}`;
  clinic.engagedAt ??= occurredAt;
  clinic.engagementEvent = `reply_${classification}`;
  state.clinics[contact.clinicKey] = clinic;
  state.activeLocks[contact.contactId] = runId;
  state.lastRunId = runId;
  state.events.push({ id: crypto.randomUUID(), contactId: options.contact, event: "reply_draft_prepared", stage: "reply", occurredAt, runId, note: classification });
  saveState(state);
  return packet;
}

function approve(options) {
  if (!options.run || !options.by) throw new Error("approve requires --run and --by");
  const file = path.join(APPROVAL_DIR, `${options.run}.json`);
  const packet = readJson(file);
  packet.status = "APPROVED_WAITING_FOR_WINDOW";
  packet.approvedAt = new Date().toISOString();
  packet.approvedBy = options.by;
  for (const item of packet.cleared) item.approval = "APPROVED";
  writeJson(file, packet);
  return { runId: options.run, status: packet.status, approvedBy: packet.approvedBy, count: packet.cleared.length };
}

function release(options) {
  if (!options.run) throw new Error("release requires --run");
  const state = loadState();
  if (state.status !== "ACTIVE") throw new Error(`LOOP_${state.status}: transmission release is disabled`);
  const packetPath = path.join(APPROVAL_DIR, `${options.run}.json`);
  const packet = readJson(packetPath);
  if (packet.status !== "APPROVED_WAITING_FOR_WINDOW") throw new Error("Batch is not approved");
  const at = options.at ? new Date(String(options.at)) : new Date();
  const gate = clockGate(at);
  if (!gate.allowed) throw new Error(`CLOCK_GATE: ${gate.reason}`);
  if (packet.locationId !== CONFIG.locationId) throw new Error("GHL_LOCATION_MISMATCH");
  const window = options.window || CONFIG.sendWindows.find((item) => gate.time >= item && gate.time < `${String(Number(item.slice(0, 2)) + 1).padStart(2, "0")}:${item.slice(3)}`);
  const actions = packet.type === "INTRODUCTIONS" ? packet.cleared.filter((item) => item.window === window) : packet.cleared;
  packet.status = "READY_FOR_MANUAL_SEND";
  packet.releasedAt = new Date().toISOString();
  packet.clockGate = gate;
  packet.releaseWindow = window;
  writeJson(packetPath, packet);
  return { runId: options.run, status: packet.status, count: actions.length, actions, gate, note: "No messages were transmitted. Complete each approved send and record its receipt." };
}

function findPacketItem(runId, contactId) {
  if (!runId) return null;
  const file = path.join(APPROVAL_DIR, `${runId}.json`);
  if (!fs.existsSync(file)) return null;
  return readJson(file).cleared.find((item) => item.contactId === contactId) ?? null;
}

function record(options) {
  if (!options.contact || !options.event) throw new Error("record requires --contact and --event");
  if (!ALLOWED_EVENTS.has(options.event)) throw new Error("Unsupported event");
  const state = loadState();
  const occurredAt = options.at || new Date().toISOString();
  const event = { id: crypto.randomUUID(), contactId: options.contact, event: options.event, stage: options.stage || null, occurredAt, runId: options.run || null, note: options.note || "" };
  state.events.push(event);
  let contact = state.contacts[options.contact];
  const packetItem = findPacketItem(options.run, options.contact);
  if (options.event === "sent") {
    if (!options.stage || !packetItem) throw new Error("sent requires --stage and a valid --run packet containing the contact");
    const duplicate = state.sendReceipts.some((receipt) => receipt.contactId === options.contact && receipt.stage === options.stage);
    if (duplicate) throw new Error("SEND_RECEIPT_ALREADY_EXISTS");
    const sender = packetItem.sender;
    state.sendReceipts.push({ id: crypto.randomUUID(), contactId: options.contact, stage: options.stage, senderId: sender.id, sentAt: occurredAt, runId: options.run });
    if (!contact) {
      contact = {
        contactId: packetItem.contactId,
        clinicKey: packetItem.clinicKey,
        clinic: packetItem.clinic,
        person: packetItem.person,
        personOrder: packetItem.personOrder,
        workEmail: packetItem.workEmail,
        sender,
        recipientToken: packetItem.recipientToken,
        drafts: packetItem.drafts,
        schedule: packetItem.schedule,
        sentStages: [],
        firstSentAt: occurredAt,
      };
      state.contacts[options.contact] = contact;
    }
    contact.sentStages = [...new Set([...(contact.sentStages ?? []), options.stage])];
    if (options.stage === "email-1") {
      state.distinctPeopleContacted += 1;
      const clinic = state.clinics[contact.clinicKey] ?? { clinicKey: contact.clinicKey, clinic: contact.clinic };
      clinic.firstContactAt ??= occurredAt;
      state.clinics[contact.clinicKey] = clinic;
    }
  }
  if (contact && HIGH_INTENT_EVENTS.has(options.event)) {
    contact.engagedAt ??= occurredAt;
    contact.engagementEvent = options.event;
    const clinic = state.clinics[contact.clinicKey] ?? { clinicKey: contact.clinicKey, clinic: contact.clinic };
    clinic.engagedAt ??= occurredAt;
    clinic.engagementEvent = options.event;
    state.clinics[contact.clinicKey] = clinic;
  }
  if (contact && options.event === "booked") {
    contact.bookedAt = occurredAt;
    state.clinics[contact.clinicKey].bookedAt = occurredAt;
    for (const candidate of Object.values(state.contacts)) if (candidate.clinicKey === contact.clinicKey) candidate.stoppedAt = occurredAt;
  }
  if (contact && STOP_EVENTS.has(options.event)) {
    contact.stoppedAt = occurredAt;
    contact.stopReason = options.event;
    delete state.activeLocks[options.contact];
    if (String(options.scope).toLowerCase() === "clinic") {
      const clinic = state.clinics[contact.clinicKey] ?? { clinicKey: contact.clinicKey, clinic: contact.clinic };
      clinic.stoppedAt = occurredAt;
      clinic.stopReason = options.event;
      state.clinics[contact.clinicKey] = clinic;
    }
  }
  saveState(state);
  return event;
}

function learn() {
  const state = loadState();
  const totals = {};
  for (const event of state.events) totals[event.event] = (totals[event.event] || 0) + 1;
  const delivered = totals.delivered ?? 0;
  const booked = totals.booked ?? 0;
  const positive = totals.positive_reply ?? 0;
  const hardBounces = totals.hard_bounce ?? 0;
  const complaints = totals.complaint ?? 0;
  return {
    status: state.status,
    distinctPeopleContacted: state.distinctPeopleContacted,
    outcomes: totals,
    rates: {
      bookedPercent: delivered ? Math.round((booked / delivered) * 10000) / 100 : 0,
      positiveReplyPercent: delivered ? Math.round((positive / delivered) * 10000) / 100 : 0,
      hardBouncePercent: delivered ? Math.round((hardBounces / delivered) * 10000) / 100 : 0,
      complaintPercent: delivered ? Math.round((complaints / delivered) * 10000) / 100 : 0,
    },
    primaryMetric: CONFIG.experiments.primaryMetric,
    decision: delivered >= 300 && booked === 0 && positive === 0
      ? "PAUSE_AND_AUDIT_ZERO_INTENT_AFTER_300_DELIVERED"
      : hardBounces / Math.max(delivered, 1) >= 0.02 || complaints > 0
        ? "PAUSE_AFFECTED_SENDER_AND_AUDIT_DELIVERABILITY"
        : "CONTINUE_CONTROLLED_COHORTS",
  };
}

function initialise() {
  fs.mkdirSync(APPROVAL_DIR, { recursive: true });
  saveState(loadState());
  if (!fs.existsSync(EVIDENCE_PATH)) writeJson(EVIDENCE_PATH, {});
  if (!fs.existsSync(RESEARCH_PATH)) writeJson(RESEARCH_PATH, []);
  return { statePath: STATE_PATH, evidencePath: EVIDENCE_PATH, researchPath: RESEARCH_PATH, status: loadState().status };
}

function activate(options) {
  if (options["funnel-approved"] !== "yes" || options["senders-approved"] !== "yes" || options["research-approved"] !== "yes" || !options.by) {
    throw new Error("activate requires --funnel-approved yes --senders-approved yes --research-approved yes --by <reviewer>");
  }
  const readiness = activationReadiness();
  if (!readiness.ready) throw new Error(`ACTIVATION_BLOCKED: ${readiness.blockers.join(", ")}`);
  const state = loadState();
  state.status = "ACTIVE";
  state.pausedReason = null;
  state.activatedAt = new Date().toISOString();
  state.activatedBy = options.by;
  saveState(state);
  return { status: state.status, activatedBy: state.activatedBy };
}

function tokenCommand(options) {
  if (!options.contact || !options.clinic) throw new Error("token requires --contact and --clinic");
  const profile = PROFILES.find((item) => item.slug === options.clinic);
  if (!profile) throw new Error("Unknown clinic profile");
  return { token: issueToken({ contactId: options.contact, clinicSlug: options.clinic, experiment: options.variant || "control" }), clinic: options.clinic, contactId: options.contact };
}

const { command, options } = args();
let result;
if (command === "init") result = initialise();
else if (command === "status") result = { ...loadState(), readiness: activationReadiness(), research: researchStatus(), clockGate: clockGate(options.at ? new Date(String(options.at)) : new Date()) };
else if (command === "window") result = clockGate(options.at ? new Date(String(options.at)) : new Date());
else if (command === "validate") result = { ok: validateProfiles().length === 0, errors: validateProfiles(), profileCount: PROFILES.length, config: CONFIG };
else if (command === "readiness") result = activationReadiness();
else if (command === "research-brief") result = researchBrief();
else if (command === "research-status") result = researchStatus();
else if (command === "research-import") result = researchImport(options);
else if (command === "prepare") result = prepareIntroductions(options);
else if (command === "prepare-followups") result = prepareFollowups(options);
else if (command === "prepare-reply") result = prepareReply(options);
else if (command === "approve") result = approve(options);
else if (command === "release") result = release(options);
else if (command === "record") result = record(options);
else if (command === "learn") result = learn();
else if (command === "activate") result = activate(options);
else if (command === "token") result = tokenCommand(options);
else throw new Error(`Unknown command: ${command}`);
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
