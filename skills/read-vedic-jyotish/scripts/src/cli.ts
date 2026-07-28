#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { SwissEphemeris } from "@swisseph/browser";
import { calculateVedicChart } from "./ephemeris";
import {
  InputError,
  parseCliOptions,
  requireBirthDetails,
  usageText,
} from "./options";
import { buildReadingPacket } from "./packet";
import { resolvePlace } from "./places";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));

function parseAsOf(value?: string) {
  if (!value) return new Date();
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00.000Z`)
    : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new InputError("invalid_as_of", "Invalid as-of date");
  }
  return date;
}

function structuredError(error: unknown) {
  if (error instanceof InputError) {
    return {
      status: "invalid_input",
      error: {
        code: error.code,
        message: error.message,
      },
    };
  }
  if (error instanceof Error) {
    const invalidInputCodes = [
      ["ambiguous", "ambiguous_local_time"],
      ["does not exist", "nonexistent_local_time"],
      ["Invalid local date or time", "invalid_birth_datetime"],
      ["Unsupported birth date", "unsupported_birth_date"],
      ["Birth date is in the future", "future_birth_date"],
    ] as const;
    const match = invalidInputCodes.find(([message]) =>
      error.message.includes(message),
    );
    const code = match?.[1] ?? "calculation_failed";
    return {
      status: code === "calculation_failed" ? code : "invalid_input",
      error: {
        code,
        message: error.message,
      },
    };
  }
  return {
    status: "calculation_failed",
    error: {
      code: "unknown_error",
      message: "The chart calculation failed",
    },
  };
}

function writeJson(value: unknown, pretty = false) {
  process.stdout.write(`${JSON.stringify(value, null, pretty ? 2 : 0)}\n`);
}

async function initializeEphemeris() {
  const wasmBytes = await readFile(resolve(scriptDirectory, "swisseph.wasm"));
  const wasmUrl = `data:application/wasm;base64,${wasmBytes.toString("base64")}`;
  const ephemeris = new SwissEphemeris();

  // The dependency announces initialization on stdout, which would corrupt JSON.
  const originalLog = console.log;
  console.log = () => undefined;
  try {
    await ephemeris.init(wasmUrl);
  } finally {
    console.log = originalLog;
  }
  return ephemeris;
}

async function main() {
  const options = parseCliOptions(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(`${usageText()}\n`);
    return;
  }

  requireBirthDetails(options);
  const placeResolution = await resolvePlace(options);
  if (placeResolution.status === "needs_place_choice") {
    writeJson(placeResolution, options.pretty);
    return;
  }

  const asOf = parseAsOf(options.asOf);
  const ephemeris = await initializeEphemeris();
  try {
    const chart = await calculateVedicChart({
      date: options.date!,
      time: options.time!,
      place: placeResolution.place,
      ephemeris,
      asOf,
    });
    writeJson(
      buildReadingPacket({
        chart,
        place: placeResolution.place,
        date: options.date!,
        time: options.time!,
        asOf,
        placeSource: placeResolution.source,
        swissVersion: ephemeris.version(),
      }),
      options.pretty,
    );
  } finally {
    ephemeris.close();
  }
}

main().catch((error) => {
  writeJson(structuredError(error));
  process.exitCode = 2;
});
