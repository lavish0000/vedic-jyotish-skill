import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";

const skill = new URL(
  "../skills/read-vedic-jyotish/",
  import.meta.url,
);

test("skill stays discoverable, concise, and self-contained", async () => {
  const text = await readFile(new URL("SKILL.md", skill), "utf8");
  const lines = text.split("\n");

  assert.match(text, /^---\nname: read-vedic-jyotish\n/);
  assert.match(text, /\ndescription: .+kundli-style reading/);
  assert.doesNotMatch(text, /\[TODO|TODO:/);
  assert.ok(lines.length < 500);

  for (const path of [
    "scripts/calculate-chart.mjs",
    "scripts/audit-reading.mjs",
    "scripts/swisseph.wasm",
    "references/calculation-contract.md",
    "references/interpretation-rules.md",
    "references/domain-guide.md",
    "references/language-and-format.md",
    "LICENSE",
  ]) {
    await access(new URL(path, skill));
  }

  const calculator = await stat(
    new URL("scripts/calculate-chart.mjs", skill),
  );
  const auditor = await stat(
    new URL("scripts/audit-reading.mjs", skill),
  );
  assert.ok((calculator.mode & 0o111) !== 0);
  assert.ok((auditor.mode & 0o111) !== 0);
});
