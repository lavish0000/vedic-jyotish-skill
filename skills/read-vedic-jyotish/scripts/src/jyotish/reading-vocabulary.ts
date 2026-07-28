import type {
  ClassicalPlanetName,
  Dignity,
  SignName,
} from "./types";

export const SIGN_STYLE: Record<SignName, string> = {
  Mesh: "fast action, independence aur direct response",
  Vrishabha: "stability, patience aur practical security",
  Mithuna: "curiosity, communication aur multiple options",
  Karka: "care, emotional safety aur close attachment",
  Simha: "self-expression, pride aur visible ownership",
  Kanya: "detail, usefulness aur continuous improvement",
  Tula: "balance, fairness aur mutual consideration",
  Vrishchika: "depth, privacy aur strong trust boundaries",
  Dhanu: "learning, freedom aur larger purpose",
  Makara: "structure, responsibility aur long-term effort",
  Kumbha: "independence, networks aur unconventional thinking",
  Meena: "empathy, imagination aur intuitive response",
};

export const PARTNER_STYLE: Record<SignName, string> = {
  Mesh: "independent, decisive aur straightforward",
  Vrishabha: "steady, comfort-conscious aur dependable",
  Mithuna: "talkative, curious aur mentally active",
  Karka: "caring, family-aware aur emotionally responsive",
  Simha: "expressive, proud aur recognition-conscious",
  Kanya: "practical, observant aur improvement-oriented",
  Tula: "social, diplomatic aur fairness-conscious",
  Vrishchika: "private, intense aur loyalty-conscious",
  Dhanu: "open-minded, freedom-loving aur learning-oriented",
  Makara: "responsible, composed aur long-term focused",
  Kumbha: "independent, idea-led aur socially aware",
  Meena: "sensitive, imaginative aur compassionate",
};

export const PARENTING_STYLE: Record<SignName, string> = {
  Mesh: "initiative aur independence encourage karne wala",
  Vrishabha: "routine, patience aur practical support dene wala",
  Mithuna: "questions, conversation aur variety ko encourage karne wala",
  Karka: "protective, emotionally present aur family-centred",
  Simha: "confidence, creativity aur visibility encourage karne wala",
  Kanya: "skills, routine aur careful guidance par focused",
  Tula: "fairness, manners aur cooperation ko value karne wala",
  Vrishchika: "protective, deeply involved aur trust-conscious",
  Dhanu: "exploration, learning aur independence encourage karne wala",
  Makara: "discipline, responsibility aur long-term progress par focused",
  Kumbha: "individuality, ideas aur social awareness encourage karne wala",
  Meena: "empathetic, imaginative aur emotionally receptive",
};

export const LEARNING_STYLE: Record<SignName, string> = {
  Mesh: "short experiments aur hands-on challenge",
  Vrishabha: "steady repetition aur practical examples",
  Mithuna: "discussion, comparison aur varied material",
  Karka: "safe environment aur emotionally meaningful examples",
  Simha: "presentation, creation aur visible ownership",
  Kanya: "structured notes, detail aur repeated correction",
  Tula: "dialogue, examples aur balanced viewpoints",
  Vrishchika: "deep research aur difficult subjects",
  Dhanu: "big-picture frameworks aur real-world exploration",
  Makara: "clear syllabus, milestones aur disciplined practice",
  Kumbha: "systems, communities aur unconventional sources",
  Meena: "visual material, stories aur intuitive association",
};

export const HOUSE_CHANNEL: Record<number, string> = {
  1: "self-development, personal decisions aur direct initiative",
  2: "family, speech, savings aur accumulated resources",
  3: "communication, local movement, siblings aur self-effort",
  4: "home, education, property aur emotional foundation",
  5: "study, creativity, children aur mentoring",
  6: "daily work, service, routines aur practical problem-solving",
  7: "partnerships, clients aur one-to-one connections",
  8: "shared resources, research, privacy aur major transitions",
  9: "higher learning, mentors, belief systems aur long journeys",
  10: "career, public responsibility aur visible contribution",
  11: "income, networks, teams aur long-term goals",
  12: "foreign environments, rest, expenses aur work behind the scenes",
};

export const PLANET_THEME: Record<ClassicalPlanetName, string> = {
  Surya: "ownership, confidence aur visibility",
  Chandra: "emotional response, care aur daily comfort",
  Budh: "analysis, language aur adaptability",
  Shukra: "attraction, cooperation aur quality of life",
  Mangal: "initiative, competition aur decisive action",
  Guru: "guidance, growth aur long-term judgement",
  Shani: "discipline, delay tolerance aur responsibility",
};

export function dignityContext(dignity: Dignity) {
  if (dignity === "exalted") {
    return "uccha mani gayi hai aur clear expression ko support karti hai";
  }
  if (dignity === "own") {
    return "apne sign mein hai aur stable expression ko support karti hai";
  }
  if (dignity === "debilitated") {
    return "neecha mani gayi hai, isliye extra practice aur realistic pacing maang sakti hai";
  }
  return "neutral mani gayi hai; outcome ko placement aur connections ke saath dekhna chahiye";
}
