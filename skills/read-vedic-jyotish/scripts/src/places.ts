import type { Place } from "./chart";
import {
  InputError,
  type CliOptions,
} from "./options";

export type PlaceCandidate = {
  id: number;
  label: string;
  latitude: number;
  longitude: number;
  timezone: string;
  countryCode?: string;
};

export type PlaceResolution =
  | {
      status: "resolved";
      place: Place;
      source: "provided" | "open-meteo";
    }
  | {
      status: "needs_place_choice";
      query: string;
      message: string;
      candidates: PlaceCandidate[];
    };

type GeocodingItem = {
  id?: number;
  name?: string;
  admin1?: string;
  admin2?: string;
  country?: string;
  country_code?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
};

function validateTimezone(timezone: string) {
  try {
    new Intl.DateTimeFormat("en", { timeZone: timezone }).format();
  } catch {
    throw new InputError(
      "invalid_timezone",
      `Invalid IANA timezone: ${timezone}`,
    );
  }
}

function providedPlace(options: CliOptions): PlaceResolution | null {
  const coordinateValues = [
    options.latitude,
    options.longitude,
    options.timezone,
  ];
  const hasAnyCoordinateValue = coordinateValues.some(
    (value) => value !== undefined,
  );
  if (!hasAnyCoordinateValue) return null;

  if (
    options.latitude === undefined ||
    options.longitude === undefined ||
    !options.timezone
  ) {
    throw new InputError(
      "incomplete_place",
      "Latitude, longitude, and timezone must be provided together",
    );
  }
  if (options.latitude < -90 || options.latitude > 90) {
    throw new InputError(
      "invalid_latitude",
      "Latitude must be between -90 and 90",
    );
  }
  if (options.longitude < -180 || options.longitude > 180) {
    throw new InputError(
      "invalid_longitude",
      "Longitude must be between -180 and 180",
    );
  }
  validateTimezone(options.timezone);

  return {
    status: "resolved",
    source: "provided",
    place: {
      id: 0,
      label: options.placeLabel?.trim() || "Provided coordinates",
      latitude: options.latitude,
      longitude: options.longitude,
      timezone: options.timezone,
    },
  };
}

function candidateLabel(item: GeocodingItem) {
  return [item.name, item.admin2, item.admin1, item.country]
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index)
    .join(", ");
}

// TODO: add an optional offline gazetteer after a size-bounded dataset is selected.
async function searchPlaces(query: string): Promise<PlaceCandidate[]> {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", query);
  url.searchParams.set("count", "8");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        accept: "application/json",
      },
    });
  } catch {
    throw new InputError(
      "place_lookup_unavailable",
      "Birthplace search is temporarily unavailable",
    );
  }
  if (!response.ok) {
    throw new InputError(
      "place_lookup_unavailable",
      `Birthplace search returned HTTP ${response.status}`,
    );
  }

  const payload = (await response.json()) as {
    results?: GeocodingItem[];
  };
  return (payload.results ?? [])
    .filter(
      (item) =>
        typeof item.id === "number" &&
        typeof item.latitude === "number" &&
        typeof item.longitude === "number" &&
        Boolean(item.name) &&
        Boolean(item.timezone),
    )
    .map((item) => ({
      id: item.id!,
      label: candidateLabel(item),
      latitude: item.latitude!,
      longitude: item.longitude!,
      timezone: item.timezone!,
      countryCode: item.country_code,
    }));
}

export async function resolvePlace(
  options: CliOptions,
): Promise<PlaceResolution> {
  const explicit = providedPlace(options);
  if (explicit) return explicit;

  const query = options.placeQuery?.trim();
  if (!query) {
    throw new InputError(
      "missing_birthplace",
      "Provide a birthplace query or verified coordinates and timezone",
    );
  }

  const candidates = await searchPlaces(query);
  if (!candidates.length) {
    throw new InputError(
      "place_not_found",
      `No birthplace match was found for: ${query}`,
    );
  }

  const selected =
    options.placeChoice === undefined
      ? candidates.length === 1
        ? candidates[0]
        : null
      : candidates.find((candidate) => candidate.id === options.placeChoice);

  if (!selected) {
    return {
      status: "needs_place_choice",
      query,
      message:
        options.placeChoice === undefined
          ? "Choose the birthplace that matches the birth record"
          : "The selected birthplace ID was not found; choose from these matches",
      candidates,
    };
  }

  return {
    status: "resolved",
    source: "open-meteo",
    place: {
      id: selected.id,
      label: selected.label,
      latitude: selected.latitude,
      longitude: selected.longitude,
      timezone: selected.timezone,
    },
  };
}
