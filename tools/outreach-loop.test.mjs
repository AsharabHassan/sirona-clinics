import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const controller = path.join(root, "tools", "outreach-loop.mjs");

function run(args, env = {}) {
  return JSON.parse(
    execFileSync(process.execPath, [controller, ...args], {
      cwd: root,
      env: { ...process.env, ...env },
      encoding: "utf8",
    }),
  );
}

test("profile catalogue validates", () => {
  const result = run(["validate"]);
  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
});
test("UK Thursday 09:30 is an allowed release window", () => {
  const result = run(["window", "--at", "2026-08-06T08:30:00Z"]);
  assert.equal(result.time, "09:30");
  assert.equal(result.allowed, true);
});

test("Sunday is locked even during a nominal send hour", () => {
  const result = run(["window", "--at", "2026-08-09T08:30:00Z"]);
  assert.equal(result.allowed, false);
  assert.equal(result.reason, "SUNDAY_LOCKOUT");
});

test("18:00 UK is hard locked", () => {
  const result = run(["window", "--at", "2026-08-06T17:00:00Z"]);
  assert.equal(result.time, "18:00");
  assert.equal(result.allowed, false);
  assert.equal(result.reason, "AFTER_1800_LOCKOUT");
});

test("controller starts paused", () => {
  const result = run(["status"]);
  assert.equal(result.status, "PAUSED");
});

test("paused controller refuses live batch preparation", () => {
  const result = spawnSync(process.execPath, [controller, "prepare", "--input", "missing.csv"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /LOOP_PAUSED/);
});

test("opaque token issuance contains no readable contact or clinic id", () => {
  const result = run(
    ["token", "--contact", "contact_test_123", "--clinic", "example-skin-clinic"],
    { OUTREACH_TOKEN_SECRET: "test-only-secret-that-is-longer-than-thirty-two-characters" },
  );
  assert.equal(result.token.split(".").length, 3);
  assert.equal(result.token.includes("contact_test_123"), false);
  assert.equal(result.token.includes("example-skin-clinic"), false);
});
