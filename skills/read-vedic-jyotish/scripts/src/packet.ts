import { createHash } from "node:crypto";
import type {
  ChartResult,
  Place,
} from "./chart";

const SCHEMA_VERSION = "vedic-jyotish-reading-packet.v1";
const CALCULATION_VERSION = "vedic-jyotish-local-1.0.0";

export function buildReadingPacket({
  chart,
  place,
  date,
  time,
  asOf,
  placeSource,
  swissVersion,
}: {
  chart: ChartResult;
  place: Place;
  date: string;
  time: string;
  asOf: Date;
  placeSource: "provided" | "open-meteo";
  swissVersion: string;
}) {
  const timeline = chart.traditional.vimshottari;
  const periodSummary = (
    period:
      | typeof timeline.currentMahadasha
      | typeof timeline.currentAntardasha
      | null,
  ) =>
    period
      ? {
          lord: period.lord,
          start: period.start,
          end: period.end,
          durationYears: period.durationYears,
        }
      : null;
  const dasha = {
    asOf: timeline.asOf,
    birthNakshatraIndex: timeline.birthNakshatraIndex,
    birthMahadashaLord: timeline.birthMahadashaLord,
    birthBalanceYears: timeline.birthBalanceYears,
    birthMahadasha: periodSummary(timeline.birthMahadasha),
    birthAntardasha: periodSummary(timeline.birthAntardasha),
    currentMahadasha: periodSummary(timeline.currentMahadasha),
    currentAntardasha: periodSummary(timeline.currentAntardasha),
    nextAntardasha: periodSummary(timeline.nextAntardasha),
    nextMahadasha: periodSummary(timeline.nextMahadasha),
    mahadashaWindows: timeline.mahadashas.map((period) => ({
      lord: period.lord,
      start: period.start,
      end: period.end,
    })),
  };

  const packet = {
    status: "ok" as const,
    schemaVersion: SCHEMA_VERSION,
    calculationVersion: CALCULATION_VERSION,
    ruleSetVersion: chart.traditional.ruleSetVersion,
    method: {
      zodiac: "sidereal",
      ayanamsha: "Lahiri",
      houseSystem: "whole-sign",
      lunarNode: "mean",
      ketu: "Rahu plus 180 degrees",
      ephemeris: "Moshier",
      swissEphemerisVersion: swissVersion,
      vimshottariYearDays: 365.25,
    },
    input: {
      localDate: date,
      localTime: time,
      birthplace: place.label,
      latitude: place.latitude,
      longitude: place.longitude,
      timezone: place.timezone,
      placeSource,
      birthUtc: chart.birthUtcIso,
      asOf: asOf.toISOString(),
    },
    chart: {
      lagna: chart.ascendant,
      lagnaLongitude: chart.ascendantLongitude,
      suryaRashi: chart.sun,
      chandraRashi: chart.moon,
      nakshatra: chart.nakshatra,
      nakshatraLord: chart.nakshatraLord,
      ayanamshaDegrees: chart.ayanamsa,
      planets: chart.planets,
      sensitivity: {
        lagna: chart.ascendantStability,
        nakshatra: chart.nakshatraStability,
        summary: chart.sensitivity,
      },
    },
    analysis: {
      houseLords: chart.traditional.houseLords,
      dignities: chart.traditional.dignities,
      conjunctions: chart.traditional.conjunctions,
      aspects: chart.traditional.aspects,
      yogas: chart.traditional.yogas,
      dasha,
      dashaThemes: chart.traditional.dashaThemes,
      evidence: chart.traditional.evidence,
      domains: chart.traditional.domains,
    },
    interpretationBoundary: {
      evidenceMeaning:
        "Traditional rule support within this configured Jyotish method",
      confidenceMeaning:
        "Internal agreement among configured rules, not event probability",
      predictionStatus:
        "Traditional interpretation; future events are not guaranteed",
    },
  };
  const digest = createHash("sha256")
    .update(JSON.stringify(packet))
    .digest("hex");

  return {
    ...packet,
    digest: `sha256:${digest}`,
  };
}
