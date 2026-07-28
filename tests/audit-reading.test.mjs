import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

const calculator = new URL(
  "../skills/read-vedic-jyotish/scripts/calculate-chart.mjs",
  import.meta.url,
);
const auditor = new URL(
  "../skills/read-vedic-jyotish/scripts/audit-reading.mjs",
  import.meta.url,
);

function run(path, argumentsList) {
  return spawnSync(process.execPath, [path.pathname, ...argumentsList], {
    encoding: "utf8",
    timeout: 30_000,
  });
}

function createPlan(packet) {
  const evidenceById = new Map(
    packet.analysis.evidence.map((item) => [item.id, item]),
  );
  return {
    schemaVersion: "vedic-jyotish-reading-plan.v1",
    packetDigest: packet.digest,
    readingType: "full",
    sections: packet.analysis.domains.map((domain) => {
      const evidence = evidenceById.get(domain.evidenceIds[0]);
      return {
        domain: domain.domain,
        confidence: domain.confidence,
        provisional:
          domain.confidence === "low" ||
          evidence?.stability === "sensitive",
        counterEvidenceIds: [
          ...domain.counterEvidenceIds,
          ...domain.omittedCounterEvidenceIds,
        ].slice(0, 1),
        claims: [
          {
            text: `The returned ${domain.domain} evidence supports a qualified traditional pattern.`,
            evidenceIds: [evidence.id],
            timing: evidence.kind === "dasha",
          },
        ],
      };
    }),
  };
}

test("auditor accepts a fully grounded plan and rejects unsupported claims", async () => {
  const directory = await mkdtemp(join(tmpdir(), "jyotish-audit-"));
  const packetPath = join(directory, "packet.json");
  const planPath = join(directory, "plan.json");

  try {
    const calculation = run(calculator, [
      "--date",
      "2000-01-15",
      "--time",
      "12:00",
      "--place-label",
      "London, United Kingdom",
      "--latitude",
      "51.5074",
      "--longitude",
      "-0.1278",
      "--timezone",
      "Europe/London",
      "--as-of",
      "2026-07-28",
    ]);
    assert.equal(calculation.status, 0, calculation.stderr);
    const packet = JSON.parse(calculation.stdout);
    const plan = createPlan(packet);
    await writeFile(packetPath, calculation.stdout);
    await writeFile(planPath, JSON.stringify(plan));

    const accepted = run(auditor, [
      "--packet",
      packetPath,
      "--plan",
      planPath,
    ]);
    assert.equal(accepted.status, 0, accepted.stderr);
    assert.equal(JSON.parse(accepted.stdout).valid, true);

    plan.sections[0].claims[0] = {
      text: "This event will certainly happen with 100% probability.",
      evidenceIds: ["unknown-evidence"],
      timing: false,
    };
    await writeFile(planPath, JSON.stringify(plan));
    const rejected = run(auditor, [
      "--packet",
      packetPath,
      "--plan",
      planPath,
    ]);
    assert.equal(rejected.status, 2);
    const rejection = JSON.parse(rejected.stdout);
    assert.equal(rejection.valid, false);
    assert.ok(
      rejection.errors.some((message) => message.includes("certainty")),
    );
    assert.ok(
      rejection.errors.some((message) =>
        message.includes("unknown evidence"),
      ),
    );
  } finally {
    await readFile(packetPath).catch(() => undefined);
    await rm(directory, { recursive: true, force: true });
  }
});
