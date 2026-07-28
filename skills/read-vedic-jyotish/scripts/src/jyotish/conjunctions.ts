import { PLANET_ORDER } from "./config";
import {
  angularSeparation,
  signIndexOf,
  signNameOf,
} from "./math";
import type {
  ConjunctionTightness,
  JyotishPlanet,
  SameSignConjunction,
} from "./types";

function tightnessFor(separation: number): ConjunctionTightness {
  if (separation <= 5) return "tight";
  if (separation <= 10) return "moderate";
  return "wide";
}

export function deriveSameSignConjunctions(
  planets: readonly JyotishPlanet[],
): SameSignConjunction[] {
  const sorted = [...planets].sort(
    (first, second) =>
      PLANET_ORDER.indexOf(first.name) - PLANET_ORDER.indexOf(second.name),
  );
  const conjunctions: SameSignConjunction[] = [];

  for (let firstIndex = 0; firstIndex < sorted.length; firstIndex += 1) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < sorted.length;
      secondIndex += 1
    ) {
      const first = sorted[firstIndex];
      const second = sorted[secondIndex];
      if (signIndexOf(first.longitude) !== signIndexOf(second.longitude)) {
        continue;
      }

      const angularDistance = angularSeparation(
        first.longitude,
        second.longitude,
      );
      conjunctions.push({
        id: `conjunction-${first.name}-${second.name}`,
        planets: [first.name, second.name],
        sign: signNameOf(first.longitude),
        angularSeparation: angularDistance,
        tightness: tightnessFor(angularDistance),
      });
    }
  }

  return conjunctions;
}
