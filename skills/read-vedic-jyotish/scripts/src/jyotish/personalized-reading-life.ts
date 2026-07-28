import { houseSignName } from "./math";
import {
  HOUSE_CHANNEL,
  LEARNING_STYLE,
  PLANET_THEME,
  SIGN_STYLE,
  dignityContext,
} from "./reading-vocabulary";
import {
  fingerprint,
  houseActivators,
  houseLord,
  houseSignFact,
  insight,
  lordDignityFact,
  lordPlacementFacts,
  placementKey,
  planetPlacement,
  planetPositionFact,
  type PersonalizedReadingInput,
  type ReadingFields,
} from "./reading-context";
import { practicalTakeaway } from "./synthesis-copy";
import type { DomainSynthesis, JyotishDomain } from "./types";

function familyReading(
  base: DomainSynthesis,
  input: PersonalizedReadingInput,
): ReadingFields {
  const second = houseLord(input, 2);
  const fourth = houseLord(input, 4);
  const moon = planetPlacement(input, "Chandra");
  const activators = houseActivators(input, [2, 4]);

  return {
    quickText: "2nd aur 4th house lords family expectations aur emotional home base ko alag layers mein dikhate hain.",
    text: `2nd lord ${second.lord} H${second.lordHouse} mein hai, isliye family, speech aur shared resources ${HOUSE_CHANNEL[second.lordHouse]} se linked hain. 4th lord ${fourth.lord} H${fourth.lordHouse} mein hone se inner security aur home base ${HOUSE_CHANNEL[fourth.lordHouse]} se shape ho sakte hain.`,
    overviewFacts: [
      ...lordPlacementFacts(second),
      ...lordPlacementFacts(fourth),
    ],
    fingerprint: fingerprint("family", [
      placementKey(second),
      placementKey(fourth),
      placementKey(moon),
    ]),
    insights: [
      insight(
        "Family role",
        `2nd lord ${second.lord} ki traditional dignity ${dignityContext(second.dignity)}. Speech aur financial boundaries family dynamics mein important rahengi.`,
        [
          ...lordPlacementFacts(second),
          lordDignityFact(second),
        ],
      ),
      insight(
        "Emotional home",
        `Chandra ${moon.sign} ke H${moon.house} mein hai, isliye comfort aur care ka link ${HOUSE_CHANNEL[moon.house]} se banta hai.`,
        [planetPositionFact(moon)],
      ),
      insight("Direct activators", activators.text, activators.facts),
    ],
    practicalText: practicalTakeaway("family", base.tone),
    limitations: [],
  };
}

function wellbeingReading(
  base: DomainSynthesis,
  input: PersonalizedReadingInput,
): ReadingFields {
  const first = houseLord(input, 1);
  const sixth = houseLord(input, 6);
  const eighth = houseLord(input, 8);
  const twelfth = houseLord(input, 12);
  const sun = planetPlacement(input, "Surya");

  return {
    quickText: "Lagna lord, 6th lord aur 12th lord routine, workload aur recovery ka combined wellbeing pattern dikhate hain.",
    text: `Lagna lord ${first.lord} H${first.lordHouse} mein vitality ko ${HOUSE_CHANNEL[first.lordHouse]} se jodta hai. 6th lord daily routine, 8th lord recovery aur 12th lord rest ke patterns ko alag layers mein dikhate hain.`,
    overviewFacts: [
      ...lordPlacementFacts(first),
      ...lordPlacementFacts(sixth),
      ...lordPlacementFacts(eighth),
      ...lordPlacementFacts(twelfth),
    ],
    fingerprint: fingerprint("wellbeing", [
      placementKey(first),
      placementKey(sixth),
      placementKey(eighth),
      placementKey(twelfth),
      placementKey(sun),
    ]),
    insights: [
      insight(
        "Energy management",
        `Surya ${sun.sign} ke H${sun.house} mein ${PLANET_THEME.Surya} ko ${HOUSE_CHANNEL[sun.house]} se jodta hai.`,
        [planetPositionFact(sun)],
      ),
      insight(
        "Routine pressure",
        `6th lord ${sixth.lord} ki traditional dignity ${dignityContext(sixth.dignity)}. Workload aur daily habits ko isi hisaab se pace karna useful rahega.`,
        [
          ...lordPlacementFacts(sixth),
          lordDignityFact(sixth),
        ],
      ),
      insight(
        "Recovery pattern",
        `8th lord ${eighth.lord} H${eighth.lordHouse} mein hai. Change, recovery aur difficult phases ko process karne ka context ${HOUSE_CHANNEL[eighth.lordHouse]} se ban sakta hai.`,
        lordPlacementFacts(eighth),
      ),
      insight(
        "Rest aur recovery",
        `12th lord ${twelfth.lord} H${twelfth.lordHouse} mein hai, isliye sleep, rest aur decompression ka link ${HOUSE_CHANNEL[twelfth.lordHouse]} se banta hai.`,
        lordPlacementFacts(twelfth),
      ),
    ],
    practicalText: practicalTakeaway("wellbeing", base.tone),
    limitations: [
      "Yeh medical diagnosis, treatment advice ya lifespan assessment nahi hai. Symptoms ke liye qualified professional se baat karein.",
    ],
  };
}

function educationReading(
  base: DomainSynthesis,
  input: PersonalizedReadingInput,
): ReadingFields {
  const fourth = houseLord(input, 4);
  const fifth = houseLord(input, 5);
  const ninth = houseLord(input, 9);
  const mercury = planetPlacement(input, "Budh");
  const fifthSign = houseSignName(5, input.ascendantLongitude);
  const activators = houseActivators(input, [4, 5, 9]);

  return {
    quickText: "Budh aur 4th, 5th, 9th lords learning style, skill practice aur higher study ko separate layers mein dikhate hain.",
    text: `5th house ka ${fifthSign} sign learning mein ${LEARNING_STYLE[fifthSign]} ko support karta hai. 9th lord ${ninth.lord} H${ninth.lordHouse} mein hone se higher study, mentors aur worldview ${HOUSE_CHANNEL[ninth.lordHouse]} se develop ho sakte hain.`,
    overviewFacts: [
      houseSignFact(5, fifthSign),
      ...lordPlacementFacts(ninth),
    ],
    fingerprint: fingerprint("education", [
      placementKey(fourth),
      placementKey(fifth),
      placementKey(ninth),
      placementKey(mercury),
    ]),
    insights: [
      insight(
        "Foundation",
        `4th lord ${fourth.lord} H${fourth.lordHouse} mein hai, isliye foundational education aur study environment ${HOUSE_CHANNEL[fourth.lordHouse]} se linked hain.`,
        lordPlacementFacts(fourth),
      ),
      insight(
        "Skills aur communication",
        `Budh ${mercury.sign} ke H${mercury.house} mein ${PLANET_THEME.Budh} ko ${HOUSE_CHANNEL[mercury.house]} se jodta hai.`,
        [planetPositionFact(mercury)],
      ),
      insight("Direct activators", activators.text, activators.facts),
    ],
    practicalText: practicalTakeaway("education", base.tone),
    limitations: [
      "Exact degree, admission result ya academic rank predict nahi ki jaati.",
    ],
  };
}

function propertyReading(
  base: DomainSynthesis,
  input: PersonalizedReadingInput,
): ReadingFields {
  const fourth = houseLord(input, 4);
  const fourthSign = houseSignName(4, input.ascendantLongitude);
  const mars = planetPlacement(input, "Mangal");
  const venus = planetPlacement(input, "Shukra");
  const activators = houseActivators(input, [4]);

  return {
    quickText: `4th lord ${fourth.lord} H${fourth.lordHouse} mein residence aur property decisions ko ${HOUSE_CHANNEL[fourth.lordHouse]} se jodta hai.`,
    text: `4th house ${fourthSign} mein hai, isliye residence aur emotional security mein ${SIGN_STYLE[fourthSign]} important ho sakta hai. 4th lord ${fourth.lord} H${fourth.lordHouse} mein hone se property, home base aur vehicles ka attention ${HOUSE_CHANNEL[fourth.lordHouse]} se linked ho sakta hai.`,
    overviewFacts: [
      houseSignFact(4, fourthSign),
      ...lordPlacementFacts(fourth),
    ],
    fingerprint: fingerprint("property", [
      fourthSign,
      placementKey(fourth),
      placementKey(mars),
      placementKey(venus),
    ]),
    insights: [
      insight(
        "Decision style",
        `Mangal ${mars.sign} ke H${mars.house} mein action aur land-related initiative ko ${HOUSE_CHANNEL[mars.house]} se jodta hai.`,
        [planetPositionFact(mars)],
      ),
      insight(
        "Comfort aur vehicles",
        `Shukra ${venus.sign} ke H${venus.house} mein comfort, aesthetics aur quality decisions ko ${HOUSE_CHANNEL[venus.house]} se connect karta hai.`,
        [planetPositionFact(venus)],
      ),
      insight("Direct activators", activators.text, activators.facts),
    ],
    practicalText: practicalTakeaway("property", base.tone),
    limitations: [
      "Purchase date, inheritance ya ownership guarantee nahi ki jaati. Legal aur financial checks separately karein.",
    ],
  };
}

function travelReading(
  base: DomainSynthesis,
  input: PersonalizedReadingInput,
): ReadingFields {
  const third = houseLord(input, 3);
  const ninth = houseLord(input, 9);
  const twelfth = houseLord(input, 12);
  const rahu = planetPlacement(input, "Rahu");
  const hasLordLink =
    ninth.lordHouse === 12 || twelfth.lordHouse === 9;
  const hasRahuLink = [9, 12].includes(rahu.house);
  const foreignSignals =
    Number(hasLordLink) + Number(hasRahuLink);
  const foreignTone =
    foreignSignals >= 2
      ? "multiple Rashi-level indicators foreign exposure ko support karte hain; permanent settlement phir bhi establish nahi hota"
      : foreignSignals === 1
        ? "ek Rashi-level indicator foreign exposure ko support karta hai; settlement automatic nahi"
        : "is limited Rashi rule set mein strong relocation emphasis establish nahi hota";

  return {
    quickText: "3rd, 9th aur 12th lords short travel, long journeys aur foreign residence ko alag patterns mein dikhate hain.",
    text: `3rd lord ${third.lord} H${third.lordHouse} mein local movement ko ${HOUSE_CHANNEL[third.lordHouse]} se jodta hai. 9th lord ${ninth.lord} H${ninth.lordHouse} aur 12th lord ${twelfth.lord} H${twelfth.lordHouse} mein hone se ${foreignTone}.`,
    overviewFacts: [
      ...lordPlacementFacts(third),
      ...lordPlacementFacts(ninth),
      ...lordPlacementFacts(twelfth),
      planetPositionFact(rahu),
    ],
    fingerprint: fingerprint("travel", [
      placementKey(third),
      placementKey(ninth),
      placementKey(twelfth),
      placementKey(rahu),
      foreignSignals,
    ]),
    insights: [
      insight(
        "Short movement",
        `3rd lord H${third.lordHouse} mein hai, isliye frequent movement, communication ya nearby travel ${HOUSE_CHANNEL[third.lordHouse]} se linked ho sakte hain.`,
        lordPlacementFacts(third),
      ),
      insight(
        "Long journeys",
        `9th lord ${ninth.lord} H${ninth.lordHouse} mein higher learning aur long-distance travel ko ${HOUSE_CHANNEL[ninth.lordHouse]} se connect karta hai.`,
        lordPlacementFacts(ninth),
      ),
      insight(
        "Foreign environment",
        `12th lord ${twelfth.lord} H${twelfth.lordHouse} mein hai aur Rahu ${rahu.sign} ke H${rahu.house} mein hai. Dono ko saath dekhne par ${foreignTone}.`,
        [
          ...lordPlacementFacts(ninth),
          ...lordPlacementFacts(twelfth),
          planetPositionFact(rahu),
        ],
      ),
    ],
    practicalText: practicalTakeaway("travel", base.tone),
    limitations: [
      "Foreign settlement, visa approval ya specific country guarantee nahi ki jaati.",
    ],
  };
}

export const LIFE_READING_BUILDERS: Partial<
  Record<
    JyotishDomain,
    (base: DomainSynthesis, input: PersonalizedReadingInput) => ReadingFields
  >
> = {
  family: familyReading,
  wellbeing: wellbeingReading,
  education: educationReading,
  property: propertyReading,
  travel: travelReading,
};
