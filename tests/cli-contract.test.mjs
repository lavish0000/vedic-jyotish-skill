import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

const calculator = new URL(
  "../skills/read-vedic-jyotish/scripts/calculate-chart.mjs",
  import.meta.url,
);

function runCalculator(argumentsList) {
  const result = spawnSync(
    process.execPath,
    [calculator.pathname, ...argumentsList],
    {
      encoding: "utf8",
      timeout: 30_000,
    },
  );
  return {
    ...result,
    payload: JSON.parse(result.stdout),
  };
}

const sampleArguments = [
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
];

test("bundled calculator returns a complete versioned reading packet", () => {
  const result = runCalculator(sampleArguments);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.payload.status, "ok");
  assert.equal(
    result.payload.schemaVersion,
    "vedic-jyotish-reading-packet.v1",
  );
  assert.equal(result.payload.ruleSetVersion, "jyotish-core-2.0");
  assert.equal(result.payload.method.ayanamsha, "Lahiri");
  assert.equal(result.payload.method.houseSystem, "whole-sign");
  assert.equal(result.payload.method.lunarNode, "mean");
  assert.equal(result.payload.chart.lagna, "Mesh");
  assert.equal(result.payload.chart.suryaRashi, "Makara");
  assert.equal(result.payload.chart.chandraRashi, "Mesh");
  assert.equal(result.payload.chart.nakshatra, "Ashwini, Pada 4");
  assert.equal(result.payload.chart.planets.length, 9);
  assert.equal(result.payload.analysis.domains.length, 10);
  assert.ok(result.payload.analysis.evidence.length > 20);
  assert.match(result.payload.digest, /^sha256:[a-f0-9]{64}$/);

  const rahu = result.payload.chart.planets.find(
    (planet) => planet.name === "Rahu",
  );
  const ketu = result.payload.chart.planets.find(
    (planet) => planet.name === "Ketu",
  );
  const expectedKetu = (rahu.longitude + 180) % 360;
  const opposition = Math.abs(
    ((ketu.longitude - expectedKetu + 540) % 360) - 180,
  );
  assert.ok(opposition < 1e-10);

  const evidenceIds = new Set(
    result.payload.analysis.evidence.map((item) => item.id),
  );
  for (const domain of result.payload.analysis.domains) {
    for (const id of [
      ...domain.evidenceIds,
      ...domain.counterEvidenceIds,
      ...domain.omittedCounterEvidenceIds,
    ]) {
      assert.ok(evidenceIds.has(id), `${domain.domain}: missing ${id}`);
    }
  }
});

test("invalid calendar input returns structured failure without a chart", () => {
  const result = runCalculator([
    ...sampleArguments.slice(0, 1),
    "2000-02-30",
    ...sampleArguments.slice(2),
  ]);

  assert.equal(result.status, 2);
  assert.equal(result.payload.status, "invalid_input");
  assert.equal(result.payload.error.code, "invalid_birth_datetime");
  assert.match(result.payload.error.message, /Invalid local date or time/);
  assert.equal(result.payload.chart, undefined);
});

test("missing birth time is rejected before calculation", () => {
  const result = runCalculator([
    "--date",
    "2000-01-15",
    "--place-label",
    "London",
    "--latitude",
    "51.5074",
    "--longitude",
    "-0.1278",
    "--timezone",
    "Europe/London",
  ]);

  assert.equal(result.status, 2);
  assert.equal(result.payload.status, "invalid_input");
  assert.equal(result.payload.error.code, "missing_birth_time");
});
