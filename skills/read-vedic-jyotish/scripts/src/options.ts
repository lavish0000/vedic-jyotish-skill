export type CliOptions = {
  date?: string;
  time?: string;
  placeQuery?: string;
  placeChoice?: number;
  placeLabel?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  asOf?: string;
  pretty: boolean;
  help: boolean;
};

export class InputError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "InputError";
    this.code = code;
  }
}

const VALUE_OPTIONS = new Map([
  ["--date", "date"],
  ["--time", "time"],
  ["--place-query", "placeQuery"],
  ["--place-choice", "placeChoice"],
  ["--place-label", "placeLabel"],
  ["--latitude", "latitude"],
  ["--longitude", "longitude"],
  ["--timezone", "timezone"],
  ["--as-of", "asOf"],
] as const);

const NUMBER_KEYS = new Set<keyof CliOptions>([
  "placeChoice",
  "latitude",
  "longitude",
]);

export function parseCliOptions(argumentsList: string[]): CliOptions {
  const options: CliOptions = {
    pretty: false,
    help: false,
  };

  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    if (argument === "--pretty") {
      options.pretty = true;
      continue;
    }
    if (argument === "--help" || argument === "-h") {
      options.help = true;
      continue;
    }

    const key = VALUE_OPTIONS.get(
      argument as typeof VALUE_OPTIONS extends Map<infer K, unknown>
        ? K
        : never,
    );
    if (!key) {
      throw new InputError(
        "unknown_option",
        `Unknown option: ${argument}`,
      );
    }

    const rawValue = argumentsList[index + 1];
    if (!rawValue || rawValue.startsWith("--")) {
      throw new InputError(
        "missing_option_value",
        `Missing value for ${argument}`,
      );
    }
    index += 1;

    if (NUMBER_KEYS.has(key)) {
      const numericValue = Number(rawValue);
      if (!Number.isFinite(numericValue)) {
        throw new InputError(
          "invalid_number",
          `${argument} must be a finite number`,
        );
      }
      Object.assign(options, { [key]: numericValue });
    } else {
      Object.assign(options, { [key]: rawValue });
    }
  }

  return options;
}

export function requireBirthDetails(options: CliOptions) {
  if (!options.date) {
    throw new InputError("missing_birth_date", "Birth date is required");
  }
  if (!options.time) {
    throw new InputError("missing_birth_time", "Birth time is required");
  }
}

export function usageText() {
  return [
    "Calculate a Vedic chart as structured JSON.",
    "",
    "Search for a birthplace:",
    "  node calculate-chart.mjs --date YYYY-MM-DD --time HH:MM --place-query \"City, region, country\"",
    "",
    "Choose a returned place:",
    "  node calculate-chart.mjs --date YYYY-MM-DD --time HH:MM --place-query \"City\" --place-choice ID",
    "",
    "Use verified coordinates:",
    "  node calculate-chart.mjs --date YYYY-MM-DD --time HH:MM --place-label \"City, country\" \\",
    "    --latitude 0 --longitude 0 --timezone Area/City",
    "",
    "Optional: --as-of YYYY-MM-DD --pretty",
  ].join("\n");
}
