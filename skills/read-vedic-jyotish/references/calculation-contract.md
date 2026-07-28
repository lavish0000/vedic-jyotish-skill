# Calculation contract

## Contents

1. Runtime
2. Required input
3. Place resolution
4. Commands
5. Accepted output
6. Method and boundaries
7. Error handling
8. Privacy

## Runtime

Use Node.js 20 or newer. Check `node --version` before the first calculation.
If Node is unavailable, ask permission to install it through the operating
system's normal package manager. Do not substitute mental calculation.

Run the bundled `scripts/calculate-chart.mjs`; it contains its astronomical
dependencies and does not need `npm install`.

## Required input

Normalize:

- `date`: Gregorian local birth date as `YYYY-MM-DD`
- `time`: local civil time as `HH:MM` or `HH:MM:SS`
- `as-of`: optional ISO date; default to the current date

Use either:

- a settlement query, or
- a verified label, latitude, longitude, and IANA timezone

Do not pass a person's name, biography, relationship history, job history, or
other personal context to the calculator.

## Place resolution

Search by settlement, region, and country. Hospital names and street
addresses may not be present in the settlement index; when they fail, search
the city or town containing the institution.

If more than one place is returned, ask the user to choose. Show labels, not
raw JSON. Rerun with the selected numeric candidate ID.

The place lookup uses Open-Meteo Geocoding. Only the place query is sent to
that provider; birth date and time remain local.

If the user supplies coordinates, also require an IANA timezone such as
`Asia/Kolkata`. Never derive a historical UTC offset from longitude alone.

## Commands

Run from the directory containing `SKILL.md`.

Search for a place:

```bash
node scripts/calculate-chart.mjs \
  --date 2000-01-15 \
  --time 12:00 \
  --place-query "London, United Kingdom" \
  --as-of 2026-07-28
```

Select a candidate:

```bash
node scripts/calculate-chart.mjs \
  --date 2000-01-15 \
  --time 12:00 \
  --place-query "London, United Kingdom" \
  --place-choice 2643743 \
  --as-of 2026-07-28
```

Use verified coordinates:

```bash
node scripts/calculate-chart.mjs \
  --date 2000-01-15 \
  --time 12:00 \
  --place-label "London, United Kingdom" \
  --latitude 51.5074 \
  --longitude -0.1278 \
  --timezone Europe/London \
  --as-of 2026-07-28
```

Add `--pretty` only for debugging. Compact JSON uses less context.

Quote every user-derived string passed to the shell. Do not construct command
names or option names from user input.

## Accepted output

The calculator returns one of:

- `ok`: complete chart and reading evidence
- `needs_place_choice`: candidate list requiring user confirmation
- `invalid_input`: missing or invalid date, time, place, or timezone
- `calculation_failed`: no chart should be interpreted

For `ok`, require:

- `schemaVersion`: `vedic-jyotish-reading-packet.v1`
- `calculationVersion`
- `ruleSetVersion`: `jyotish-core-2.0`
- method fields
- normalized local and UTC input
- nine graha placements
- Lagna, Sun rashi, Moon rashi, nakshatra, and stability
- house lords, dignities, conjunctions, aspects, selected yogas
- current and next Vimshottari periods
- evidence and ten domain syntheses
- SHA-256 packet digest

Dates inside dasha and evidence objects serialize as ISO timestamps.

## Method and boundaries

The configured method is:

- sidereal zodiac
- Lahiri ayanamsha
- whole-sign houses
- mean Rahu; Ketu exactly opposite
- Swiss Ephemeris 2.10.03 using built-in Moshier data
- classical graha aspects encoded by the rule engine
- selected named yoga rules encoded by the rule engine
- Vimshottari dasha using a 365.25-day year
- IANA historical timezone conversion
- five-minute Lagna and Moon boundary sensitivity sampling

`suryaRashi` is the Lahiri sidereal Sun sign. It is not the Western tropical
Sun sign.

This is a D1 Rashi analysis. It does not calculate divisional charts,
transits, compatibility, rectification, or remedies.

## Error handling

- Missing time: ask for the local time and AM/PM if needed.
- Rounded or approximate time: calculate only after acknowledging that
  Lagna-dependent results may be provisional.
- Nonexistent DST time: ask for a corrected birth-record time.
- Ambiguous DST time: ask for the recorded offset or another authoritative
  clarification.
- Ambiguous place: ask the user to select a candidate.
- Future birth date or unsupported year: explain the input error.
- Unknown schema or rule version: stop rather than guessing.
- Missing graha or unresolved evidence ID: reject the packet.

## Privacy

Keep chart packets and reading plans in temporary files only when the audit
step requires them. Delete those files after producing the answer.

Do not create profiles, histories, caches, notes, or repositories containing
birth details. Never commit a chart packet. The host conversation provider
may apply its own retention policy; do not claim otherwise.
