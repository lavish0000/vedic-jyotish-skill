import { houseSignName, signNameOf } from "./math";
import {
  HOUSE_CHANNEL,
  PARENTING_STYLE,
  PARTNER_STYLE,
  PLANET_THEME,
  SIGN_STYLE,
  dignityContext,
} from "./reading-vocabulary";
import {
  ascendantFact,
  fingerprint,
  houseActivators,
  houseLord,
  houseSignFact,
  insight,
  lordDignityFact,
  lordPlacementFacts,
  placementKey,
  planetDignityFact,
  planetPlacement,
  planetPositionFact,
  type PersonalizedReadingInput,
  type ReadingFields,
} from "./reading-context";
import { practicalTakeaway } from "./synthesis-copy";
import type { DomainSynthesis, JyotishDomain } from "./types";

function selfReading(
  base: DomainSynthesis,
  input: PersonalizedReadingInput,
): ReadingFields {
  const lagnaSign = signNameOf(input.ascendantLongitude);
  const lagnaLord = houseLord(input, 1);
  const moon = planetPlacement(input, "Chandra");
  const activators = houseActivators(input, [1, 3, 8]);

  return {
    quickText: `${lagnaSign} Lagna ke saath life direction ${HOUSE_CHANNEL[lagnaLord.lordHouse]} se strongly linked dikh rahi hai.`,
    text: `${lagnaSign} Lagna aapki visible approach mein ${SIGN_STYLE[lagnaSign]} ko foreground karta hai. Lagna lord ${lagnaLord.lord} ${lagnaLord.lordSign} ke H${lagnaLord.lordHouse} mein hai, isliye identity aur major decisions ka connection ${HOUSE_CHANNEL[lagnaLord.lordHouse]} se ban sakta hai.`,
    overviewFacts: [
      ascendantFact(lagnaSign),
      ...lordPlacementFacts(lagnaLord),
    ],
    fingerprint: fingerprint("self", [
      lagnaSign,
      placementKey(lagnaLord),
      placementKey(moon),
    ]),
    insights: [
      insight(
        "Inner response",
        `Chandra ${moon.sign} ke H${moon.house} mein hai. Emotions aur visible style ${moon.sign === lagnaSign ? "relatively aligned" : "alag pace par"} kaam kar sakte hain.`,
        [
          ascendantFact(lagnaSign),
          planetPositionFact(moon),
        ],
      ),
      insight(
        "Core capacity",
        `${lagnaLord.lord} ki traditional dignity ${dignityContext(lagnaLord.dignity)}.`,
        [
          ...lordPlacementFacts(lagnaLord),
          lordDignityFact(lagnaLord),
        ],
      ),
      insight("Repeated pattern", activators.text, activators.facts),
    ],
    practicalText: practicalTakeaway("self", base.tone),
    limitations: [],
  };
}

function careerReading(
  base: DomainSynthesis,
  input: PersonalizedReadingInput,
): ReadingFields {
  const tenth = houseLord(input, 10);
  const sixth = houseLord(input, 6);
  const saturn = planetPlacement(input, "Shani");
  const tenthSign = houseSignName(10, input.ascendantLongitude);
  const activators = houseActivators(input, [6, 10]);

  return {
    quickText: `10th lord ${tenth.lord} H${tenth.lordHouse} mein hai, isliye career route ${HOUSE_CHANNEL[tenth.lordHouse]} se grow kar sakta hai.`,
    text: `10th house ka ${tenthSign} sign work mein ${SIGN_STYLE[tenthSign]} ko value karta hai. Iska lord ${tenth.lord} H${tenth.lordHouse} mein hai, isliye career ki visible direction ${HOUSE_CHANNEL[tenth.lordHouse]} se jud sakti hai.`,
    overviewFacts: [
      houseSignFact(10, tenthSign),
      ...lordPlacementFacts(tenth),
    ],
    fingerprint: fingerprint("career", [
      placementKey(tenth),
      placementKey(sixth),
      placementKey(saturn),
    ]),
    insights: [
      insight(
        "Daily work pattern",
        `6th lord ${sixth.lord} H${sixth.lordHouse} mein hai. Routine work, service aur problem-solving ka link ${HOUSE_CHANNEL[sixth.lordHouse]} se banta hai.`,
        lordPlacementFacts(sixth),
      ),
      insight(
        "Responsibility style",
        `Shani ${saturn.sign} ke H${saturn.house} mein ${PLANET_THEME.Shani} ko career decisions ke saath jodta hai.`,
        [planetPositionFact(saturn)],
      ),
      insight("Direct activators", activators.text, activators.facts),
    ],
    practicalText: practicalTakeaway("career", base.tone),
    limitations: [
      "Exact profession, promotion date ya salary Rashi chart se guarantee nahi ki jaati.",
    ],
  };
}

function moneyReading(
  base: DomainSynthesis,
  input: PersonalizedReadingInput,
): ReadingFields {
  const second = houseLord(input, 2);
  const eleventh = houseLord(input, 11);
  const jupiter = planetPlacement(input, "Guru");
  const activators = houseActivators(input, [2, 11]);

  return {
    quickText: "Savings ke 2nd lord aur gains ke 11th lord aapke money pattern ko do alag channels se shape karte hain.",
    text: `2nd lord ${second.lord} H${second.lordHouse} mein hai, jo savings aur family resources ko ${HOUSE_CHANNEL[second.lordHouse]} se jodta hai. 11th lord ${eleventh.lord} H${eleventh.lordHouse} mein hone se income aur gains ka route ${HOUSE_CHANNEL[eleventh.lordHouse]} ki taraf ja sakta hai.`,
    overviewFacts: [
      ...lordPlacementFacts(second),
      ...lordPlacementFacts(eleventh),
    ],
    fingerprint: fingerprint("money", [
      placementKey(second),
      placementKey(eleventh),
      placementKey(jupiter),
    ]),
    insights: [
      insight(
        "Savings pattern",
        `${second.lord} ki traditional dignity ${dignityContext(second.dignity)}. Saving decisions mein isi capacity ka disciplined use important rahega.`,
        [
          ...lordPlacementFacts(second),
          lordDignityFact(second),
        ],
      ),
      insight(
        "Financial judgement",
        `Guru ${jupiter.sign} ke H${jupiter.house} mein hai. Long-term judgement aur expansion ko ${HOUSE_CHANNEL[jupiter.house]} ke context mein test karna better rahega.`,
        [planetPositionFact(jupiter)],
      ),
      insight("Direct activators", activators.text, activators.facts),
    ],
    practicalText: practicalTakeaway("money", base.tone),
    limitations: [
      "Income amount, investment return ya guaranteed wealth predict nahi ki jaati.",
    ],
  };
}

function relationshipReading(
  base: DomainSynthesis,
  input: PersonalizedReadingInput,
): ReadingFields {
  const seventh = houseLord(input, 7);
  const seventhSign = houseSignName(7, input.ascendantLongitude);
  const venus = planetPlacement(input, "Shukra");
  const moon = planetPlacement(input, "Chandra");
  const activators = houseActivators(input, [7]);

  return {
    quickText: `${seventhSign} 7th house aur ${seventh.lord} ki H${seventh.lordHouse} placement partnership ka main pattern banate hain.`,
    text: `7th house ${seventhSign} mein hai, isliye traditional spouse symbolism ${PARTNER_STYLE[seventhSign]} qualities ko prefer kar sakta hai. 7th lord ${seventh.lord} H${seventh.lordHouse} mein hai, jo committed partnership ko ${HOUSE_CHANNEL[seventh.lordHouse]} se connect karta hai.`,
    overviewFacts: [
      houseSignFact(7, seventhSign),
      ...lordPlacementFacts(seventh),
    ],
    fingerprint: fingerprint("relationships", [
      seventhSign,
      placementKey(seventh),
      placementKey(venus),
      placementKey(moon),
    ]),
    insights: [
      insight(
        "Meeting context",
        `7th lord H${seventh.lordHouse} mein hone se meeting ya relationship development ${HOUSE_CHANNEL[seventh.lordHouse]} ke environment se linked ho sakta hai.`,
        lordPlacementFacts(seventh),
      ),
      insight(
        "Attraction aur bonding",
        `Shukra ${venus.sign} ke H${venus.house} mein hai. Attraction, cooperation aur shared comfort ka link ${HOUSE_CHANNEL[venus.house]} se ban sakta hai.`,
        [planetPositionFact(venus)],
      ),
      insight(
        "Emotional rhythm",
        `Chandra ${moon.sign} ke H${moon.house} mein hai. Partnership mein emotional safety aur response ka context ${HOUSE_CHANNEL[moon.house]} se ban sakta hai.`,
        [planetPositionFact(moon)],
      ),
      insight("Relationship activators", activators.text, activators.facts),
    ],
    practicalText: practicalTakeaway("relationships", base.tone),
    limitations: [
      "Yeh Rashi-level reading hai. Exact appearance, profession, culture, marriage count, divorce ya legal outcome assess nahi kiya gaya.",
    ],
  };
}

function childrenReading(
  base: DomainSynthesis,
  input: PersonalizedReadingInput,
): ReadingFields {
  const fifth = houseLord(input, 5);
  const fifthSign = houseSignName(5, input.ascendantLongitude);
  const jupiter = planetPlacement(input, "Guru");
  const moon = planetPlacement(input, "Chandra");
  const activators = houseActivators(input, [5]);

  return {
    quickText: `5th house ka ${fifthSign} sign aur 5th lord ${fifth.lord} children, mentoring aur creativity ka base pattern dikhate hain.`,
    text: `5th house ${fifthSign} mein hai, isliye parenting, mentoring ya creative responsibility mein ${PARENTING_STYLE[fifthSign]} approach aa sakta hai. 5th lord ${fifth.lord} H${fifth.lordHouse} mein hai, jo is area ko ${HOUSE_CHANNEL[fifth.lordHouse]} se connect karta hai.`,
    overviewFacts: [
      houseSignFact(5, fifthSign),
      ...lordPlacementFacts(fifth),
    ],
    fingerprint: fingerprint("children", [
      fifthSign,
      placementKey(fifth),
      placementKey(jupiter),
      placementKey(moon),
    ]),
    insights: [
      insight(
        "Emotional care",
        `Chandra ${moon.sign} ke H${moon.house} mein hai. Care aur emotional availability ka context ${HOUSE_CHANNEL[moon.house]} se ban sakta hai.`,
        [planetPositionFact(moon)],
      ),
      insight(
        "Guidance capacity",
        `Guru ${jupiter.sign} ke H${jupiter.house} mein ${PLANET_THEME.Guru} ko ${HOUSE_CHANNEL[jupiter.house]} se jodta hai. Iski traditional dignity ${dignityContext(jupiter.dignity)}.`,
        [
          planetPositionFact(jupiter),
          planetDignityFact(jupiter),
        ],
      ),
      insight("Direct activators", activators.text, activators.facts),
    ],
    practicalText: practicalTakeaway("children", base.tone),
    limitations: [
      "Exact child count, gender, fertility status ya pregnancy timing is Rashi-only report se assess nahi ki jaati.",
    ],
  };
}

export const CORE_READING_BUILDERS: Partial<
  Record<
    JyotishDomain,
    (base: DomainSynthesis, input: PersonalizedReadingInput) => ReadingFields
  >
> = {
  self: selfReading,
  career: careerReading,
  money: moneyReading,
  relationships: relationshipReading,
  children: childrenReading,
};
