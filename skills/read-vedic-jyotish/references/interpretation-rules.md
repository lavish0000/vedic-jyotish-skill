# Interpretation and evidence rules

## Contents

1. Evidence meanings
2. Synthesis procedure
3. Timing
4. Supported rules
5. Reading plan schema
6. Audit requirements

## Evidence meanings

A chart fact may be stated directly. A life conclusion must be qualified and
cited.

- `evidenceIds`: selected support for the domain synthesis
- `counterEvidenceIds`: strongest balancing signal
- `omittedCounterEvidenceIds`: additional balancing signals that must be
  inspected
- `factIds`: calculated placements or rule facts behind one evidence item
- `strength`: salience from 1 to 3, never probability
- `polarity`: supportive, challenging, or mixed within this method
- `stability`: stable, sensitive, or unknown
- `confidence`: internal agreement among configured rules, not scientific
  validity or event probability

A counter-signal softens or conditions the lead interpretation. It is neither
ignored nor treated as automatically cancelling the lead.

Never raise a confidence band. Any sensitive evidence requires provisional
wording even when the domain confidence is otherwise medium or high.

## Synthesis procedure

For each requested domain:

1. Read the domain's `text`, `overviewFacts`, `insights`, and limitations.
2. Resolve selected and counter evidence against the global evidence array.
3. Identify the lead natal pattern.
4. Find a second independent chart fact when available.
5. Separate supporting, challenging, and mixed signals.
6. Translate the combination into likely tendencies or dynamics.
7. Include the strongest practical counterweight.
8. Preserve uncertainty and birth-time sensitivity.

Do not merely paraphrase every evidence item. Connect facts into a coherent
pattern while keeping the conclusion no stronger than its support.

If the calculator does not support a rule, the reading does not support the
claim.

## Timing

Keep natal and timing claims separate.

- Natal evidence describes the configured chart pattern.
- Dasha evidence describes what may be foregrounded for a returned period.
- A timing claim must cite at least one `kind: dasha` evidence item with a
  returned timeframe.
- Do not infer an event solely because a dasha lord is active.
- Do not invent a date within a dasha window.
- For a different date, rerun the calculator with that `as-of` value.

Changing `as-of` may change dasha evidence and timing language. It must not
change natal placements, yogas, or natal character claims.

## Supported rules

Use only returned:

- whole-sign house-lord placements
- classical graha aspects
- same-sign conjunctions and their returned separation bands
- returned dignity classifications
- returned Rashi synthesis
- returned Vimshottari activation
- named yogas produced by these rules:
  - Pancha Mahapurusha
  - Gaja Kesari
  - Budha Aditya
  - same-sign Chandra Mangala
  - Parivartana

Do not name another yoga from memory. Do not add combustion, planetary war,
Shadbala, Ashtakavarga, transits, divisional-chart conditions, or degree
rules that are absent from the packet.

## Reading plan schema

Before drafting prose, create:

```json
{
  "schemaVersion": "vedic-jyotish-reading-plan.v1",
  "packetDigest": "sha256:...",
  "readingType": "full",
  "sections": [
    {
      "domain": "career",
      "confidence": "medium",
      "provisional": false,
      "counterEvidenceIds": ["exact-returned-id"],
      "claims": [
        {
          "text": "Qualified chart-specific conclusion",
          "evidenceIds": ["exact-returned-id"],
          "timing": false
        }
      ]
    }
  ]
}
```

Use `readingType: full` only when all ten domains are planned. Use
`readingType: focused` for a smaller request.

Every substantial conclusion must appear as a claim. Each claim needs at
least one exact evidence ID from its domain. Set `timing: true` only for a
claim backed by returned dasha evidence.

Set `provisional: true` when the domain confidence is low or any cited
evidence is sensitive.

When returned counter-signals exist, include at least one exact returned
counter ID in `counterEvidenceIds` and represent it in the final prose.

## Audit requirements

Run:

```bash
node scripts/audit-reading.mjs --packet CHART.json --plan PLAN.json
```

The audit checks:

- packet and plan versions
- packet digest
- domain coverage
- evidence existence and domain membership
- confidence inflation
- counter-signal coverage
- sensitive-evidence qualification
- dasha support for timing
- unsupported concrete outcomes
- certainty and numerical-probability language

Fix all errors before writing the final response. Warnings call for review but
do not automatically invalidate the plan.

The audit validates a structured plan rather than arbitrary prose. Keep the
final prose faithful to the audited claims and do not introduce new chart
facts afterward.
