import assert from "node:assert/strict";
import test from "node:test";
import {
  deriveDignities,
  deriveGrahaAspects,
  deriveHouseLords,
  deriveSameSignConjunctions,
  evaluateYogas,
} from "../skills/read-vedic-jyotish/scripts/src/jyotish/index.ts";

const ariesAscendant = 5;
const planets = [
  { name: "Surya", longitude: 125 },
  { name: "Chandra", longitude: 40 },
  { name: "Budh", longitude: 165 },
  { name: "Shukra", longitude: 170 },
  { name: "Mangal", longitude: 285 },
  { name: "Guru", longitude: 295 },
  { name: "Shani", longitude: 310 },
  { name: "Rahu", longitude: 70, retrograde: true },
  { name: "Ketu", longitude: 250, retrograde: true },
];

test("classical dignity and whole-sign lord tables stay restrained", () => {
  const dignities = deriveDignities(planets);
  assert.equal(
    dignities.find((item) => item.planet === "Mangal")?.dignity,
    "exalted",
  );
  assert.equal(
    dignities.find((item) => item.planet === "Shukra")?.dignity,
    "debilitated",
  );
  assert.equal(
    dignities.find((item) => item.planet === "Rahu")?.dignity,
    "unclassified",
  );

  const houseLords = deriveHouseLords(ariesAscendant, planets);
  assert.equal(houseLords.length, 12);
  assert.equal(houseLords[0].lord, "Mangal");
  assert.equal(houseLords[0].lordHouse, 10);
  assert.equal(houseLords[1].lord, "Shukra");
  assert.equal(houseLords[1].lordHouse, 6);
});

test("conjunction and aspect rules expose only configured relationships", () => {
  const conjunctions = deriveSameSignConjunctions(planets);
  assert.equal(
    conjunctions.find(
      (item) => item.id === "conjunction-Budh-Shukra",
    )?.tightness,
    "tight",
  );

  const aspects = deriveGrahaAspects(ariesAscendant, planets);
  assert.ok(
    aspects.some(
      (item) =>
        item.source === "Mangal" && item.kind === "mars-fourth",
    ),
  );
  assert.ok(
    aspects.some(
      (item) =>
        item.source === "Guru" && item.kind === "jupiter-ninth",
    ),
  );
  assert.equal(
    aspects.some(
      (item) => item.source === "Rahu" || item.source === "Ketu",
    ),
    false,
  );
});

test("named yoga output is limited to exact configured predicates", () => {
  const yogaPlanets = [
    { name: "Surya", longitude: 72 },
    { name: "Chandra", longitude: 10 },
    { name: "Budh", longitude: 74 },
    { name: "Shukra", longitude: 40 },
    { name: "Mangal", longitude: 12 },
    { name: "Guru", longitude: 100 },
    { name: "Shani", longitude: 310 },
    { name: "Rahu", longitude: 200 },
    { name: "Ketu", longitude: 20 },
  ];
  const names = new Set(
    evaluateYogas(ariesAscendant, yogaPlanets).map((item) => item.name),
  );

  assert.ok(names.has("Ruchaka Mahapurusha"));
  assert.ok(names.has("Hamsa Mahapurusha"));
  assert.ok(names.has("Gaja Kesari"));
  assert.ok(names.has("Budha Aditya"));
  assert.ok(names.has("Chandra Mangala"));
});
