# ADR 0001: Bundle the calculation runtime with the skill

## Status

Accepted

## Context

Birth date, exact time, and location are personal data. A remote calculation
endpoint would simplify runtime setup but would transmit that data to another
service and introduce hosting availability and cost.

The existing chart engine already runs through a small WebAssembly runtime and
has reference-vector coverage. Agent skills may include executable resources.

## Decision

Ship a bundled JavaScript calculator and WebAssembly file inside the skill.
Run it locally with Node.js and return structured JSON to the host model.
Keep source files and reproducible build inputs in this repository.

Use online geocoding only when coordinates and an IANA timezone are not
already available. Require place confirmation when search results are
ambiguous.

## Consequences

- Chart calculation does not need a project-owned server.
- Recipients need Node.js 20 or newer and must approve local execution.
- Skill updates carry calculation and rule updates together.
- A remote fallback can be added later without changing the evidence schema.
- The repository uses AGPL-3.0 because the astronomical dependency uses that
  license.
