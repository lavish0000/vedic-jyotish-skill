import { DOMAIN_HOUSES } from "./config";
import { synthesizeDomain } from "./domain-synthesis";
import { formatOrdinal } from "./format";
import { personalizeDomain } from "./personalized-reading";
import { wholeSignHouseOf } from "./math";
import { deriveRashiSynthesisEvidence } from "./rashi-synthesis";
import type {
  DashaLord,
  DashaThemeActivation,
  DashaThemeTimeline,
  Dignity,
  DignityRecord,
  EvidencePolarity,
  GrahaAspect,
  HouseLordPlacement,
  JyotishDomain,
  JyotishEvidence,
  JyotishPlanet,
  JyotishStability,
  SameSignConjunction,
  VimshottariTimeline,
  YogaFormation,
} from "./types";

type SynthesisInput = {
  ascendantLongitude: number;
  planets: readonly JyotishPlanet[];
  houseLords: readonly HouseLordPlacement[];
  dignities: readonly DignityRecord[];
  conjunctions: readonly SameSignConjunction[];
  aspects: readonly GrahaAspect[];
  yogas: readonly YogaFormation[];
  vimshottari: VimshottariTimeline;
  stability: JyotishStability;
};

const allDomains = Object.keys(DOMAIN_HOUSES) as JyotishDomain[];

function domainsForHouses(houses: Iterable<number>) {
  const houseSet = new Set(houses);
  return allDomains.filter((domain) =>
    DOMAIN_HOUSES[domain].some((house) => houseSet.has(house)),
  );
}

function polarityForDignities(
  dignities: readonly Dignity[],
): EvidencePolarity {
  const hasSupport = dignities.some(
    (dignity) => dignity === "own" || dignity === "exalted",
  );
  const hasChallenge = dignities.includes("debilitated");
  if (hasSupport && hasChallenge) return "mixed";
  if (hasChallenge) return "challenging";
  if (
    dignities.length > 0 &&
    dignities.every(
      (dignity) => dignity === "own" || dignity === "exalted",
    )
  ) {
    return "supportive";
  }
  return "mixed";
}

function dignityPhrase(dignity: Dignity) {
  switch (dignity) {
    case "exalted":
      return "uchcha dignity ke saath";
    case "own":
      return "own-sign dignity ke saath";
    case "debilitated":
      return "neecha dignity ke saath";
    default:
      return "bina kisi special dignity tag ke";
  }
}

function dignityStrength(dignity: Dignity): 1 | 2 | 3 {
  if (dignity === "exalted" || dignity === "debilitated") return 3;
  if (dignity === "own") return 2;
  return 1;
}

function evidenceForHouseLords(input: SynthesisInput) {
  const evidence: JyotishEvidence[] = [];

  for (const placement of input.houseLords) {
    for (const domain of domainsForHouses([placement.house])) {
      evidence.push({
        id: `evidence-house-${placement.house}-${domain}`,
        label: "Rashi house-lord placement",
        kind: "house-lord",
        domain,
        polarity: polarityForDignities([placement.dignity]),
        strength: dignityStrength(placement.dignity),
        summary: `${formatOrdinal(placement.house)} house ka lord ${placement.lord} ${formatOrdinal(placement.lordHouse)} house ke ${placement.lordSign} sign mein ${dignityPhrase(placement.dignity)} placed hai.`,
        factIds: [
          `planet-${placement.lord}`,
          `house-${placement.house}-lord-${placement.lord}`,
          `planet-${placement.lord}-${placement.lordSign}-${placement.lordHouse}`,
        ],
        stability: input.stability.ascendant,
      });
    }
  }

  return evidence;
}

function evidenceForConjunctions(input: SynthesisInput) {
  const dignityByPlanet = new Map(
    input.dignities.map((record) => [record.planet, record.dignity]),
  );
  const planetByName = new Map(
    input.planets.map((planet) => [planet.name, planet]),
  );
  const evidence: JyotishEvidence[] = [];

  for (const conjunction of input.conjunctions) {
    const activatedHouses = new Set<number>();
    for (const participant of conjunction.planets) {
      const planet = planetByName.get(participant);
      if (planet) {
        activatedHouses.add(
          wholeSignHouseOf(planet.longitude, input.ascendantLongitude),
        );
      }
      input.houseLords
        .filter((placement) => placement.lord === participant)
        .forEach((placement) => activatedHouses.add(placement.house));
    }

    const participantDignities = conjunction.planets.map(
      (planet) => dignityByPlanet.get(planet) ?? "unclassified",
    );
    const strength =
      conjunction.tightness === "tight"
        ? 3
        : conjunction.tightness === "moderate"
          ? 2
          : 1;

    for (const domain of domainsForHouses(activatedHouses)) {
      evidence.push({
        id: `evidence-${conjunction.id}-${domain}`,
        label: "Same-sign conjunction",
        kind: "conjunction",
        domain,
        polarity: polarityForDignities(participantDignities),
        strength,
        summary: `${conjunction.planets.join(" aur ")} ${conjunction.sign} mein ${conjunction.angularSeparation.toFixed(1)}° separation ke saath ${conjunction.tightness} conjunction banate hain.`,
        factIds: [
          ...conjunction.planets.map((planet) => `planet-${planet}`),
          conjunction.id,
        ],
        stability: input.stability.ascendant,
      });
    }
  }

  return evidence;
}

function evidenceForAspects(input: SynthesisInput) {
  const dignityByPlanet = new Map(
    input.dignities.map((record) => [record.planet, record.dignity]),
  );
  const evidence: JyotishEvidence[] = [];

  for (const aspect of input.aspects) {
    for (const domain of domainsForHouses([aspect.toHouse])) {
      const dignity = dignityByPlanet.get(aspect.source) ?? "unclassified";
      evidence.push({
        id: `evidence-${aspect.id}-${domain}`,
        label: "Classical graha drishti",
        kind: "aspect",
        domain,
        polarity: polarityForDignities([dignity]),
        strength: dignityStrength(dignity),
        summary: `${aspect.source} ${aspect.label} drishti se ${formatOrdinal(aspect.toHouse)} house (${aspect.toSign}) ko activate karta hai.`,
        factIds: [
          `planet-${aspect.source}`,
          aspect.id,
          `planet-${aspect.source}-dignity-${dignity}`,
        ],
        stability: input.stability.ascendant,
      });
    }
  }

  return evidence;
}

function evidenceForYogas(input: SynthesisInput) {
  return input.yogas.flatMap((yoga): JyotishEvidence[] =>
    yoga.domains.map((domain) => ({
      id: `evidence-${yoga.id}-${domain}`,
      label: "Selected yoga rule",
      kind: "yoga",
      domain,
      polarity:
        yoga.ruleId === "parivartana" ||
        yoga.ruleId === "chandra-mangala"
          ? "mixed"
          : "supportive",
      strength:
        yoga.ruleId === "pancha-mahapurusha" ||
        yoga.ruleId === "gaja-kesari"
          ? 3
          : 2,
      summary: yoga.summary,
      factIds: [
        ...yoga.participants.map((planet) => `planet-${planet}`),
        yoga.id,
      ],
      stability: yoga.participants.includes("Chandra")
        ? input.stability.moonRashi
        : yoga.ruleId === "pancha-mahapurusha"
          ? input.stability.ascendant
          : "stable",
    })),
  );
}

function activationForDasha(
  input: SynthesisInput,
  mahadashaLord: DashaLord,
  antardashaLord: DashaLord,
): DashaThemeActivation {
  const activeLords = [mahadashaLord, antardashaLord];
  const activatedHouses = new Set<number>();
  const planetByName = new Map(
    input.planets.map((planet) => [planet.name, planet]),
  );
  const dignityByPlanet = new Map(
    input.dignities.map((record) => [record.planet, record.dignity]),
  );

  for (const lord of activeLords) {
    const planet = planetByName.get(lord);
    if (planet) {
      activatedHouses.add(
        wholeSignHouseOf(planet.longitude, input.ascendantLongitude),
      );
    }
    input.houseLords
      .filter((placement) => placement.lord === lord)
      .forEach((placement) => activatedHouses.add(placement.house));
  }

  const polarity = polarityForDignities(
    activeLords.map(
      (lord) => dignityByPlanet.get(lord) ?? "unclassified",
    ),
  );

  return {
    mahadashaLord,
    antardashaLord,
    domains: domainsForHouses(activatedHouses),
    polarity,
  };
}

function dashaThemesFor(input: SynthesisInput): DashaThemeTimeline {
  const { currentMahadasha, currentAntardasha, nextAntardasha } =
    input.vimshottari;
  const current = activationForDasha(
    input,
    currentMahadasha.lord,
    currentAntardasha.lord,
  );
  if (!nextAntardasha) {
    return { current, nextAntardasha: null };
  }

  const nextMahadasha = input.vimshottari.mahadashas.find(
    (period) => period.antardashas.includes(nextAntardasha),
  );
  if (!nextMahadasha) {
    throw new Error("Next Antardasha is not attached to a Mahadasha.");
  }

  return {
    current,
    nextAntardasha: activationForDasha(
      input,
      nextMahadasha.lord,
      nextAntardasha.lord,
    ),
  };
}

function evidenceForCurrentDasha(
  input: SynthesisInput,
  activation: DashaThemeActivation,
) {
  const { currentMahadasha, currentAntardasha } = input.vimshottari;
  const timeframe = {
    start: new Date(currentAntardasha.start),
    end: new Date(currentAntardasha.end),
  };

  return activation.domains.map(
    (domain): JyotishEvidence => ({
      id: `evidence-dasha-${currentMahadasha.lord}-${currentAntardasha.lord}-${domain}`,
      label: "Vimshottari timing interpretation",
      kind: "dasha",
      domain,
      polarity: activation.polarity,
      strength: 3,
      summary: `${currentMahadasha.lord} Mahadasha aur ${currentAntardasha.lord} Antardasha ke lords is area se jude houses ko foreground mein la sakte hain.`,
      factIds: [
        `planet-${currentMahadasha.lord}`,
        `planet-${currentAntardasha.lord}`,
        `mahadasha-${currentMahadasha.lord}-${currentMahadasha.start.toISOString()}`,
        `antardasha-${currentAntardasha.lord}-${currentAntardasha.start.toISOString()}`,
      ],
      stability: input.stability.nakshatra,
      timeframe,
    }),
  );
}

export function buildEvidenceAndDomains(input: SynthesisInput) {
  const dashaThemes = dashaThemesFor(input);
  const evidence = [
    deriveRashiSynthesisEvidence(input),
    ...evidenceForHouseLords(input),
    ...evidenceForConjunctions(input),
    ...evidenceForAspects(input),
    ...evidenceForYogas(input),
    ...evidenceForCurrentDasha(input, dashaThemes.current),
  ];
  const domains = allDomains.map((domain) =>
    personalizeDomain(
      synthesizeDomain(
        domain,
        evidence.filter(
          (item) =>
            item.domain === domain && item.kind !== "dasha",
        ),
      ),
      input,
    ),
  );

  return { evidence, domains, dashaThemes };
}
