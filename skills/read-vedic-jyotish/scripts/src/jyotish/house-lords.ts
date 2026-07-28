import { SIGN_LORDS, SIGN_NAMES } from "./config";
import { dignityFor } from "./dignity";
import {
  houseSignName,
  signIndexOf,
  signNameOf,
  wholeSignHouseOf,
} from "./math";
import type {
  HouseLordPlacement,
  JyotishPlanet,
  JyotishPlanetName,
} from "./types";

export function deriveHouseLords(
  ascendantLongitude: number,
  planets: readonly JyotishPlanet[],
): HouseLordPlacement[] {
  const planetByName = new Map<JyotishPlanetName, JyotishPlanet>(
    planets.map((planet) => [planet.name, planet]),
  );
  const ascendantSignIndex = signIndexOf(ascendantLongitude);

  return Array.from({ length: 12 }, (_, index) => {
    const house = index + 1;
    const houseSign =
      SIGN_NAMES[(ascendantSignIndex + index) % SIGN_NAMES.length];
    const lord = SIGN_LORDS[houseSign];
    const lordPlanet = planetByName.get(lord);

    if (!lordPlanet) {
      throw new Error(`Missing classical planet required for house lord: ${lord}.`);
    }

    const lordSign = signNameOf(lordPlanet.longitude);
    return {
      house,
      houseSign: houseSignName(house, ascendantLongitude),
      lord,
      lordSign,
      lordHouse: wholeSignHouseOf(
        lordPlanet.longitude,
        ascendantLongitude,
      ),
      dignity: dignityFor(lord, lordSign),
    };
  });
}
