import {
  CLASSICAL_PLANETS,
  DOMAIN_HOUSES,
  SIGN_LORDS,
} from "./config";
import { dignityFor } from "./dignity";
import { formatOrdinal } from "./format";
import {
  houseSignName,
  relativeHouseOf,
  signIndexOf,
  signNameOf,
  wholeSignHouseOf,
} from "./math";
import type {
  ClassicalPlanetName,
  JyotishDomain,
  JyotishPlanet,
  JyotishPlanetName,
  YogaFormation,
} from "./types";

const mahapurushaNames: Partial<Record<ClassicalPlanetName, string>> = {
  Mangal: "Ruchaka Mahapurusha",
  Budh: "Bhadra Mahapurusha",
  Guru: "Hamsa Mahapurusha",
  Shukra: "Malavya Mahapurusha",
  Shani: "Shasha Mahapurusha",
};

const domains = Object.keys(DOMAIN_HOUSES) as JyotishDomain[];

function domainsForHouses(houses: ReadonlySet<number>) {
  return domains.filter((domain) =>
    DOMAIN_HOUSES[domain].some((house) => houses.has(house)),
  );
}

function requirePlanet(
  planets: readonly JyotishPlanet[],
  name: JyotishPlanetName,
) {
  const planet = planets.find((candidate) => candidate.name === name);
  if (!planet) throw new Error(`Missing planet required for yoga rule: ${name}.`);
  return planet;
}

/**
 * Formation only: the five eligible planets must be in a Kendra from Lagna
 * and occupy an own or exaltation sign.
 */
export function detectPanchaMahapurusha(
  ascendantLongitude: number,
  planets: readonly JyotishPlanet[],
): YogaFormation[] {
  return Object.entries(mahapurushaNames).flatMap(([name, yogaName]) => {
    const planetName = name as ClassicalPlanetName;
    const planet = requirePlanet(planets, planetName);
    const sign = signNameOf(planet.longitude);
    const dignity = dignityFor(planetName, sign);
    const house = wholeSignHouseOf(
      planet.longitude,
      ascendantLongitude,
    );
    const formed =
      [1, 4, 7, 10].includes(house) &&
      (dignity === "own" || dignity === "exalted");

    if (!formed || !yogaName) return [];
    return [
      {
        id: `yoga-pancha-mahapurusha-${planetName}`,
        ruleId: "pancha-mahapurusha" as const,
        name: yogaName,
        participants: [planetName],
        domains: ["self", "career"] as const,
        summary: `${planetName} Kendra mein ${dignity === "exalted" ? "uchcha" : "own sign"} placement se ${yogaName} formation banti hai.`,
      },
    ];
  });
}

/** Guru must be in a Kendra sign counted from Chandra. */
export function detectGajaKesari(
  planets: readonly JyotishPlanet[],
): YogaFormation[] {
  const moon = requirePlanet(planets, "Chandra");
  const jupiter = requirePlanet(planets, "Guru");
  const relativeHouse = relativeHouseOf(jupiter.longitude, moon.longitude);
  if (![1, 4, 7, 10].includes(relativeHouse)) return [];

  return [
    {
      id: "yoga-gaja-kesari",
      ruleId: "gaja-kesari",
      name: "Gaja Kesari",
      participants: ["Chandra", "Guru"],
      domains: ["self", "career", "family", "education"],
      summary: `Guru Chandra se ${formatOrdinal(relativeHouse)} sign mein hai, isliye Gaja Kesari formation present hai.`,
    },
  ];
}

/** Surya and Budh must occupy the same sidereal sign. */
export function detectBudhaAditya(
  planets: readonly JyotishPlanet[],
): YogaFormation[] {
  const sun = requirePlanet(planets, "Surya");
  const mercury = requirePlanet(planets, "Budh");
  if (signIndexOf(sun.longitude) !== signIndexOf(mercury.longitude)) {
    return [];
  }

  return [
    {
      id: "yoga-budha-aditya",
      ruleId: "budha-aditya",
      name: "Budha Aditya",
      participants: ["Surya", "Budh"],
      domains: ["career", "education"],
      summary: `Surya aur Budh ${signNameOf(sun.longitude)} mein saath hain, isliye Budha Aditya formation present hai.`,
    },
  ];
}

/** This rule set uses the same-sign Chandra-Mangal definition only. */
export function detectChandraMangala(
  planets: readonly JyotishPlanet[],
): YogaFormation[] {
  const moon = requirePlanet(planets, "Chandra");
  const mars = requirePlanet(planets, "Mangal");
  if (signIndexOf(moon.longitude) !== signIndexOf(mars.longitude)) {
    return [];
  }

  return [
    {
      id: "yoga-chandra-mangala",
      ruleId: "chandra-mangala",
      name: "Chandra Mangala",
      participants: ["Chandra", "Mangal"],
      domains: ["money", "self"],
      summary: `Chandra aur Mangal ${signNameOf(moon.longitude)} mein saath hain, isliye same-sign Chandra Mangala formation present hai.`,
    },
  ];
}

/** Two classical planets must occupy signs ruled by one another. */
export function detectParivartana(
  ascendantLongitude: number,
  planets: readonly JyotishPlanet[],
): YogaFormation[] {
  const formations: YogaFormation[] = [];

  for (
    let firstIndex = 0;
    firstIndex < CLASSICAL_PLANETS.length;
    firstIndex += 1
  ) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < CLASSICAL_PLANETS.length;
      secondIndex += 1
    ) {
      const firstName = CLASSICAL_PLANETS[firstIndex];
      const secondName = CLASSICAL_PLANETS[secondIndex];
      const first = requirePlanet(planets, firstName);
      const second = requirePlanet(planets, secondName);
      const firstSign = signNameOf(first.longitude);
      const secondSign = signNameOf(second.longitude);

      if (
        SIGN_LORDS[firstSign] !== secondName ||
        SIGN_LORDS[secondSign] !== firstName
      ) {
        continue;
      }

      const connectedHouses = new Set([
        wholeSignHouseOf(first.longitude, ascendantLongitude),
        wholeSignHouseOf(second.longitude, ascendantLongitude),
      ]);
      for (let house = 1; house <= 12; house += 1) {
        const lord = SIGN_LORDS[
          houseSignName(house, ascendantLongitude)
        ];
        if (lord === firstName || lord === secondName) {
          connectedHouses.add(house);
        }
      }
      const connectedHouseList = [...connectedHouses].sort(
        (firstHouse, secondHouse) => firstHouse - secondHouse,
      );

      formations.push({
        id: `yoga-parivartana-${firstName}-${secondName}`,
        ruleId: "parivartana",
        name: "Parivartana",
        participants: [firstName, secondName],
        domains: domainsForHouses(connectedHouses),
        summary: `${firstName} ${secondName} ke sign mein aur ${secondName} ${firstName} ke sign mein hai. Yeh exchange ${connectedHouseList.map(formatOrdinal).join(", ")} houses ko directly connect karta hai.`,
      });
    }
  }

  return formations;
}

export function evaluateYogas(
  ascendantLongitude: number,
  planets: readonly JyotishPlanet[],
): YogaFormation[] {
  return [
    ...detectPanchaMahapurusha(ascendantLongitude, planets),
    ...detectGajaKesari(planets),
    ...detectBudhaAditya(planets),
    ...detectChandraMangala(planets),
    ...detectParivartana(ascendantLongitude, planets),
  ];
}
