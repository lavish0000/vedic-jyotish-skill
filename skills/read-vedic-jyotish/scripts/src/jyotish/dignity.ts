import {
  CLASSICAL_PLANETS,
  DEBILITATION_SIGNS,
  EXALTATION_SIGNS,
  OWN_SIGNS,
} from "./config";
import { signIndexOf, signNameOf } from "./math";
import type {
  ClassicalPlanetName,
  Dignity,
  DignityRecord,
  JyotishPlanet,
  JyotishPlanetName,
  SignName,
} from "./types";

export function dignityFor(
  planet: JyotishPlanetName,
  sign: SignName,
): Dignity {
  if (!CLASSICAL_PLANETS.includes(planet as ClassicalPlanetName)) {
    return "unclassified";
  }

  const classicalPlanet = planet as ClassicalPlanetName;
  if (EXALTATION_SIGNS[classicalPlanet] === sign) return "exalted";
  if (DEBILITATION_SIGNS[classicalPlanet] === sign) return "debilitated";
  if (OWN_SIGNS[classicalPlanet].includes(sign)) return "own";
  return "unclassified";
}

export function deriveDignities(
  planets: readonly JyotishPlanet[],
): DignityRecord[] {
  return planets.map((planet) => {
    const sign = signNameOf(planet.longitude);
    return {
      planet: planet.name,
      sign,
      signIndex: signIndexOf(planet.longitude),
      dignity: dignityFor(planet.name, sign),
    };
  });
}
