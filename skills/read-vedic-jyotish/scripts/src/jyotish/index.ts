import { deriveGrahaAspects } from "./aspects";
import {
  PLANET_ORDER,
  RULE_SET_VERSION,
} from "./config";
import { deriveSameSignConjunctions } from "./conjunctions";
import { deriveDignities } from "./dignity";
import { deriveHouseLords } from "./house-lords";
import { normalizeLongitude } from "./math";
import { buildEvidenceAndDomains } from "./synthesis";
import type {
  JyotishPlanetName,
  TraditionalJyotishInput,
  TraditionalJyotishReport,
} from "./types";
import { calculateVimshottari } from "./vimshottari";
import { evaluateYogas } from "./yogas";

function validateInput(input: TraditionalJyotishInput) {
  normalizeLongitude(input.ascendantLongitude);
  const seen = new Set<JyotishPlanetName>();

  for (const planet of input.planets) {
    normalizeLongitude(planet.longitude);
    if (seen.has(planet.name)) {
      throw new Error(`Duplicate planet in Jyotish input: ${planet.name}.`);
    }
    seen.add(planet.name);
  }

  for (const requiredPlanet of PLANET_ORDER) {
    if (!seen.has(requiredPlanet)) {
      throw new Error(
        `Missing planet in Jyotish input: ${requiredPlanet}.`,
      );
    }
  }
}

export function deriveTraditionalJyotish(
  input: TraditionalJyotishInput,
): TraditionalJyotishReport {
  validateInput(input);
  const stability = {
    ascendant: input.stability?.ascendant ?? "unknown",
    moonRashi: input.stability?.moonRashi ?? "unknown",
    nakshatra: input.stability?.nakshatra ?? "unknown",
  } as const;
  const moon = input.planets.find(
    (planet) => planet.name === "Chandra",
  );
  if (!moon) {
    throw new Error("Chandra is required for Vimshottari calculation.");
  }

  const houseLords = deriveHouseLords(
    input.ascendantLongitude,
    input.planets,
  );
  const dignities = deriveDignities(input.planets);
  const conjunctions = deriveSameSignConjunctions(input.planets);
  const aspects = deriveGrahaAspects(
    input.ascendantLongitude,
    input.planets,
  );
  const yogas = evaluateYogas(
    input.ascendantLongitude,
    input.planets,
  );
  const vimshottari = calculateVimshottari(
    moon.longitude,
    input.birthDate,
    input.asOf,
  );
  const { evidence, domains, dashaThemes } = buildEvidenceAndDomains({
    ascendantLongitude: input.ascendantLongitude,
    planets: input.planets,
    houseLords,
    dignities,
    conjunctions,
    aspects,
    yogas,
    vimshottari,
    stability,
  });

  return {
    ruleSetVersion: RULE_SET_VERSION,
    houseLords,
    dignities,
    conjunctions,
    aspects,
    yogas,
    vimshottari,
    dashaThemes,
    evidence,
    domains,
  };
}

export { deriveGrahaAspects } from "./aspects";
export {
  DOMAIN_HOUSES,
  RULE_SET_VERSION,
  SIGN_LORDS,
  VIMSHOTTARI_YEAR_DAYS,
} from "./config";
export { deriveSameSignConjunctions } from "./conjunctions";
export { deriveDignities, dignityFor } from "./dignity";
export { formatOrdinal } from "./format";
export { deriveHouseLords } from "./house-lords";
export {
  angularSeparation,
  houseSignName,
  normalizeLongitude,
  rashiStability,
  relativeHouseOf,
  signIndexOf,
  signNameOf,
  wholeSignHouseOf,
} from "./math";
export { deriveRashiSynthesisEvidence } from "./rashi-synthesis";
export { buildEvidenceAndDomains } from "./synthesis";
export type * from "./types";
export { calculateVimshottari } from "./vimshottari";
export {
  detectBudhaAditya,
  detectChandraMangala,
  detectGajaKesari,
  detectPanchaMahapurusha,
  detectParivartana,
  evaluateYogas,
} from "./yogas";
