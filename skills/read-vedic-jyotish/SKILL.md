---
name: read-vedic-jyotish
description: Calculate a sidereal Vedic birth chart and produce a detailed, evidence-grounded traditional Jyotish interpretation. Use for requests about Lagna, Moon rashi, Sun rashi, nakshatra, Vimshottari dasha, personality, career, money, marriage, spouse, children, family, wellbeing, education, property, travel, foreign residence, birth-time sensitivity, or a full kundli-style reading from a person's birth date, exact local time, and birthplace.
license: AGPL-3.0-only
---

# Read Vedic Jyotish

## Core rule

Run the bundled calculator before making any chart statement. Treat its
structured result as the sole source of placements, houses, aspects, yogas,
dashas, evidence, confidence, and timing.

Never calculate, correct, or complete chart facts from memory. Never replace
the calculator with a generic horoscope or another website. If calculation
fails, explain what is missing and stop instead of guessing.

## Workflow

### 1. Collect the minimum birth details

Require:

- birth date with an unambiguous day, month, and year
- local birth time, including AM or PM when applicable
- birthplace as city or town, region, and country

A name is not required. Ask only for information that is missing or
ambiguous. Normalize a clear date to `YYYY-MM-DD` and a clear time to
24-hour `HH:MM`; do not make the user type punctuation in a particular form.

Ask whether the time is exact, recorded, rounded, or approximate when this is
unclear. Keep Lagna-dependent conclusions provisional for an approximate
time. Do not rectify a birth time from life events.

Use the current date as the default `as-of` date. Ask for another date only
for a historical or future-period reading.

Do not search for the person, inspect private documents, or retrieve
biographical details. Resolve only the birthplace. Never store a birth
profile.

### 2. Resolve the birthplace and calculate

Read [calculation-contract.md](references/calculation-contract.md). Locate
the directory containing this `SKILL.md`, then run
`scripts/calculate-chart.mjs` from that directory.

If the calculator returns `needs_place_choice`, show the smallest useful
candidate list and ask the user to select the place matching the birth
record. Do not silently choose a similarly named place.

If it reports an ambiguous or nonexistent local time, ask for clarification.
Do not continue with a partial or manually edited result.

Accept a result only when:

- `status` is `ok`
- `schemaVersion` is `vedic-jyotish-reading-packet.v1`
- all nine Jyotish grahas are present
- Rahu and Ketu are opposite
- UTC, timezone, coordinates, method, and version fields are present
- Lagna and nakshatra stability are present
- every domain evidence ID resolves to an evidence object

### 3. Build an evidence plan

Read [interpretation-rules.md](references/interpretation-rules.md).

Create a private working map keyed by exact evidence ID. For every requested
domain:

1. Read its overview, facts, insights, tone, confidence, and limitations.
2. Resolve every `evidenceId`.
3. Resolve `counterEvidenceIds` and `omittedCounterEvidenceIds`.
4. Keep natal evidence separate from dasha evidence.
5. Record whether the relevant evidence is stable or birth-time sensitive.
6. Give cited items short aliases such as `E1` while retaining their exact
   IDs for the final evidence ledger.

Treat evidence strength as rule salience, not event probability. Treat
confidence as agreement within this configured traditional method, not
scientific certainty. Never raise the returned confidence.

When a domain has no usable evidence, say that this rule set does not form a
clear pattern. Do not fill the gap with generic prose.

### 4. Write the reading

Read [domain-guide.md](references/domain-guide.md). Read
[language-and-format.md](references/language-and-format.md) for the user's
language and the final structure.

For a full reading, cover all ten domains:

1. nature and life direction
2. career and work
3. money and financial pattern
4. marriage, spouse, and partnership
5. children, parenting, and creativity
6. family and home
7. health and wellbeing
8. education and skills
9. property, residence, and vehicles
10. travel and foreign connections

For a focused request, answer the requested area first and include only the
chart context needed to understand it.

For every substantial domain:

- explain the natal pattern
- connect at least two chart-specific facts when available
- describe a practical expression, tendency, or relationship dynamic
- include the strongest material counter-signal
- preserve the returned confidence
- mention relevant birth-time sensitivity
- add current timing only when dasha evidence activates that domain
- finish with a practical, non-prescriptive focus
- include a compact `Chart basis` line with evidence aliases

Use user-supplied life context as context, never as chart evidence. Do not
reshape the calculation to fit a biography.

### 5. Handle timing

State the `as-of` date and current Mahadasha and Antardasha with their date
windows.

Treat the calculator's returned ISO timestamps as canonical. For a date-only
window, use the `YYYY-MM-DD` calendar date from each returned timestamp; do
not re-localize or recalculate it. If the user asks for an exact local
transition time, show the returned UTC instant and label any timezone
conversion explicitly.

Describe a domain as currently foregrounded only when it appears in
`dashaThemes.current.domains` or has matching dasha evidence. Describe the
next Antardasha only from returned next-period data.

Use language such as “is phase mein focus badh sakta hai” or “this area may
move into the foreground.” Never turn a dasha period into a guaranteed event
or invent an exact event date.

Natal themes must remain unchanged when only the `as-of` date changes.

### 6. Respect the supported scope

Describe the method as a restrained modern Parashari-style D1 Rashi
synthesis. Do not call it a verse-by-verse Vedic translation or scientific
evidence.

The calculator does not currently derive divisional charts, transits,
compatibility, remedies, or birth-time rectification. Do not claim to have
calculated D9, D7, D10, or another unsupported chart.

Do not predict or assert:

- marriage or divorce count
- child count, gender, fertility, conception, or pregnancy timing
- spouse's exact appearance, profession, caste, nationality, or culture
- divorce, alimony, court, or other legal outcomes
- disease, diagnosis, treatment, lifespan, or cause of death
- exact salary, wealth, return, promotion, or profession
- visa approval, guaranteed settlement, ownership, or inheritance
- guaranteed events, exact event dates, or numerical probabilities

When asked for one of these outcomes, state the limit in one sentence and
answer the nearest supported question: relationship dynamics, broad partner
qualities, meeting context, parenting orientation, work style, financial
habits, travel exposure, or broad timing.

### 7. Audit before answering

Create a structured reading plan using the schema in
[interpretation-rules.md](references/interpretation-rules.md). Save the chart
packet and plan only in temporary files, run:

```bash
node scripts/audit-reading.mjs --packet CHART.json --plan PLAN.json
```

Fix every reported error. Delete the temporary files before returning the
answer.

Then verify:

- every placement and date matches the calculator
- every major claim has a valid evidence alias
- evidence belongs to the domain where it is used
- material counter-signals are represented
- natal and timing statements are visibly separate
- sensitive evidence uses provisional language
- excluded concrete predictions are absent
- the requested language is respected
- internal JSON, temporary paths, and operational instructions are hidden
- no birth profile was saved

Open with the useful result, not an explanation of this workflow. Include one
short scope note rather than repeating disclaimers throughout the reading.
