import type {
  EvidenceStability,
  JyotishPlanetName,
  TraditionalJyotishReport,
} from "./jyotish";

export type Place = {
  id: number;
  label: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

export type PlanetPosition = {
  name: JyotishPlanetName;
  short: string;
  longitude: number;
  longitudeSpeed: number;
  sign: string;
  degree: number;
  house: number;
  retrograde: boolean;
};

export type ChartResult = {
  ascendant: string;
  ascendantLongitude: number;
  sun: string;
  moon: string;
  nakshatra: string;
  nakshatraLord: string;
  planets: PlanetPosition[];
  traditional: TraditionalJyotishReport;
  sensitivity: string;
  ascendantStability: EvidenceStability;
  nakshatraStability: EvidenceStability;
  ayanamsa: number;
  birthUtcIso: string;
  placeLabel: string;
  localDateLabel: string;
};

export const signs = [
  { roman: "Mesh", symbol: "Ar" },
  { roman: "Vrishabha", symbol: "Ta" },
  { roman: "Mithuna", symbol: "Ge" },
  { roman: "Karka", symbol: "Ca" },
  { roman: "Simha", symbol: "Le" },
  { roman: "Kanya", symbol: "Vi" },
  { roman: "Tula", symbol: "Li" },
  { roman: "Vrishchika", symbol: "Sc" },
  { roman: "Dhanu", symbol: "Sg" },
  { roman: "Makara", symbol: "Cp" },
  { roman: "Kumbha", symbol: "Aq" },
  { roman: "Meena", symbol: "Pi" },
] as const;

const nakshatras = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishtha",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
] as const;

const dashaOrder = [
  "Ketu",
  "Shukra",
  "Surya",
  "Chandra",
  "Mangal",
  "Rahu",
  "Guru",
  "Shani",
  "Budh",
] as const;

export function normalize(value: number) {
  return ((value % 360) + 360) % 360;
}

export function signIndexOf(longitude: number) {
  return Math.floor(normalize(longitude) / 30);
}

export function signOf(longitude: number) {
  return signs[signIndexOf(longitude)].roman;
}

export function houseOf(longitude: number, ascendant: number) {
  return (
    ((signIndexOf(longitude) - signIndexOf(ascendant) + 12) % 12) + 1
  );
}

export function nakshatraOf(longitude: number) {
  const position = (normalize(longitude) * 27) / 360;
  const index = Math.min(26, Math.floor(position + 1e-12));
  const fraction = Math.max(0, position - index);
  const pada = Math.min(4, Math.floor(fraction * 4 + 1e-12) + 1);

  return {
    index,
    pada,
    label: `${nakshatras[index]}, Pada ${pada}`,
    lord: dashaOrder[index % dashaOrder.length],
  };
}

export function lagnaStability(
  before: number,
  current: number,
  after: number,
): EvidenceStability {
  const currentSign = signOf(current);
  const degree = normalize(current) % 30;
  const boundaryDistance = Math.min(degree, 30 - degree);

  return signOf(before) === currentSign &&
    signOf(after) === currentSign &&
    boundaryDistance > 0.1
    ? "stable"
    : "sensitive";
}

export function nakshatraStability(
  longitude: number,
  longitudeSpeed: number,
  minuteWindow = 5,
): EvidenceStability {
  const segment = 360 / 27;
  const offset = normalize(longitude) % segment;
  const boundaryDistance = Math.min(offset, segment - offset);
  const estimatedTravel =
    (Math.abs(longitudeSpeed) * minuteWindow) / (24 * 60);

  return boundaryDistance > estimatedTravel ? "stable" : "sensitive";
}

export function sensitivityText(
  before: number,
  current: number,
  after: number,
) {
  const beforeSign = signOf(before);
  const currentSign = signOf(current);
  const afterSign = signOf(after);
  const stable = lagnaStability(before, current, after) === "stable";

  if (stable) {
    return `Birth time se 5 minute pehle aur baad bhi Lagna ${currentSign} hi rehta hai.`;
  }

  const sampledSigns = [beforeSign, currentSign, afterSign];
  const transitions = sampledSigns.filter(
    (sign, index) => index === 0 || sign !== sampledSigns[index - 1],
  );
  if (transitions.length === 1) {
    return `Lagna ${currentSign} ki boundary ke kareeb hai. 5-minute check mein sign nahi badla, phir bhi birth record ka time verify karna useful rahega.`;
  }

  return `Birth time ke aas-paas 5 minute mein Lagna ${transitions.join(" se ")} badal raha hai. Birth record ka exact time verify karein.`;
}

function zonedParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const parts = formatter.formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);

  return {
    year: value("year"),
    month: value("month"),
    day: value("day"),
    hour: value("hour"),
    minute: value("minute"),
    second: value("second"),
  };
}

function matchesLocalParts(
  parts: ReturnType<typeof zonedParts>,
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
) {
  return (
    parts.year === year &&
    parts.month === month &&
    parts.day === day &&
    parts.hour === hour &&
    parts.minute === minute
  );
}

function timeZoneOffsetMilliseconds(date: Date, timeZone: string) {
  const parts = zonedParts(date, timeZone);
  const represented = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );

  return represented - date.getTime();
}

export function localDateTimeToUtc(
  dateValue: string,
  timeValue: string,
  timeZone: string,
) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(dateValue) ||
    !/^\d{2}:\d{2}(?::\d{2})?$/.test(timeValue)
  ) {
    throw new Error("Invalid local date or time");
  }

  const [year, month, day] = dateValue.split("-").map(Number);
  const [hour, minute, second = 0] = timeValue.split(":").map(Number);
  const calendarCheck = new Date(
    Date.UTC(year, month - 1, day, hour, minute, second),
  );

  if (
    year < 1 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59 ||
    second < 0 ||
    second > 59 ||
    calendarCheck.getUTCFullYear() !== year ||
    calendarCheck.getUTCMonth() !== month - 1 ||
    calendarCheck.getUTCDate() !== day
  ) {
    throw new Error("Invalid local date or time");
  }

  const desired = Date.UTC(year, month - 1, day, hour, minute, second);
  let candidate = desired;

  for (let index = 0; index < 4; index += 1) {
    const parts = zonedParts(new Date(candidate), timeZone);
    const represented = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second,
    );
    const adjustment = desired - represented;
    candidate += adjustment;
    if (Math.abs(adjustment) < 1000) break;
  }

  const verified = zonedParts(new Date(candidate), timeZone);
  if (!matchesLocalParts(verified, year, month, day, hour, minute)) {
    throw new Error("This local time does not exist in the selected timezone");
  }

  const nearbyOffsets = new Set<number>();
  const hourMilliseconds = 60 * 60 * 1000;
  for (let offsetHours = -48; offsetHours <= 48; offsetHours += 1) {
    nearbyOffsets.add(
      timeZoneOffsetMilliseconds(
        new Date(candidate + offsetHours * hourMilliseconds),
        timeZone,
      ),
    );
  }

  for (const offsetMilliseconds of nearbyOffsets) {
    const alternativeTimestamp = desired - offsetMilliseconds;
    if (alternativeTimestamp === candidate) continue;
    const alternative = zonedParts(
      new Date(alternativeTimestamp),
      timeZone,
    );
    if (matchesLocalParts(alternative, year, month, day, hour, minute)) {
      throw new Error("This local time is ambiguous in the selected timezone");
    }
  }

  return new Date(candidate);
}
