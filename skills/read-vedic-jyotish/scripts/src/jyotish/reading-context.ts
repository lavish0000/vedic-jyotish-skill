import {
  signNameOf,
  wholeSignHouseOf,
} from "./math";
import type {
  DignityRecord,
  DomainFact,
  DomainInsight,
  DomainSynthesis,
  GrahaAspect,
  HouseLordPlacement,
  JyotishDomain,
  JyotishPlanet,
  JyotishPlanetName,
} from "./types";

export type PersonalizedReadingInput = {
  ascendantLongitude: number;
  planets: readonly JyotishPlanet[];
  houseLords: readonly HouseLordPlacement[];
  dignities: readonly DignityRecord[];
  aspects: readonly GrahaAspect[];
};

export type ReadingFields = Pick<
  DomainSynthesis,
  | "quickText"
  | "text"
  | "overviewFacts"
  | "fingerprint"
  | "insights"
  | "practicalText"
  | "limitations"
>;

export type PlanetPlacement = {
  name: JyotishPlanetName;
  sign: ReturnType<typeof signNameOf>;
  house: number;
  dignity: DignityRecord["dignity"];
};

function requirePlanet(
  input: PersonalizedReadingInput,
  name: JyotishPlanetName,
) {
  const planet = input.planets.find((candidate) => candidate.name === name);
  if (!planet) throw new Error(`Missing ${name} for personalized reading.`);
  return planet;
}

export function planetPlacement(
  input: PersonalizedReadingInput,
  name: JyotishPlanetName,
): PlanetPlacement {
  const planet = requirePlanet(input, name);
  const sign = signNameOf(planet.longitude);
  const house = wholeSignHouseOf(
    planet.longitude,
    input.ascendantLongitude,
  );
  const dignity =
    input.dignities.find((item) => item.planet === name)?.dignity ??
    "unclassified";

  return {
    name,
    sign,
    house,
    dignity,
  };
}

export function houseLord(
  input: PersonalizedReadingInput,
  house: number,
) {
  const placement = input.houseLords.find((item) => item.house === house);
  if (!placement) {
    throw new Error(`Missing ${house}th-house lord for personalized reading.`);
  }
  return placement;
}

function dignityLabel(dignity: DignityRecord["dignity"]) {
  if (dignity === "exalted") return "uccha";
  if (dignity === "own") return "own sign";
  if (dignity === "debilitated") return "neecha";
  return "neutral";
}

export function ascendantFact(
  sign: ReturnType<typeof signNameOf>,
): DomainFact {
  return {
    id: `ascendant-sign-${sign}`,
    label: `Lagna sign: ${sign}`,
  };
}

export function houseSignFact(
  house: number,
  sign: ReturnType<typeof signNameOf>,
): DomainFact {
  return {
    id: `house-${house}-sign-${sign}`,
    label: `H${house} sign: ${sign}`,
  };
}

export function lordPlacementFacts(
  placement: HouseLordPlacement,
): DomainFact[] {
  return [
    {
      id: `house-${placement.house}-lord-${placement.lord}`,
      label: `H${placement.house} lord: ${placement.lord}`,
    },
    {
      id: `planet-${placement.lord}-${placement.lordSign}-${placement.lordHouse}`,
      label: `${placement.lord}: ${placement.lordSign}, H${placement.lordHouse}`,
    },
  ];
}

export function lordDignityFact(
  placement: HouseLordPlacement,
): DomainFact {
  return {
    id: `planet-${placement.lord}-dignity-${placement.dignity}`,
    label: `${placement.lord} dignity: ${dignityLabel(placement.dignity)}`,
  };
}

export function planetPositionFact(
  placement: PlanetPlacement,
): DomainFact {
  return {
    id: `planet-${placement.name}-${placement.sign}-${placement.house}`,
    label: `${placement.name}: ${placement.sign}, H${placement.house}`,
  };
}

export function planetDignityFact(
  placement: PlanetPlacement,
): DomainFact {
  return {
    id: `planet-${placement.name}-dignity-${placement.dignity}`,
    label: `${placement.name} dignity: ${dignityLabel(placement.dignity)}`,
  };
}

export function houseActivators(
  input: PersonalizedReadingInput,
  houses: readonly number[],
) {
  const houseSet = new Set(houses);
  const occupants = input.planets
    .filter((planet) =>
      houseSet.has(
        wholeSignHouseOf(planet.longitude, input.ascendantLongitude),
      ),
    );
  const matchingAspects = input.aspects.filter((aspect) =>
    houseSet.has(aspect.toHouse),
  );
  const aspectSources = [
    ...new Set(matchingAspects.map((aspect) => aspect.source)),
  ];

  if (occupants.length > 0) {
    return {
      text: `${occupants.map((planet) => planet.name).join(", ")} relevant houses mein directly placed hain, isliye yeh topic background theme ke bajay visibly repeat ho sakta hai.`,
      facts: occupants.map((planet) =>
        planetPositionFact(
          planetPlacement(input, planet.name),
        ),
      ),
    };
  }
  if (aspectSources.length > 0) {
    return {
      text: `${aspectSources.join(", ")} ki graha drishti is topic ko activate karti hai, isliye response effort aur timing ke saath change ho sakta hai.`,
      facts: matchingAspects.map((aspect) => ({
        id: aspect.id,
        label: `${aspect.source}: ${aspect.label} drishti to H${aspect.toHouse}`,
      })),
    };
  }
  return {
    text: "Relevant house empty hone par bhi topic absent nahi hota. Is reading mein house lord ki placement main signal hai.",
    facts: lordPlacementFacts(houseLord(input, houses[0])),
  };
}

export function insight(
  label: string,
  text: string,
  facts: readonly DomainFact[],
): DomainInsight {
  return {
    label,
    text,
    facts: [
      ...new Map(facts.map((fact) => [fact.id, fact])).values(),
    ],
  };
}

export function fingerprint(
  domain: JyotishDomain,
  parts: Array<string | number>,
) {
  return `${domain}:${parts.join("|")}`;
}

export function placementKey(
  placement: HouseLordPlacement | PlanetPlacement,
) {
  if ("lord" in placement) {
    return `${placement.house}L-${placement.lord}-${placement.lordSign}-H${placement.lordHouse}-${placement.dignity}`;
  }
  return `${placement.name}-${placement.sign}-H${placement.house}-${placement.dignity}`;
}
