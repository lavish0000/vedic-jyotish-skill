#!/usr/bin/env node

import { readFile } from "node:fs/promises";

const DOMAINS = [
  "self",
  "career",
  "money",
  "relationships",
  "children",
  "family",
  "wellbeing",
  "education",
  "property",
  "travel",
];

const CONFIDENCE_RANK = {
  low: 1,
  medium: 2,
  high: 3,
};

const CERTAINTY_PATTERNS = [
  /\bguarantee(?:d)?\b/i,
  /\bdefinitely\b/i,
  /\bcertain(?:ly)?\b/i,
  /\b100\s*%\b/i,
  /\bpakka\b/i,
  /\bnishchit\b/i,
  /\bwill\s+(?:marry|divorce|happen|receive|earn|settle)\b/i,
];

const UNSUPPORTED_PATTERNS = [
  /\b(?:one|two|three|four|1|2|3|4)\s+(?:marriages?|children|child)\b/i,
  /\b(?:child|baby)\s+(?:will\s+be\s+)?(?:a\s+)?(?:boy|girl)\b/i,
  /\b(?:fertile|infertile|pregnan(?:t|cy))\b/i,
  /\b(?:diagnos(?:is|ed)|disease|lifespan|cause of death)\b/i,
  /\b(?:alimony|court outcome|legal result)\b/i,
  /\b(?:exact salary|exact profession|exact appearance)\b/i,
  /\b\d+(?:\.\d+)?\s*%\s+(?:chance|probability)\b/i,
];

function parseArguments(argumentsList) {
  const result = {};
  for (let index = 0; index < argumentsList.length; index += 2) {
    const key = argumentsList[index];
    const value = argumentsList[index + 1];
    if (!["--packet", "--plan"].includes(key) || !value) {
      throw new Error(
        "Usage: node audit-reading.mjs --packet CHART.json --plan PLAN.json",
      );
    }
    result[key.slice(2)] = value;
  }
  if (!result.packet || !result.plan) {
    throw new Error("Both --packet and --plan are required");
  }
  return result;
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

function evidenceReferences(packet) {
  return new Map(
    (packet.analysis?.evidence ?? []).map((item) => [item.id, item]),
  );
}

function domainReferences(packet) {
  return new Map(
    (packet.analysis?.domains ?? []).map((item) => [item.domain, item]),
  );
}

function validateText(text, location, errors) {
  if (typeof text !== "string" || text.trim().length < 12) {
    errors.push(`${location}: claim text is missing or too short`);
    return;
  }
  for (const pattern of CERTAINTY_PATTERNS) {
    if (pattern.test(text)) {
      errors.push(`${location}: certainty language is not allowed`);
      break;
    }
  }
  for (const pattern of UNSUPPORTED_PATTERNS) {
    if (pattern.test(text)) {
      errors.push(`${location}: unsupported concrete prediction`);
      break;
    }
  }
}

function validateClaim({
  claim,
  location,
  domain,
  evidenceById,
  errors,
}) {
  validateText(claim?.text, location, errors);
  if (!Array.isArray(claim?.evidenceIds) || !claim.evidenceIds.length) {
    errors.push(`${location}: at least one evidence ID is required`);
    return [];
  }

  const resolved = [];
  for (const id of claim.evidenceIds) {
    const evidence = evidenceById.get(id);
    if (!evidence) {
      errors.push(`${location}: unknown evidence ID ${id}`);
      continue;
    }
    if (evidence.domain !== domain) {
      errors.push(
        `${location}: evidence ${id} belongs to ${evidence.domain}, not ${domain}`,
      );
    }
    resolved.push(evidence);
  }

  if (claim.timing === true) {
    if (!resolved.some((item) => item.kind === "dasha")) {
      errors.push(`${location}: timing claim has no dasha evidence`);
    }
    if (!resolved.some((item) => item.timeframe)) {
      errors.push(`${location}: timing claim has no returned timeframe`);
    }
  } else if (resolved.some((item) => item.kind === "dasha")) {
    errors.push(
      `${location}: dasha evidence must be marked as a timing claim`,
    );
  }
  return resolved;
}

function validateSection({
  section,
  index,
  evidenceById,
  domainByName,
  errors,
  warnings,
}) {
  const location = `sections[${index}]`;
  if (!DOMAINS.includes(section?.domain)) {
    errors.push(`${location}: unknown domain`);
    return;
  }

  const configured = domainByName.get(section.domain);
  if (!configured) {
    errors.push(`${location}: domain is missing from the chart packet`);
    return;
  }
  if (!Array.isArray(section.claims) || !section.claims.length) {
    errors.push(`${location}: at least one claim is required`);
    return;
  }

  if (!CONFIDENCE_RANK[section.confidence]) {
    errors.push(`${location}: invalid confidence`);
  } else if (
    CONFIDENCE_RANK[section.confidence] >
    CONFIDENCE_RANK[configured.confidence]
  ) {
    errors.push(
      `${location}: confidence exceeds the calculated ${configured.confidence} band`,
    );
  }

  const resolvedClaims = section.claims.flatMap((claim, claimIndex) =>
    validateClaim({
      claim,
      location: `${location}.claims[${claimIndex}]`,
      domain: section.domain,
      evidenceById,
      errors,
    }),
  );

  const expectedCounters = [
    ...(configured.counterEvidenceIds ?? []),
    ...(configured.omittedCounterEvidenceIds ?? []),
  ];
  const declaredCounters = new Set(section.counterEvidenceIds ?? []);
  if (
    expectedCounters.length &&
    !expectedCounters.some((id) => declaredCounters.has(id))
  ) {
    errors.push(`${location}: a returned counter-signal must be represented`);
  }
  for (const id of declaredCounters) {
    if (!expectedCounters.includes(id)) {
      errors.push(`${location}: ${id} is not a counter-signal for this domain`);
    }
  }

  const isSensitive = resolvedClaims.some(
    (item) => item.stability === "sensitive",
  );
  if (
    (configured.confidence === "low" || isSensitive) &&
    section.provisional !== true
  ) {
    errors.push(`${location}: sensitive or low-confidence claims must be provisional`);
  }
  if (
    configured.confidence !== "low" &&
    !isSensitive &&
    section.provisional === true
  ) {
    warnings.push(`${location}: provisional flag is more cautious than required`);
  }
}

function audit(packet, plan) {
  const errors = [];
  const warnings = [];

  if (packet.status !== "ok") {
    errors.push("packet: calculation status is not ok");
  }
  if (packet.schemaVersion !== "vedic-jyotish-reading-packet.v1") {
    errors.push("packet: unsupported schema version");
  }
  if (plan.schemaVersion !== "vedic-jyotish-reading-plan.v1") {
    errors.push("plan: unsupported schema version");
  }
  if (plan.packetDigest !== packet.digest) {
    errors.push("plan: packet digest does not match");
  }
  if (!["full", "focused"].includes(plan.readingType)) {
    errors.push("plan: readingType must be full or focused");
  }
  if (!Array.isArray(plan.sections)) {
    errors.push("plan: sections must be an array");
    return { errors, warnings };
  }

  const evidenceById = evidenceReferences(packet);
  const domainByName = domainReferences(packet);
  const seenDomains = new Set();
  plan.sections.forEach((section, index) => {
    if (seenDomains.has(section?.domain)) {
      errors.push(`sections[${index}]: duplicate domain ${section.domain}`);
    }
    seenDomains.add(section?.domain);
    validateSection({
      section,
      index,
      evidenceById,
      domainByName,
      errors,
      warnings,
    });
  });

  if (plan.readingType === "full") {
    for (const domain of DOMAINS) {
      if (!seenDomains.has(domain)) {
        errors.push(`plan: full reading is missing the ${domain} domain`);
      }
    }
  }

  return { errors, warnings };
}

async function main() {
  const paths = parseArguments(process.argv.slice(2));
  const packet = await readJson(paths.packet);
  const plan = await readJson(paths.plan);
  const result = audit(packet, plan);
  const valid = result.errors.length === 0;
  process.stdout.write(
    `${JSON.stringify(
      {
        status: valid ? "ok" : "invalid",
        valid,
        ...result,
      },
      null,
      2,
    )}\n`,
  );
  if (!valid) process.exitCode = 2;
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 2;
});
