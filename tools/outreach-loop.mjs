import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PRIVATE_DIR = path.join(ROOT, "outreach-private");
const STATE_PATH = path.join(PRIVATE_DIR, "state.json");
const EVIDENCE_PATH = path.join(PRIVATE_DIR, "recipient-evidence.json");
const APPROVAL_DIR = path.join(PRIVATE_DIR, "approvals");
const CONFIG = readJson(path.join(ROOT, "outreach-loop.config.json"));
const PROFILES = readJson(path.join(ROOT, "data", "clinic-profiles.json"));
const PRODUCT_LABELS = {
  "silk-skin": "VELURIA Silk Skin",
  "ultra-lift": "VELURIA Ultra Lift",
  "pearl-tone": "VELURIA Pearl Tone",
  "hair-force-plus": "VELURIA Hair Force+",
};

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
    version: 1,
    campaignId: CONFIG.campaignId,
    status: "PAUSED",
      pausedReason: "Real recipient evidence, approved clinic profiles and final message approval are required before activation.",
    updatedAt: new Date().toISOString(),
    distinctPeopleContacted: 10,
    lastRunId: null,
    activeLocks: {},
    sendReceipts: [],
    events: [],
    cohorts: [],
    currentExperiment: {
      variable: "consultation_offer",
      control: "webinar",
      variant: "free_clinic_growth_map",
      status: "READY_FOR_PILOT_REVIEW"
    }
  };
}

function loadState() {
  if (!fs.existsSync(STATE_PATH)) return defaultState();
  return readJson(STATE_PATH);
}

function saveState(state) {
  state.updatedAt = new Date().toISOString();
  writeJson(STATE_PATH, state);
}

function londonParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: CONFIG.timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  return Object.fromEntries(parts.map(({ type, value }) => [type, value]));
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

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"') {
      if (quoted && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[index + 1] === "\n") index += 1;
      row.push(field);
      if (row.some((value) => value.length > 0)) rows.push(row);
      row = [];
      field = "";
    } else field += char;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [headers, ...body] = rows;
  return body.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

function normalize(value) {
  return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function isWorkEmail(email) {
  const domain = String(email).trim().toLowerCase().split("@")[1] ?? "";
  return domain && !new Set(["gmail.com", "hotmail.com", "outlook.com", "yahoo.com", "icloud.com", "aol.com"]).has(domain);
}

function profileFor(row) {
  return PROFILES.find((profile) =>
    profile.status === "verified" && normalize(profile.clinicName) === normalize(row["Business Name"]),
  );
}

function holdReasons(row, profile, evidence, state) {
  const reasons = [];
  if (!profile) reasons.push("NO_APPROVED_CLINIC_PROFILE");
  if (!row["Contact Id"]) reasons.push("MISSING_GHL_CONTACT_ID");
  if (!row["Contact Name"]) reasons.push("MISSING_CONTACT_NAME");
  if (!evidence) reasons.push("MISSING_RECIPIENT_EVIDENCE");
  if (evidence && evidence.identityMatch !== "exact") reasons.push("IDENTITY_NOT_EXACT");
  if (evidence && evidence.emailStatus !== "verified") reasons.push("EMAIL_NOT_VERIFIED");
  const email = evidence?.workEmail || row.Email;
  if (!isWorkEmail(email)) reasons.push("NOT_VERIFIED_WORK_EMAIL");
  if (profile && profile.legalEntityType !== "corporate") reasons.push("CORPORATE_STATUS_NOT_CONFIRMED");
  if (evidence?.dnd || evidence?.unsubscribed || evidence?.suppressed || evidence?.hardBounce || evidence?.explicitStop) reasons.push("SUPPRESSION_OR_STOP_SIGNAL");
  if (!evidence?.salesNavigatorLeadUrl) reasons.push("MISSING_SALES_NAVIGATOR_LEAD");
  if (!evidence?.officialSourceUrl) reasons.push("MISSING_PERSONALISATION_SOURCE");
  if (!process.env.OUTREACH_TOKEN_SECRET || process.env.OUTREACH_TOKEN_SECRET.length < 32) reasons.push("TOKEN_SECRET_NOT_CONFIGURED");
  if (state.activeLocks[row["Contact Id"]]) reasons.push("CONTACT_ALREADY_LOCKED");
  if (state.sendReceipts.some((receipt) => receipt.contactId === row["Contact Id"] && receipt.stage === "email-1")) reasons.push("STAGE_ALREADY_SENT");
  return [...new Set(reasons)];
}

function firstName(fullName) {
  return String(fullName).trim().split(/\s+/)[0] || "there";
}

function buildDrafts(row, profile, evidence, token) {
  const first = firstName(row["Contact Name"]);
  const signal = profile.signals[0];
  const products = profile.relevantProducts.map((id) => PRODUCT_LABELS[id]).join(", ");
  const overview = `https://demo.sironaaesthetics.agency/r/${token}/email-1`;
  const demo = `https://demo.sironaaesthetics.agency/r/${token}/email-2`;
  const report = `https://demo.sironaaesthetics.agency/r/${token}/email-3`;
  const book = `https://demo.sironaaesthetics.agency/book/${token}/email-4`;
  return {
    email1: {
      subject: `${profile.clinicName}: a VELURIA skin-quality idea`,
      body: `Hi ${first},\n\nI was looking at ${signal.detail.toLowerCase()} and thought the VELURIA range could be relevant to the patient conversations already happening at ${profile.clinicName}.\n\nVELURIA is PBSerum's professional cosmetic bioremodelling range. It combines recombinant-enzyme biotechnology with selected cosmetic actives to support visible parameters such as texture, tone, firmness, luminosity and vitality. For your clinic, the most relevant starting point appears to be ${products}.\n\nI prepared a private example around your current offering here: ${overview}\n\nWould this type of skin-quality pathway be worth exploring?\n\nBest,\nJacqui\nSirona Aesthetics\n\nIf this is not relevant, reply and I will not follow up.`,
    },
    email2: {
      subject: `What the VELURIA pathway could change for ${profile.clinicName}`,
      body: `Hi ${first},\n\nThe reason I connected VELURIA with ${profile.clinicName} is not simply to add another product. ${profile.pipelineOpportunity}\n\nThe working preview shows the real VELURIA result first, then lets a prospective patient experience the clinic-branded AI journey: ${demo}\n\nIt is designed to give the treatment story a clearer route into an enquiry and consultation, while your clinical team remains in control.\n\nBest,\nJacqui\nSirona Aesthetics\n\nIf this is not relevant, reply and I will not follow up.`,
    },
    email3: {
      subject: `A sample patient-pipeline report for ${profile.clinicName}`,
      body: `Hi ${first},\n\nI also prepared the commercial side of the example for ${profile.clinicName}. It compares product-only promotion with a connected journey that attracts attention, creates interaction, captures consented interest and supports follow-up.\n\nYou can see the sample clinic-growth report here: ${report}\n\nIt is a working model rather than a patient-volume or revenue promise. The purpose is to make the assumptions and implementation steps visible before any decision.\n\nBest,\nJacqui\nSirona Aesthetics\n\nIf this is not relevant, reply and I will not follow up.`,
    },
    email4: {
      subject: `A 20-minute VELURIA growth map for ${profile.clinicName}`,
      body: `Hi ${first},\n\nI will close the loop here. If the combination of the VELURIA range and clinic-branded patient journey is worth examining, I would be happy to map it to ${profile.clinicName} in a free 20-minute call.\n\nWe would cover the most relevant product pathway, the patient funnel and one practical next step: ${book}\n\nBest,\nJacqui\nSirona Aesthetics\n\nIf this is not relevant, reply and I will not follow up.`,
    },
    linkedinInMail: `Hi ${first}, I noticed ${signal.detail.toLowerCase()}. I prepared a short VELURIA product and patient-journey example for ${profile.clinicName}. Would it be useful if I sent it over?`,
    personalisationSource: evidence.officialSourceUrl,
  };
}

function qaDrafts(drafts) {
  const text = JSON.stringify(drafts);
  const failures = [];
  if (text.includes("—")) failures.push("EM_DASH_PRESENT");
  if (/guarantee|guaranteed|fill your chairs|buying patients/i.test(text)) failures.push("PROHIBITED_GUARANTEE_LANGUAGE");
  if (!text.includes("If this is not relevant")) failures.push("MISSING_OPT_OUT_COPY");
  return failures;
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
    for (const source of profile.evidence ?? []) {
      try { new URL(source.url); } catch { errors.push(`${profile.slug}: invalid evidence URL`); }
    }
  }
  return errors;
}

function initialise() {
  fs.mkdirSync(APPROVAL_DIR, { recursive: true });
  if (!fs.existsSync(STATE_PATH)) saveState(defaultState());
  if (!fs.existsSync(EVIDENCE_PATH)) writeJson(EVIDENCE_PATH, {});
  return { statePath: STATE_PATH, evidencePath: EVIDENCE_PATH, status: loadState().status };
}

function prepare(options) {
  const state = loadState();
  if (state.status === "PAUSED") throw new Error("LOOP_PAUSED: approval and explicit activation are required before preparing a live batch");
  const input = path.resolve(options.input || "");
  if (!fs.existsSync(input)) throw new Error("--input must point to the source CSV");
  const evidence = fs.existsSync(EVIDENCE_PATH) ? readJson(EVIDENCE_PATH) : {};
  const rows = parseCsv(fs.readFileSync(input, "utf8"));
  const limit = Math.min(Number(options.limit || CONFIG.maxDistinctPeoplePerWindow), CONFIG.maxDistinctPeoplePerWindow);
  const runId = `vl-${new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}-${crypto.randomBytes(3).toString("hex")}`;
  const cleared = [];
  const held = [];
  for (const row of rows) {
    if (cleared.length >= limit) break;
    const profile = profileFor(row);
    const recipientEvidence = evidence[row["Contact Id"]];
    const reasons = holdReasons(row, profile, recipientEvidence, state);
    if (reasons.length) {
      held.push({ contactId: row["Contact Id"], clinic: row["Business Name"], person: row["Contact Name"], reasons });
      continue;
    }
    const token = issueToken({ contactId: row["Contact Id"], clinicSlug: profile.slug, experiment: options.variant || "control" });
    const drafts = buildDrafts(row, profile, recipientEvidence, token);
    const qa = qaDrafts(drafts);
    if (qa.length) {
      held.push({ contactId: row["Contact Id"], clinic: row["Business Name"], person: row["Contact Name"], reasons: qa });
      continue;
    }
    cleared.push({
      contactId: row["Contact Id"], clinic: row["Business Name"], person: row["Contact Name"],
      role: recipientEvidence.currentRole, workEmail: recipientEvidence.workEmail,
      salesNavigatorLeadUrl: recipientEvidence.salesNavigatorLeadUrl, profileSlug: profile.slug,
      officialSourceUrl: recipientEvidence.officialSourceUrl, connectionState: recipientEvidence.connectionState,
      experiment: options.variant || "control", drafts, approval: "PENDING",
      recipientToken: token,
    });
  }
  const packet = { runId, status: "APPROVAL_REQUIRED", createdAt: new Date().toISOString(), locationId: CONFIG.locationId, cleared, held };
  writeJson(path.join(APPROVAL_DIR, `${runId}.json`), packet);
  state.lastRunId = runId;
  for (const item of cleared) state.activeLocks[item.contactId] = runId;
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
  return { runId: options.run, status: packet.status, approvedBy: packet.approvedBy };
}

function release(options) {
  if (!options.run) throw new Error("release requires --run");
  const state = loadState();
  if (state.status !== "ACTIVE") throw new Error(`LOOP_${state.status}: transmission release is disabled`);
  const packet = readJson(path.join(APPROVAL_DIR, `${options.run}.json`));
  if (packet.status !== "APPROVED_WAITING_FOR_WINDOW") throw new Error("Batch is not approved");
  const gate = clockGate(options.at ? new Date(options.at) : new Date());
  if (!gate.allowed) throw new Error(`CLOCK_GATE: ${gate.reason}`);
  if (packet.locationId !== CONFIG.locationId) throw new Error("GHL_LOCATION_MISMATCH");
  packet.status = "READY_FOR_MANUAL_SEND";
  packet.releasedAt = new Date().toISOString();
  packet.clockGate = gate;
  writeJson(path.join(APPROVAL_DIR, `${options.run}.json`), packet);
  return { runId: options.run, status: packet.status, count: packet.cleared.length, gate, note: "No messages were transmitted. Complete each approved send manually and reconcile before recording a receipt." };
}

function record(options) {
  if (!options.contact || !options.event) throw new Error("record requires --contact and --event");
  const state = loadState();
  const allowed = new Set(["delivered", "hard_bounce", "positive_reply", "negative_reply", "booking_click", "booked", "attended", "qualified", "unsubscribe", "complaint", "linkedin_accept", "linkedin_reply", "ai_complete", "report_view"]);
  if (!allowed.has(options.event)) throw new Error("Unsupported event");
  state.events.push({ id: crypto.randomUUID(), contactId: options.contact, event: options.event, occurredAt: options.at || new Date().toISOString(), runId: options.run || null, note: options.note || "" });
  if (["hard_bounce", "negative_reply", "unsubscribe", "complaint", "booked"].includes(options.event)) delete state.activeLocks[options.contact];
  saveState(state);
  return state.events.at(-1);
}

function learn() {
  const state = loadState();
  const totals = {};
  for (const event of state.events) totals[event.event] = (totals[event.event] || 0) + 1;
  return {
    status: state.status,
    distinctPeopleContacted: state.distinctPeopleContacted,
    outcomes: totals,
    primaryMetric: CONFIG.experiments.primaryMetric,
    decision: totals.booked || totals.positive_reply || totals.booking_click
      ? "REVIEW_COHORT_AFTER_MINIMUM_SAMPLE"
      : "NO_PROMOTION_DECISION_FROM_OPENS_OR_INCOMPLETE_COHORT",
  };
}

function activate(options) {
  if (options["funnel-approved"] !== "yes" || !options.by) throw new Error("activate requires --funnel-approved yes --by <reviewer>");
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
  return {
    token: issueToken({ contactId: options.contact, clinicSlug: options.clinic, experiment: options.variant || "control" }),
    clinic: options.clinic,
    contactId: options.contact,
  };
}

const { command, options } = args();
let result;
if (command === "init") result = initialise();
else if (command === "status") result = { ...loadState(), clockGate: clockGate(options.at ? new Date(options.at) : new Date()) };
else if (command === "window") result = clockGate(options.at ? new Date(options.at) : new Date());
else if (command === "validate") result = { ok: validateProfiles().length === 0, errors: validateProfiles(), profileCount: PROFILES.length };
else if (command === "prepare") result = prepare(options);
else if (command === "approve") result = approve(options);
else if (command === "release") result = release(options);
else if (command === "record") result = record(options);
else if (command === "learn") result = learn();
else if (command === "activate") result = activate(options);
else if (command === "token") result = tokenCommand(options);
else throw new Error(`Unknown command: ${command}`);
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
