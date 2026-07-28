import { SIGN_NAMES } from "./config";
import type { SignName } from "./types";

export function normalizeLongitude(value: number) {
  if (!Number.isFinite(value)) {
    throw new TypeError(`Longitude must be finite. Received ${value}.`);
  }

  return ((value % 360) + 360) % 360;
}

export function signIndexOf(longitude: number) {
  return Math.floor(normalizeLongitude(longitude) / 30);
}

export function signNameOf(longitude: number): SignName {
  return SIGN_NAMES[signIndexOf(longitude)];
}

export function rashiStability(
  beforeLongitude: number,
  currentLongitude: number,
  afterLongitude: number,
) {
  const currentSignIndex = signIndexOf(currentLongitude);
  return signIndexOf(beforeLongitude) === currentSignIndex &&
    signIndexOf(afterLongitude) === currentSignIndex
    ? ("stable" as const)
    : ("sensitive" as const);
}

export function wholeSignHouseOf(
  longitude: number,
  ascendantLongitude: number,
) {
  return (
    ((signIndexOf(longitude) - signIndexOf(ascendantLongitude) + 12) % 12) +
    1
  );
}

export function angularSeparation(first: number, second: number) {
  const difference = Math.abs(
    normalizeLongitude(first) - normalizeLongitude(second),
  );
  return Math.min(difference, 360 - difference);
}

export function relativeHouseOf(longitude: number, reference: number) {
  return ((signIndexOf(longitude) - signIndexOf(reference) + 12) % 12) + 1;
}

export function houseSignName(
  house: number,
  ascendantLongitude: number,
): SignName {
  if (!Number.isInteger(house) || house < 1 || house > 12) {
    throw new RangeError(`House must be an integer from 1 to 12. Received ${house}.`);
  }

  const signIndex = (signIndexOf(ascendantLongitude) + house - 1) % 12;
  return SIGN_NAMES[signIndex];
}
