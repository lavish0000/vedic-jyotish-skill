import type { SwissEphemeris as SwissEphemerisType } from "@swisseph/browser";
import {
  houseOf,
  lagnaStability,
  localDateTimeToUtc,
  nakshatraOf,
  nakshatraStability,
  normalize,
  sensitivityText,
  signOf,
  type ChartResult,
  type Place,
  type PlanetPosition,
} from "./chart";
import {
  deriveTraditionalJyotish,
  rashiStability,
} from "./jyotish";

const planetRows = [
  { name: "Surya", short: "Su", key: "Sun" },
  { name: "Chandra", short: "Ch", key: "Moon" },
  { name: "Budh", short: "Bu", key: "Mercury" },
  { name: "Shukra", short: "Sh", key: "Venus" },
  { name: "Mangal", short: "Ma", key: "Mars" },
  { name: "Guru", short: "Gu", key: "Jupiter" },
  { name: "Shani", short: "Sa", key: "Saturn" },
  { name: "Rahu", short: "Ra", key: "MeanNode" },
] as const;

function formatBirthLabel(dateValue: string, timeValue: string) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12));
  const dateLabel = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);

  return `${dateLabel}, ${timeValue}`;
}

type ChartInput = {
  date: string;
  time: string;
  place: Place;
  wasmUrl?: string;
  ephemeris?: SwissEphemerisType;
  asOf?: Date;
};

export async function calculateVedicChart({
  date,
  time,
  place,
  wasmUrl = "/swisseph.wasm",
  ephemeris: providedEphemeris,
  asOf,
}: ChartInput): Promise<ChartResult> {
  const calculationTime = asOf ? new Date(asOf) : new Date();
  if (Number.isNaN(calculationTime.getTime())) {
    throw new Error("Invalid calculation date");
  }

  const birthYear = Number(date.slice(0, 4));
  const currentYear = calculationTime.getUTCFullYear();
  if (birthYear < 1800 || birthYear > currentYear) {
    throw new Error("Unsupported birth date");
  }

  const utcDate = localDateTimeToUtc(date, time, place.timezone);
  if (utcDate.getTime() > calculationTime.getTime()) {
    throw new Error("Birth date is in the future");
  }

  const {
    SwissEphemeris,
    Planet,
    LunarPoint,
    HouseSystem,
    SiderealMode,
    CalculationFlag,
  } = await import("@swisseph/browser");

  let ephemeris = providedEphemeris;
  const ownsEphemeris = !providedEphemeris;

  try {
    if (!ephemeris) {
      ephemeris = new SwissEphemeris();
      await ephemeris.init(wasmUrl);
    }
    ephemeris.setSiderealMode(SiderealMode.Lahiri);

    const flags =
      CalculationFlag.MoshierEphemeris |
      CalculationFlag.Speed |
      CalculationFlag.Sidereal;

    function ascendantAt(moment: Date) {
      if (!ephemeris) throw new Error("Chart engine unavailable");
      const jd = ephemeris.dateToJulianDay(moment);
      const ayanamsa = ephemeris.getAyanamsa(jd);
      const houses = ephemeris.calculateHouses(
        jd,
        place.latitude,
        place.longitude,
        HouseSystem.WholeSign,
      );
      return normalize(houses.ascendant - ayanamsa);
    }

    const julianDay = ephemeris.dateToJulianDay(utcDate);
    const ayanamsa = ephemeris.getAyanamsa(julianDay);
    const ascendantLongitude = ascendantAt(utcDate);
    const before = ascendantAt(
      new Date(utcDate.getTime() - 5 * 60 * 1000),
    );
    const after = ascendantAt(
      new Date(utcDate.getTime() + 5 * 60 * 1000),
    );

    const bodies = {
      Sun: Planet.Sun,
      Moon: Planet.Moon,
      Mercury: Planet.Mercury,
      Venus: Planet.Venus,
      Mars: Planet.Mars,
      Jupiter: Planet.Jupiter,
      Saturn: Planet.Saturn,
      MeanNode: LunarPoint.MeanNode,
    } as const;

    const planets: PlanetPosition[] = planetRows.map((row) => {
      const position = ephemeris!.calculatePosition(
        julianDay,
        bodies[row.key],
        flags,
      );
      const longitude = normalize(position.longitude);

      return {
        name: row.name,
        short: row.short,
        longitude,
        longitudeSpeed: position.longitudeSpeed,
        sign: signOf(longitude),
        degree: longitude % 30,
        house: houseOf(longitude, ascendantLongitude),
        retrograde: position.longitudeSpeed < 0,
      };
    });

    const rahu = planets.find((planet) => planet.name === "Rahu");
    if (rahu) {
      const longitude = normalize(rahu.longitude + 180);
      planets.push({
        name: "Ketu",
        short: "Ke",
        longitude,
        longitudeSpeed: rahu.longitudeSpeed,
        sign: signOf(longitude),
        degree: longitude % 30,
        house: houseOf(longitude, ascendantLongitude),
        retrograde: true,
      });
    }

    const sunLongitude =
      planets.find((planet) => planet.name === "Surya")?.longitude ?? 0;
    const moonLongitude =
      planets.find((planet) => planet.name === "Chandra")?.longitude ?? 0;
    const moonSpeed =
      planets.find((planet) => planet.name === "Chandra")?.longitudeSpeed ?? 0;
    const moonBeforeLongitude = normalize(
      ephemeris.calculatePosition(
        ephemeris.dateToJulianDay(
          new Date(utcDate.getTime() - 5 * 60 * 1000),
        ),
        bodies.Moon,
        flags,
      ).longitude,
    );
    const moonAfterLongitude = normalize(
      ephemeris.calculatePosition(
        ephemeris.dateToJulianDay(
          new Date(utcDate.getTime() + 5 * 60 * 1000),
        ),
        bodies.Moon,
        flags,
      ).longitude,
    );
    const ascendant = signOf(ascendantLongitude);
    const moon = signOf(moonLongitude);
    const nakshatra = nakshatraOf(moonLongitude);
    const ascendantStability = lagnaStability(
      before,
      ascendantLongitude,
      after,
    );
    const moonNakshatraStability = nakshatraStability(
      moonLongitude,
      moonSpeed,
    );
    const moonRashiStability = rashiStability(
      moonBeforeLongitude,
      moonLongitude,
      moonAfterLongitude,
    );
    const traditional = deriveTraditionalJyotish({
      ascendantLongitude,
      planets,
      birthDate: utcDate,
      asOf: calculationTime,
      stability: {
        ascendant: ascendantStability,
        moonRashi: moonRashiStability,
        nakshatra: moonNakshatraStability,
      },
    });

    return {
      ascendant,
      ascendantLongitude,
      sun: signOf(sunLongitude),
      moon,
      nakshatra: nakshatra.label,
      nakshatraLord: nakshatra.lord,
      planets,
      traditional,
      sensitivity: sensitivityText(before, ascendantLongitude, after),
      ascendantStability,
      nakshatraStability: moonNakshatraStability,
      ayanamsa,
      birthUtcIso: utcDate.toISOString(),
      placeLabel: place.label,
      localDateLabel: formatBirthLabel(date, time),
    };
  } finally {
    if (ownsEphemeris) {
      ephemeris?.close();
    }
  }
}
