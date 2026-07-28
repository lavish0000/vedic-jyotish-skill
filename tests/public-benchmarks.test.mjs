import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { SwissEphemeris } from "@swisseph/browser";
import { calculateVedicChart } from "../skills/read-vedic-jyotish/scripts/src/ephemeris.ts";

async function initializeEphemeris() {
  const wasm = await readFile(
    new URL(
      "../skills/read-vedic-jyotish/scripts/swisseph.wasm",
      import.meta.url,
    ),
  );
  const instance = new SwissEphemeris();
  const originalLog = console.log;
  console.log = () => undefined;
  try {
    await instance.init(
      `data:application/wasm;base64,${wasm.toString("base64")}`,
    );
  } finally {
    console.log = originalLog;
  }
  return instance;
}

test("public birth-record spot checks agree on categorical placements", async () => {
  const [fixture, ephemeris] = await Promise.all([
    readFile(
      new URL(
        "./fixtures/public-chart-benchmarks.v1.json",
        import.meta.url,
      ),
      "utf8",
    ).then(JSON.parse),
    initializeEphemeris(),
  ]);

  try {
    for (const benchmark of fixture.cases) {
      const input = benchmark.input;
      const birthTimestamp = new Date(benchmark.expected.utc).getTime();
      const result = await calculateVedicChart({
        date: input.date,
        time: input.time,
        place: {
          id: 0,
          label: benchmark.id,
          latitude: input.latitude,
          longitude: input.longitude,
          timezone: input.timezone,
        },
        ephemeris,
        asOf: new Date(birthTimestamp + 86_400_000),
      });

      assert.equal(
        result.birthUtcIso,
        benchmark.expected.utc,
        `${benchmark.id} UTC`,
      );
      assert.equal(
        result.ascendant,
        benchmark.expected.ascendant,
        `${benchmark.id} ascendant`,
      );
      assert.equal(
        result.moon,
        benchmark.expected.moon,
        `${benchmark.id} Moon`,
      );
      assert.equal(
        result.nakshatra,
        benchmark.expected.nakshatra,
        `${benchmark.id} nakshatra`,
      );
    }
  } finally {
    ephemeris.close();
  }
});
