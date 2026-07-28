import {
  DASHA_ORDER,
  DASHA_YEARS,
  VIMSHOTTARI_YEAR_DAYS,
} from "./config";
import { normalizeLongitude } from "./math";
import type {
  AntardashaPeriod,
  DashaLord,
  MahadashaPeriod,
  VimshottariTimeline,
} from "./types";

const DAY_MILLISECONDS = 24 * 60 * 60 * 1000;
const YEAR_MILLISECONDS =
  VIMSHOTTARI_YEAR_DAYS * DAY_MILLISECONDS;
const NAKSHATRA_SPAN = 360 / 27;
const FULL_CYCLE_YEARS = 120;

function assertValidDate(date: Date, label: string) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new TypeError(`${label} must be a valid Date.`);
  }
}

function rotateDashaOrder(startLord: DashaLord) {
  const startIndex = DASHA_ORDER.indexOf(startLord);
  return [
    ...DASHA_ORDER.slice(startIndex),
    ...DASHA_ORDER.slice(0, startIndex),
  ];
}

function periodContains(period: { start: Date; end: Date }, moment: Date) {
  const time = moment.getTime();
  return time >= period.start.getTime() && time < period.end.getTime();
}

function buildMahadasha(
  lord: DashaLord,
  startMilliseconds: number,
): MahadashaPeriod {
  const durationYears = DASHA_YEARS[lord];
  const endMilliseconds =
    startMilliseconds + durationYears * YEAR_MILLISECONDS;
  const antardashas: AntardashaPeriod[] = [];
  let periodStart = startMilliseconds;
  const antardashaOrder = rotateDashaOrder(lord);

  antardashaOrder.forEach((antardashaLord, index) => {
    const antardashaYears =
      (durationYears * DASHA_YEARS[antardashaLord]) /
      FULL_CYCLE_YEARS;
    const calculatedEnd =
      periodStart + antardashaYears * YEAR_MILLISECONDS;
    const periodEnd =
      index === antardashaOrder.length - 1
        ? endMilliseconds
        : calculatedEnd;

    antardashas.push({
      lord: antardashaLord,
      start: new Date(periodStart),
      end: new Date(periodEnd),
      durationYears: antardashaYears,
    });
    periodStart = periodEnd;
  });

  return {
    lord,
    start: new Date(startMilliseconds),
    end: new Date(endMilliseconds),
    durationYears,
    antardashas,
  };
}

function findAntardasha(period: MahadashaPeriod, moment: Date) {
  const antardasha = period.antardashas.find((candidate) =>
    periodContains(candidate, moment),
  );
  if (!antardasha) {
    throw new RangeError(
      `No antardasha contains ${moment.toISOString()} in ${period.lord} Mahadasha.`,
    );
  }
  return antardasha;
}

export function calculateVimshottari(
  moonLongitude: number,
  birthDate: Date,
  asOf: Date,
): VimshottariTimeline {
  assertValidDate(birthDate, "birthDate");
  assertValidDate(asOf, "asOf");
  if (asOf.getTime() < birthDate.getTime()) {
    throw new RangeError("asOf cannot be earlier than birthDate.");
  }

  const normalizedMoon = normalizeLongitude(moonLongitude);
  const birthNakshatraIndex = Math.floor(
    normalizedMoon / NAKSHATRA_SPAN,
  );
  const offsetWithinNakshatra =
    normalizedMoon - birthNakshatraIndex * NAKSHATRA_SPAN;
  const elapsedFraction = offsetWithinNakshatra / NAKSHATRA_SPAN;
  const birthMahadashaLord =
    DASHA_ORDER[birthNakshatraIndex % DASHA_ORDER.length];
  const birthMahadashaYears = DASHA_YEARS[birthMahadashaLord];
  const elapsedMilliseconds =
    elapsedFraction * birthMahadashaYears * YEAR_MILLISECONDS;
  const firstStart = birthDate.getTime() - elapsedMilliseconds;
  const mahadashas: MahadashaPeriod[] = [];
  let periodStart = firstStart;
  let lordIndex = DASHA_ORDER.indexOf(birthMahadashaLord);
  let currentPeriodFound = false;

  while (true) {
    const lord = DASHA_ORDER[lordIndex % DASHA_ORDER.length];
    const mahadasha = buildMahadasha(lord, periodStart);
    mahadashas.push(mahadasha);
    periodStart = mahadasha.end.getTime();
    lordIndex += 1;

    if (currentPeriodFound) break;
    currentPeriodFound = periodContains(mahadasha, asOf);
  }

  const birthMahadasha = mahadashas[0];
  const currentMahadasha = mahadashas.find((period) =>
    periodContains(period, asOf),
  );
  if (!currentMahadasha) {
    throw new RangeError("No mahadasha contains the requested asOf date.");
  }

  const birthAntardasha = findAntardasha(birthMahadasha, birthDate);
  const currentAntardasha = findAntardasha(currentMahadasha, asOf);
  const currentMahadashaIndex = mahadashas.indexOf(currentMahadasha);
  const currentAntardashaIndex =
    currentMahadasha.antardashas.indexOf(currentAntardasha);
  const nextMahadasha =
    mahadashas[currentMahadashaIndex + 1] ?? null;
  const nextAntardasha =
    currentMahadasha.antardashas[currentAntardashaIndex + 1] ??
    nextMahadasha?.antardashas[0] ??
    null;
  const birthBalanceDays =
    (birthMahadasha.end.getTime() - birthDate.getTime()) /
    DAY_MILLISECONDS;

  return {
    yearDays: VIMSHOTTARI_YEAR_DAYS,
    birthNakshatraIndex,
    birthMahadashaLord,
    birthBalanceDays,
    birthBalanceYears: birthBalanceDays / VIMSHOTTARI_YEAR_DAYS,
    birthMahadasha,
    birthAntardasha,
    currentMahadasha,
    currentAntardasha,
    nextAntardasha,
    nextMahadasha,
    mahadashas,
    asOf: new Date(asOf),
  };
}
