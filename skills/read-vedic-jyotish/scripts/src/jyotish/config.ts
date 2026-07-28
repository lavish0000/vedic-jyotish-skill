import type {
  ClassicalPlanetName,
  DashaLord,
  JyotishDomain,
  JyotishPlanetName,
  SignName,
} from "./types";

export const RULE_SET_VERSION = "jyotish-core-2.0";
export const VIMSHOTTARI_YEAR_DAYS = 365.25 as const;

export const SIGN_NAMES: readonly SignName[] = [
  "Mesh",
  "Vrishabha",
  "Mithuna",
  "Karka",
  "Simha",
  "Kanya",
  "Tula",
  "Vrishchika",
  "Dhanu",
  "Makara",
  "Kumbha",
  "Meena",
];

export const CLASSICAL_PLANETS: readonly ClassicalPlanetName[] = [
  "Surya",
  "Chandra",
  "Budh",
  "Shukra",
  "Mangal",
  "Guru",
  "Shani",
];

export const PLANET_ORDER: readonly JyotishPlanetName[] = [
  ...CLASSICAL_PLANETS,
  "Rahu",
  "Ketu",
];

export const SIGN_LORDS: Record<SignName, ClassicalPlanetName> = {
  Mesh: "Mangal",
  Vrishabha: "Shukra",
  Mithuna: "Budh",
  Karka: "Chandra",
  Simha: "Surya",
  Kanya: "Budh",
  Tula: "Shukra",
  Vrishchika: "Mangal",
  Dhanu: "Guru",
  Makara: "Shani",
  Kumbha: "Shani",
  Meena: "Guru",
};

export const OWN_SIGNS: Record<ClassicalPlanetName, readonly SignName[]> = {
  Surya: ["Simha"],
  Chandra: ["Karka"],
  Budh: ["Mithuna", "Kanya"],
  Shukra: ["Vrishabha", "Tula"],
  Mangal: ["Mesh", "Vrishchika"],
  Guru: ["Dhanu", "Meena"],
  Shani: ["Makara", "Kumbha"],
};

export const EXALTATION_SIGNS: Record<ClassicalPlanetName, SignName> = {
  Surya: "Mesh",
  Chandra: "Vrishabha",
  Budh: "Kanya",
  Shukra: "Meena",
  Mangal: "Makara",
  Guru: "Karka",
  Shani: "Tula",
};

export const DEBILITATION_SIGNS: Record<ClassicalPlanetName, SignName> = {
  Surya: "Tula",
  Chandra: "Vrishchika",
  Budh: "Meena",
  Shukra: "Kanya",
  Mangal: "Karka",
  Guru: "Makara",
  Shani: "Mesh",
};

export const DASHA_ORDER: readonly DashaLord[] = [
  "Ketu",
  "Shukra",
  "Surya",
  "Chandra",
  "Mangal",
  "Rahu",
  "Guru",
  "Shani",
  "Budh",
];

export const DASHA_YEARS: Record<DashaLord, number> = {
  Ketu: 7,
  Shukra: 20,
  Surya: 6,
  Chandra: 10,
  Mangal: 7,
  Rahu: 18,
  Guru: 16,
  Shani: 19,
  Budh: 17,
};

export const DOMAIN_HOUSES: Record<JyotishDomain, readonly number[]> = {
  self: [1, 3, 8],
  career: [6, 10],
  money: [2, 11],
  relationships: [7],
  children: [5],
  family: [2, 4],
  wellbeing: [1, 6, 8, 12],
  education: [4, 5, 9],
  property: [4],
  travel: [3, 9, 12],
};

export const DOMAIN_TITLES: Record<JyotishDomain, string> = {
  self: "Nature aur life direction",
  career: "Career aur work",
  money: "Money aur financial pattern",
  relationships: "Marriage, spouse aur partnership",
  children: "Children, parenting aur creativity",
  family: "Family aur home",
  wellbeing: "Health aur wellbeing",
  education: "Education aur skills",
  property: "Property, residence aur vehicles",
  travel: "Travel aur foreign connections",
};
