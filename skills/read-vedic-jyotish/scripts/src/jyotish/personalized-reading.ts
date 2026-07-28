import { CORE_READING_BUILDERS } from "./personalized-reading-core";
import { LIFE_READING_BUILDERS } from "./personalized-reading-life";
import type {
  PersonalizedReadingInput,
  ReadingFields,
} from "./reading-context";
import type {
  DomainSynthesis,
  JyotishDomain,
} from "./types";

const BUILDERS = {
  ...CORE_READING_BUILDERS,
  ...LIFE_READING_BUILDERS,
} as Record<
  JyotishDomain,
  (base: DomainSynthesis, input: PersonalizedReadingInput) => ReadingFields
>;

export function personalizeDomain(
  base: DomainSynthesis,
  input: PersonalizedReadingInput,
): DomainSynthesis {
  const builder = BUILDERS[base.domain];
  if (!builder) {
    throw new Error(`Missing personalized reading builder: ${base.domain}.`);
  }

  return {
    ...base,
    ...builder(base, input),
  };
}
