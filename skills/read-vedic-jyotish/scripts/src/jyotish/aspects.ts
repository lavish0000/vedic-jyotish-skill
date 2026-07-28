import { CLASSICAL_PLANETS } from "./config";
import {
  houseSignName,
  wholeSignHouseOf,
} from "./math";
import type {
  ClassicalPlanetName,
  GrahaAspect,
  GrahaAspectKind,
  JyotishPlanet,
} from "./types";

type AspectDefinition = {
  offset: number;
  kind: GrahaAspectKind;
  label: string;
};

const seventhAspect: AspectDefinition = {
  offset: 6,
  kind: "seventh",
  label: "7th house",
};

const specialAspects: Partial<
  Record<ClassicalPlanetName, readonly AspectDefinition[]>
> = {
  Mangal: [
    { offset: 3, kind: "mars-fourth", label: "4th house" },
    { offset: 7, kind: "mars-eighth", label: "8th house" },
  ],
  Guru: [
    { offset: 4, kind: "jupiter-fifth", label: "5th house" },
    { offset: 8, kind: "jupiter-ninth", label: "9th house" },
  ],
  Shani: [
    { offset: 2, kind: "saturn-third", label: "3rd house" },
    { offset: 9, kind: "saturn-tenth", label: "10th house" },
  ],
};

export function deriveGrahaAspects(
  ascendantLongitude: number,
  planets: readonly JyotishPlanet[],
): GrahaAspect[] {
  const houseByPlanet = new Map(
    planets.map((planet) => [
      planet.name,
      wholeSignHouseOf(planet.longitude, ascendantLongitude),
    ]),
  );
  const aspects: GrahaAspect[] = [];

  for (const sourceName of CLASSICAL_PLANETS) {
    const fromHouse = houseByPlanet.get(sourceName);
    if (!fromHouse) {
      throw new Error(
        `Missing classical planet required for graha drishti: ${sourceName}.`,
      );
    }

    const definitions = [
      seventhAspect,
      ...(specialAspects[sourceName] ?? []),
    ];

    for (const definition of definitions) {
      const toHouse = ((fromHouse - 1 + definition.offset) % 12) + 1;
      const targetPlanets = planets
        .filter((planet) => houseByPlanet.get(planet.name) === toHouse)
        .map((planet) => planet.name);

      aspects.push({
        id: `aspect-${sourceName}-${definition.kind}-${toHouse}`,
        source: sourceName,
        kind: definition.kind,
        label: definition.label,
        fromHouse,
        toHouse,
        toSign: houseSignName(toHouse, ascendantLongitude),
        targetPlanets,
      });
    }
  }

  return aspects;
}
