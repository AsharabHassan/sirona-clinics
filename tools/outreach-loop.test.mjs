import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const controller = path.join(root, "tools", "outreach-loop.mjs");

function senderEnv() {
  const env = {};
  for (let index = 1; index <= 1; index += 1) {
    env[`SIRONA_OUTREACH_SENDER_${index}_EMAIL`] = `sender${index}@sironaaesthetics.co.uk`;
    env[`SIRONA_OUTREACH_SENDER_${index}_NAME`] = `Approved Sirona Sender ${index}`;
    env[`SIRONA_OUTREACH_SENDER_${index}_AUTHENTICATED`] = "yes";
  }
  return env;
}

function sandboxEnv(extra = {}) {
  const privateDir = fs.mkdtempSync(path.join(os.tmpdir(), "veluria-outreach-test-"));
  return {
    OUTREACH_PRIVATE_DIR: privateDir,
    OUTREACH_TOKEN_SECRET: "test-only-secret-that-is-longer-than-thirty-two-characters",
    OUTREACH_ALLOW_DEMO_PROFILE: "yes",
    GHL_OUTREACH_EVENT_WEBHOOK_URL: "https://example.test/ghl-events",
    ...senderEnv(),
    ...extra,
  };
}

function run(args, env = sandboxEnv()) {
  return JSON.parse(execFileSync(process.execPath, [controller, ...args], {
    cwd: root,
    env: { ...process.env, ...env },
    encoding: "utf8",
  }));
}

function completeRecord(overrides = {}) {
  return {
    id: "research-example-1",
    discoverySourceUrl: "https://example.com/directory/example-skin-clinic",
    clinicName: "Example Skin Clinic",
    officialWebsite: "https://demo.sironaaesthetics.agency/",
    city: "London",
    officialSourceUrl: "https://demo.sironaaesthetics.agency/",
    companiesHouseNumber: "12345678",
    companiesHouseStatus: "active",
    clinicFit: "qualified",
    verifiedServices: ["Professional skin treatments"],
    clinicSignal: "the clinic publicly presents professional skin treatments and patient consultations.",
    profileSlug: "example-skin-clinic",
    contactId: "contact-test-1",
    personName: "Alex Example",
    currentRole: "Clinic Director",
    personOrder: 1,
    salesNavigatorAccountUrl: "https://www.linkedin.com/sales/company/123",
    salesNavigatorLeadUrl: "https://www.linkedin.com/sales/lead/123",
    salesQlChecked: true,
    workEmail: "alex@exampleclinic.co.uk",
    emailStatus: "verified",
    identityMatch: "exact",
    ghlChecked: true,
    connectionState: "not-connected",
    verifiedAt: "2026-08-10",
    ...overrides,
  };
}

function importResearch(env, records) {
  const file = path.join(env.OUTREACH_PRIVATE_DIR, "input.json");
  fs.writeFileSync(file, JSON.stringify(records), "utf8");
  return run(["research-import", "--input", file], env);
}

test("profile catalogue and 100-person operating configuration validate", () => {
  const result = run(["validate"]);
  assert.equal(result.ok, true);
  assert.equal(result.config.newPeoplePerDay, 100);
  assert.equal(result.config.newPeoplePerWindow, 50);
  assert.equal(result.config.researchCandidatesPerDay, 120);
  assert.equal(result.config.researchApprovalsPerDay, 100);
  assert.equal(result.config.programmeCap, null);
  assert.equal(result.config.senderPool.length, 1);
  assert.equal(result.config.linkedin.maxInvitationsPerDay, 20);
  assert.deepEqual(result.config.email.stages.map((stage) => stage.delayBusinessDays), [0, 3, 7, 12]);
});

test("UK Thursday 09:30 is an allowed release window", () => {
  const result = run(["window", "--at", "2026-08-06T08:30:00Z"]);
  assert.equal(result.time, "09:30");
  assert.equal(result.allowed, true);
});

test("Sunday and 18:00 UK are hard locked", () => {
  const env = sandboxEnv();
  const sunday = run(["window", "--at", "2026-08-09T08:30:00Z"], env);
  const evening = run(["window", "--at", "2026-08-06T17:00:00Z"], env);
  assert.equal(sunday.reason, "SUNDAY_LOCKOUT");
  assert.equal(evening.reason, "AFTER_1800_LOCKOUT");
});

test("controller starts paused and cannot release messages", () => {
  const env = sandboxEnv();
  const status = run(["status"], env);
  assert.equal(status.status, "PAUSED");
  const result = spawnSync(process.execPath, [controller, "release", "--run", "missing"], {
    cwd: root,
    env: { ...process.env, ...env },
    encoding: "utf8",
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /LOOP_PAUSED/);
});

test("rolling activation readiness requires one fully cleared recipient", () => {
  const result = run(["readiness"]);
  assert.equal(result.ready, false);
  assert.ok(result.blockers.includes("READY_QUEUE_BELOW_1"));
});

test("research import applies the approved verification chain", () => {
  const env = sandboxEnv();
  const imported = importResearch(env, [completeRecord()]);
  assert.equal(imported.approvalReady, 1);
  const weak = completeRecord({ id: "weak", contactId: "weak-contact", workEmail: "person@gmail.com", emailStatus: "unverified" });
  const second = importResearch(env, [weak]);
  assert.equal(second.counts.email_verification, 1);
});

test("a verified clinician can carry a referral-first introduction", () => {
  const env = sandboxEnv();
  importResearch(env, [completeRecord({
    recipientType: "clinical-referral",
    personName: "Dr Alex Example",
    currentRole: "Aesthetic Doctor",
  })]);
  const packet = run(["prepare", "--limit", "1", "--at", "2026-08-10T08:30:00Z"], env);
  assert.equal(packet.cleared.length, 1);
  assert.equal(packet.cleared[0].recipientType, "clinical-referral");
  assert.match(packet.cleared[0].drafts.email1.body, /comfortable forwarding this/);
});

test("an official clinic inbox can carry the message without a named lead", () => {
  const env = sandboxEnv();
  importResearch(env, [completeRecord({
    recipientType: "clinic-inbox",
    personName: "Example Skin Clinic team",
    currentRole: "Clinic team",
    salesNavigatorLeadUrl: "",
    salesQlChecked: false,
    workEmail: "hello@demo.sironaaesthetics.agency",
    emailStatus: "official-role-inbox",
    identityMatch: "clinic-exact",
    connectionState: "unresolved",
  })]);
  const packet = run(["prepare", "--limit", "1", "--at", "2026-08-10T08:30:00Z"], env);
  assert.equal(packet.cleared.length, 1);
  assert.equal(packet.cleared[0].recipientType, "clinic-inbox");
  assert.equal(packet.cleared[0].linkedinPriority, false);
  assert.match(packet.cleared[0].drafts.email1.body, /Hello Example Skin Clinic team/);
  assert.match(packet.cleared[0].drafts.email1.body, /please pass this/);
});

test("a clinic inbox on another domain remains held", () => {
  const env = sandboxEnv();
  const result = importResearch(env, [completeRecord({
    recipientType: "clinic-inbox",
    personName: "Example Skin Clinic team",
    currentRole: "Clinic team",
    salesNavigatorLeadUrl: "",
    salesQlChecked: false,
    workEmail: "hello@anotherclinic.co.uk",
    emailStatus: "official-role-inbox",
    identityMatch: "clinic-exact",
  })]);
  assert.equal(result.approvalReady, 0);
  assert.equal(result.counts.clinic_verification, 1);
});

test("daily packet uses the approved sender and current four landing pages", () => {
  const env = sandboxEnv();
  const records = Array.from({ length: 10 }, (_, index) => completeRecord({
    id: `research-${index}`,
    clinicName: `Example Skin Clinic ${index}`,
    officialWebsite: `https://clinic-${index}.example/`,
    contactId: `contact-${index}`,
    personName: `Doctor ${index}`,
    workEmail: `doctor${index}@clinic-${index}.example`,
  }));
  // All records intentionally share the approved demo profile through profileSlug.
  importResearch(env, records);
  const packet = run(["prepare", "--limit", "10", "--at", "2026-08-10T08:30:00Z"], env);
  assert.equal(packet.cleared.length, 10);
  assert.equal(packet.status, "APPROVED_WAITING_FOR_WINDOW");
  assert.equal(packet.approvedBy, "standing-user-authorisation");
  assert.equal(packet.cleared.every((item) => item.approval === "APPROVED"), true);
  assert.deepEqual(Object.values(packet.senderCounts), [10]);
  assert.equal(packet.cleared[0].drafts.email3.body.includes("/email-3"), true);
  assert.equal(packet.cleared[0].drafts.email4.body.includes("/email-4"), true);
  assert.ok(packet.cleared[0].drafts.linkedin.connectionNote.length <= 180);
});

test("same-day packet reservations enforce the 100-total single-sender cap", () => {
  const env = sandboxEnv();
  const records = Array.from({ length: 105 }, (_, index) => completeRecord({
    id: `capacity-research-${index}`,
    clinicName: `Capacity Skin Clinic ${index}`,
    officialWebsite: `https://capacity-${index}.example/`,
    contactId: `capacity-contact-${index}`,
    personName: `Doctor Capacity ${index}`,
    workEmail: `doctor${index}@capacity-${index}.example`,
  }));
  importResearch(env, records);
  const first = run(["prepare", "--limit", "100", "--at", "2026-08-10T08:30:00Z"], env);
  assert.equal(first.cleared.length, 100);
  assert.deepEqual(Object.values(first.senderCounts), [100]);
  assert.equal(first.cleared.filter((item) => item.window === "09:30").length, 50);
  assert.equal(first.cleared.filter((item) => item.window === "14:30").length, 50);
  const second = run(["prepare", "--limit", "10", "--at", "2026-08-10T10:00:00Z"], env);
  assert.equal(second.cleared.length, 0);
  assert.equal(second.shortfall, 10);
});

test("packet preparation is blocked when the approved sender is missing", () => {
  const env = sandboxEnv({ SIRONA_OUTREACH_SENDER_1_EMAIL: "" });
  importResearch(env, [completeRecord()]);
  const result = spawnSync(process.execPath, [controller, "prepare", "--limit", "1", "--at", "2026-08-10T08:30:00Z"], {
    cwd: root,
    env: { ...process.env, ...env },
    encoding: "utf8",
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /SENDER_POOL_NOT_READY/);
});

test("follow-up packet waits until the configured business-day stage", () => {
  const env = sandboxEnv();
  importResearch(env, [completeRecord()]);
  const packet = run(["prepare", "--limit", "1", "--at", "2026-08-10T08:30:00Z"], env);
  run(["record", "--contact", "contact-test-1", "--event", "sent", "--stage", "email-1", "--run", packet.runId, "--at", "2026-08-10T08:30:00Z"], env);
  const early = run(["prepare-followups", "--at", "2026-08-12T08:30:00Z"], env);
  const due = run(["prepare-followups", "--at", "2026-08-13T08:30:00Z"], env);
  assert.equal(early.cleared.length, 0);
  assert.equal(due.cleared.length, 1);
  assert.equal(due.status, "APPROVED_WAITING_FOR_WINDOW");
  assert.equal(due.cleared[0].stage, "email-2");
});

test("high-intent behaviour stops generic email follow-ups", () => {
  const env = sandboxEnv();
  importResearch(env, [completeRecord()]);
  const packet = run(["prepare", "--limit", "1", "--at", "2026-08-10T08:30:00Z"], env);
  run(["record", "--contact", "contact-test-1", "--event", "sent", "--stage", "email-1", "--run", packet.runId, "--at", "2026-08-10T08:30:00Z"], env);
  run(["record", "--contact", "contact-test-1", "--event", "demo_launch", "--at", "2026-08-11T08:30:00Z"], env);
  const followups = run(["prepare-followups", "--at", "2026-08-13T08:30:00Z"], env);
  assert.equal(followups.cleared.length, 0);
});

test("personalised replies require a separate approval packet", () => {
  const env = sandboxEnv();
  importResearch(env, [completeRecord()]);
  const introduction = run(["prepare", "--limit", "1", "--at", "2026-08-10T08:30:00Z"], env);
  run(["record", "--contact", "contact-test-1", "--event", "sent", "--stage", "email-1", "--run", introduction.runId, "--at", "2026-08-10T08:30:00Z"], env);
  const replyFile = path.join(env.OUTREACH_PRIVATE_DIR, "reply.txt");
  fs.writeFileSync(replyFile, "Hi Alex,\n\nThank you for asking about the training. I can map that part to your clinic during the free consultation.\n\nBest,\nJacqui", "utf8");
  const reply = run(["prepare-reply", "--contact", "contact-test-1", "--classification", "question", "--draft-file", replyFile], env);
  assert.equal(reply.type, "REPLY");
  assert.equal(reply.status, "APPROVAL_REQUIRED");
  assert.equal(reply.cleared[0].classification, "question");
});

test("a stop reply suppresses the clinic without creating a send packet", () => {
  const env = sandboxEnv();
  importResearch(env, [completeRecord()]);
  const introduction = run(["prepare", "--limit", "1", "--at", "2026-08-10T08:30:00Z"], env);
  run(["record", "--contact", "contact-test-1", "--event", "sent", "--stage", "email-1", "--run", introduction.runId, "--at", "2026-08-10T08:30:00Z"], env);
  const result = run(["prepare-reply", "--contact", "contact-test-1", "--classification", "stop", "--at", "2026-08-11T08:30:00Z"], env);
  assert.equal(result.status, "SUPPRESSED_NO_REPLY_PACKET");
  const followups = run(["prepare-followups", "--at", "2026-08-13T08:30:00Z"], env);
  assert.equal(followups.cleared.length, 0);
});

test("learning snapshots persist only when new interactions exist", () => {
  const env = sandboxEnv();
  importResearch(env, [completeRecord()]);
  const introduction = run(["prepare", "--limit", "1", "--at", "2026-08-10T08:30:00Z"], env);
  run(["record", "--contact", "contact-test-1", "--event", "sent", "--stage", "email-1", "--channel", "email", "--run", introduction.runId, "--at", "2026-08-10T08:30:00Z"], env);
  run(["record", "--contact", "contact-test-1", "--event", "booking_click", "--stage", "email-1", "--channel", "website", "--classification", "high_intent", "--topic", "consultation", "--at", "2026-08-11T08:30:00Z"], env);
  const first = run(["learn"], env);
  assert.equal(first.newInteractionCount, 2);
  assert.equal(first.durableUpdate, "LEARNING_SNAPSHOT_SAVED");
  assert.equal(first.channels.email, 1);
  assert.equal(first.channels.website, 1);
  assert.equal(first.topics.consultation, 1);
  assert.match(first.nextHypothesis, /calendar handoff/i);
  const second = run(["learn"], env);
  assert.equal(second.newInteractionCount, 0);
  assert.equal(second.durableUpdate, "NO_NEW_INTERACTIONS");
});

test("second clinic person is held until the 15-business-day delay", () => {
  const env = sandboxEnv();
  importResearch(env, [
    completeRecord(),
    completeRecord({ id: "research-example-2", contactId: "contact-test-2", personName: "Morgan Example", workEmail: "morgan@exampleclinic.co.uk", personOrder: 2 }),
  ]);
  const first = run(["prepare", "--limit", "1", "--at", "2026-08-10T08:30:00Z"], env);
  run(["record", "--contact", "contact-test-1", "--event", "sent", "--stage", "email-1", "--run", first.runId, "--at", "2026-08-10T08:30:00Z"], env);
  const second = run(["prepare", "--limit", "1", "--at", "2026-08-20T08:30:00Z"], env);
  assert.equal(second.cleared.length, 0);
  assert.ok(second.held.some((item) => item.reasons.includes("SECOND_PERSON_DELAY_NOT_MET")));
});

test("opaque token contains no readable contact or clinic id", () => {
  const result = run(["token", "--contact", "contact_test_123", "--clinic", "example-skin-clinic"]);
  assert.equal(result.token.split(".").length, 3);
  assert.equal(result.token.includes("contact_test_123"), false);
  assert.equal(result.token.includes("example-skin-clinic"), false);
});
