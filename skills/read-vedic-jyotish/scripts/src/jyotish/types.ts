export type SignName =
  | "Mesh"
  | "Vrishabha"
  | "Mithuna"
  | "Karka"
  | "Simha"
  | "Kanya"
  | "Tula"
  | "Vrishchika"
  | "Dhanu"
  | "Makara"
  | "Kumbha"
  | "Meena";

export type ClassicalPlanetName =
  | "Surya"
  | "Chandra"
  | "Budh"
  | "Shukra"
  | "Mangal"
  | "Guru"
  | "Shani";

export type JyotishPlanetName =
  | ClassicalPlanetName
  | "Rahu"
  | "Ketu";

export type DashaLord = JyotishPlanetName;

export type JyotishPlanet = {
  name: JyotishPlanetName;
  longitude: number;
  retrograde?: boolean;
};

export type Dignity =
  | "own"
  | "exalted"
  | "debilitated"
  | "unclassified";

export type DignityRecord = {
  planet: JyotishPlanetName;
  sign: SignName;
  signIndex: number;
  dignity: Dignity;
};

export type HouseLordPlacement = {
  house: number;
  houseSign: SignName;
  lord: ClassicalPlanetName;
  lordSign: SignName;
  lordHouse: number;
  dignity: Dignity;
};

export type ConjunctionTightness = "tight" | "moderate" | "wide";

export type SameSignConjunction = {
  id: string;
  planets: readonly [JyotishPlanetName, JyotishPlanetName];
  sign: SignName;
  angularSeparation: number;
  tightness: ConjunctionTightness;
};

export type GrahaAspectKind =
  | "seventh"
  | "mars-fourth"
  | "mars-eighth"
  | "jupiter-fifth"
  | "jupiter-ninth"
  | "saturn-third"
  | "saturn-tenth";

export type GrahaAspect = {
  id: string;
  source: ClassicalPlanetName;
  kind: GrahaAspectKind;
  label: string;
  fromHouse: number;
  toHouse: number;
  toSign: SignName;
  targetPlanets: JyotishPlanetName[];
};

export type JyotishDomain =
  | "self"
  | "career"
  | "money"
  | "relationships"
  | "children"
  | "family"
  | "wellbeing"
  | "education"
  | "property"
  | "travel";

export type YogaRuleId =
  | "pancha-mahapurusha"
  | "gaja-kesari"
  | "budha-aditya"
  | "chandra-mangala"
  | "parivartana";

export type YogaFormation = {
  id: string;
  ruleId: YogaRuleId;
  name: string;
  participants: JyotishPlanetName[];
  domains: JyotishDomain[];
  summary: string;
};

export type AntardashaPeriod = {
  lord: DashaLord;
  start: Date;
  end: Date;
  durationYears: number;
};

export type MahadashaPeriod = {
  lord: DashaLord;
  start: Date;
  end: Date;
  durationYears: number;
  antardashas: AntardashaPeriod[];
};

export type VimshottariTimeline = {
  yearDays: 365.25;
  birthNakshatraIndex: number;
  birthMahadashaLord: DashaLord;
  birthBalanceDays: number;
  birthBalanceYears: number;
  birthMahadasha: MahadashaPeriod;
  birthAntardasha: AntardashaPeriod;
  currentMahadasha: MahadashaPeriod;
  currentAntardasha: AntardashaPeriod;
  nextAntardasha: AntardashaPeriod | null;
  nextMahadasha: MahadashaPeriod | null;
  mahadashas: MahadashaPeriod[];
  asOf: Date;
};

export type EvidenceKind =
  | "rashi-synthesis"
  | "house-lord"
  | "conjunction"
  | "aspect"
  | "yoga"
  | "dasha";

export type EvidencePolarity = "supportive" | "challenging" | "mixed";
export type EvidenceStability = "stable" | "sensitive" | "unknown";
export type ConfidenceBand = "high" | "medium" | "low";

export type JyotishEvidence = {
  id: string;
  label: string;
  kind: EvidenceKind;
  domain: JyotishDomain;
  polarity: EvidencePolarity;
  strength: 1 | 2 | 3;
  summary: string;
  factIds: string[];
  stability: EvidenceStability;
  timeframe?: {
    start: Date;
    end: Date;
  };
};

export type DomainSynthesis = {
  domain: JyotishDomain;
  title: string;
  quickText: string;
  text: string;
  overviewFacts: DomainFact[];
  tone: EvidencePolarity;
  confidence: ConfidenceBand;
  fingerprint: string;
  insights: DomainInsight[];
  practicalText: string;
  limitations: string[];
  evidenceIds: string[];
  counterEvidenceIds: string[];
  omittedCounterEvidenceIds: string[];
  omittedCounterEvidenceCount: number;
  timeframe?: {
    start: Date;
    end: Date;
  };
};

export type DomainInsight = {
  label: string;
  text: string;
  facts: DomainFact[];
};

export type DomainFact = {
  id: string;
  label: string;
};

export type DashaThemeActivation = {
  mahadashaLord: DashaLord;
  antardashaLord: DashaLord;
  domains: JyotishDomain[];
  polarity: EvidencePolarity;
};

export type DashaThemeTimeline = {
  current: DashaThemeActivation;
  nextAntardasha: DashaThemeActivation | null;
};

export type JyotishStability = {
  ascendant: EvidenceStability;
  moonRashi: EvidenceStability;
  nakshatra: EvidenceStability;
};

export type TraditionalJyotishInput = {
  ascendantLongitude: number;
  planets: JyotishPlanet[];
  birthDate: Date;
  asOf: Date;
  stability?: Partial<JyotishStability>;
};

export type TraditionalJyotishReport = {
  ruleSetVersion: string;
  houseLords: HouseLordPlacement[];
  dignities: DignityRecord[];
  conjunctions: SameSignConjunction[];
  aspects: GrahaAspect[];
  yogas: YogaFormation[];
  vimshottari: VimshottariTimeline;
  dashaThemes: DashaThemeTimeline;
  evidence: JyotishEvidence[];
  domains: DomainSynthesis[];
};
