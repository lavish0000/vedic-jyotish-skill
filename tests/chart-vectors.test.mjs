import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { SwissEphemeris } from "@swisseph/browser";
import {
  localDateTimeToUtc,
  nakshatraOf,
  normalize,
} from "../skills/read-vedic-jyotish/scripts/src/chart.ts";
import { calculateVedicChart } from "../skills/read-vedic-jyotish/scripts/src/ephemeris.ts";

function angularDifference(first, second) {
  return Math.abs(((first - second + 540) % 360) - 180);
}

function assertAngle(actual, expected, tolerance, message) {
  assert.ok(
    angularDifference(actual, expected) <= tolerance,
    `${message}: expected ${expected}, got ${actual}`,
  );
}

async function loadRecords() {
  const text = await readFile(
    new URL("./fixtures/chart-vectors.v1.jsonl", import.meta.url),
    "utf8",
  );
  return text
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));
}

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

test("516 reference charts and historical timezone edges remain aligned", async () => {
  const [manifest, records, ephemeris] = await Promise.all([
    readFile(
      new URL(
        "./fixtures/chart-vectors.v1.manifest.json",
        import.meta.url,
      ),
      "utf8",
    ).then(JSON.parse),
    loadRecords(),
    initializeEphemeris(),
  ]);
  const tolerances = manifest.tolerances;
  let chartCount = 0;
  let gapCount = 0;
  let foldCount = 0;

  try {
    for (const record of records) {
      if (record.k === "g") {
        gapCount += 1;
        assert.throws(
          () => localDateTimeToUtc(record.d, record.t, record.z),
          /does not exist/,
          record.id,
        );
        continue;
      }
      if (record.k === "f") {
        foldCount += 1;
        assert.throws(
          () => localDateTimeToUtc(record.d, record.t, record.z),
          /ambiguous/,
          record.id,
        );
        continue;
      }

      chartCount += 1;
      const result = await calculateVedicChart({
        date: record.d,
        time: record.t,
        place: {
          id: 0,
          label: record.id,
          latitude: record.a,
          longitude: record.o,
          timezone: record.z,
        },
        ephemeris,
        asOf: new Date(new Date(record.u).getTime() + 86_400_000),
      });

      assert.equal(
        result.birthUtcIso,
        new Date(record.u).toISOString(),
        `${record.id} UTC`,
      );
      assertAngle(
        result.ayanamsa,
        record.y,
        tolerances.longitude_degrees,
        `${record.id} ayanamsha`,
      );
      assertAngle(
        result.ascendantLongitude,
        record.x,
        tolerances.longitude_degrees,
        `${record.id} ascendant`,
      );

      for (let index = 0; index < 8; index += 1) {
        assertAngle(
          result.planets[index].longitude,
          record.p[index][0],
          tolerances.longitude_degrees,
          `${record.id} planet ${index}`,
        );
        assert.ok(
          Math.abs(
            result.planets[index].longitudeSpeed - record.p[index][1],
          ) <= tolerances.speed_degrees_per_day,
          `${record.id} planet ${index} speed`,
        );
      }
      assertAngle(
        result.planets[8].longitude,
        normalize(record.p[7][0] + 180),
        tolerances.longitude_degrees,
        `${record.id} Ketu`,
      );
      assertAngle(
        result.planets[8].longitude,
        normalize(result.planets[7].longitude + 180),
        tolerances.ketu_opposition_degrees,
        `${record.id} Rahu-Ketu opposition`,
      );
      assert.deepEqual(
        result.planets.map((planet) => planet.house),
        record.h,
        `${record.id} houses`,
      );

      const nakshatra = nakshatraOf(result.planets[1].longitude);
      assert.deepEqual(
        [nakshatra.index, nakshatra.pada],
        record.n.slice(0, 2),
        `${record.id} nakshatra`,
      );
    }
  } finally {
    ephemeris.close();
  }

  assert.equal(chartCount, manifest.counts.charts);
  assert.equal(gapCount, manifest.counts.gaps);
  assert.equal(foldCount, manifest.counts.folds);
  assert.ok(chartCount >= 500);
});
