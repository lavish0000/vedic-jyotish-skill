import { DOMAIN_TITLES } from "./config";
import { practicalTakeaway } from "./synthesis-copy";
import type {
  DomainSynthesis,
  JyotishDomain,
  JyotishEvidence,
} from "./types";

function stableSortEvidence(evidence: JyotishEvidence[]) {
  const kindPriority: Record<JyotishEvidence["kind"], number> = {
    dasha: 6,
    "rashi-synthesis": 5,
    "house-lord": 4,
    conjunction: 3,
    aspect: 2,
    yoga: 1,
  };

  return [...evidence].sort(
    (first, second) =>
      second.strength - first.strength ||
      kindPriority[second.kind] - kindPriority[first.kind] ||
      first.id.localeCompare(second.id),
  );
}

function isIndependent(
  first: JyotishEvidence,
  second: JyotishEvidence,
) {
  const firstFacts = new Set(first.factIds);
  return second.factIds.every((factId) => !firstFacts.has(factId));
}

function canCorroborate(
  lead: JyotishEvidence,
  candidate: JyotishEvidence,
) {
  if (lead.polarity === "mixed") {
    return candidate.polarity === "mixed";
  }
  return (
    candidate.polarity === lead.polarity ||
    candidate.polarity === "mixed"
  );
}

function countersLead(
  lead: JyotishEvidence,
  candidate: JyotishEvidence,
) {
  if (lead.polarity === "mixed") {
    return candidate.polarity !== "mixed";
  }
  return (
    candidate.polarity !== "mixed" &&
    candidate.polarity !== lead.polarity
  );
}

function confidenceFor(
  selected: JyotishEvidence[],
  counter: JyotishEvidence[],
) {
  const considered = [...selected, ...counter];
  if (considered.some((item) => item.stability === "sensitive")) {
    return "low" as const;
  }

  const independentRoots = new Set(
    selected.map((item) => item.factIds[0]),
  ).size;
  const allStable = considered.every(
    (item) => item.stability === "stable",
  );
  if (
    independentRoots >= 2 &&
    counter.length === 0 &&
    allStable &&
    selected.every((item) => item.polarity === "supportive")
  ) {
    return "high" as const;
  }
  return considered.length ? ("medium" as const) : ("low" as const);
}

export function synthesizeDomain(
  domain: JyotishDomain,
  domainEvidence: JyotishEvidence[],
): DomainSynthesis {
  const ranked = stableSortEvidence(domainEvidence);
  const timeframe = ranked.find((item) => item.kind === "dasha")?.timeframe;

  if (!ranked.length) {
    return {
      domain,
      title: DOMAIN_TITLES[domain],
      quickText: "Is area ke liye clear chart pattern available nahi hai.",
      text: "Is area par clear pattern nahi bana, isliye yahan broad prediction nahi dikhayi gayi.",
      overviewFacts: [],
      tone: "mixed",
      confidence: "low",
      fingerprint: `${domain}:no-evidence`,
      insights: [],
      practicalText: practicalTakeaway(domain, "mixed"),
      limitations: [],
      evidenceIds: [],
      counterEvidenceIds: [],
      omittedCounterEvidenceIds: [],
      omittedCounterEvidenceCount: 0,
    };
  }

  const lead = ranked[0];
  const corroboration = ranked
    .slice(1)
    .find(
      (candidate) =>
        canCorroborate(lead, candidate) &&
        isIndependent(lead, candidate),
    );
  const selected = corroboration ? [lead, corroboration] : [lead];
  const counterCandidates = ranked.filter(
    (candidate) =>
      !selected.includes(candidate) &&
      countersLead(lead, candidate),
  );
  const counter = counterCandidates.slice(0, 1);

  return {
    domain,
    title: DOMAIN_TITLES[domain],
    quickText: practicalTakeaway(domain, lead.polarity),
    text: practicalTakeaway(domain, lead.polarity),
    overviewFacts: [],
    tone: lead.polarity,
    confidence: confidenceFor(selected, counter),
    fingerprint: `${domain}:${selected.map((item) => item.id).join("|")}`,
    insights: [],
    practicalText: practicalTakeaway(domain, lead.polarity),
    limitations: [],
    evidenceIds: selected.map((item) => item.id),
    counterEvidenceIds: counter.map((item) => item.id),
    omittedCounterEvidenceIds: counterCandidates
      .slice(1)
      .map((item) => item.id),
    omittedCounterEvidenceCount: Math.max(
      0,
      counterCandidates.length - counter.length,
    ),
    timeframe,
  };
}
