#!/usr/bin/env node

import { chmod, copyFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skillScripts = resolve(
  root,
  "skills/read-vedic-jyotish/scripts",
);
const output = resolve(skillScripts, "calculate-chart.mjs");

await build({
  entryPoints: [resolve(skillScripts, "src/cli.ts")],
  outfile: output,
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  legalComments: "eof",
  minify: false,
  sourcemap: false,
});

await copyFile(
  resolve(root, "node_modules/@swisseph/browser/dist/swisseph.wasm"),
  resolve(skillScripts, "swisseph.wasm"),
);
await chmod(output, 0o755);
