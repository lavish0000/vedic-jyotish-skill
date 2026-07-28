import { signNameOf } from "./math";
import type {
  JyotishEvidence,
  JyotishPlanet,
  JyotishStability,
  SignName,
} from "./types";

const lagnaVoice: Record<SignName, string> = {
  Mesh: "Visible approach direct aur action-led ho sakta hai.",
  Vrishabha: "Visible approach stability aur practical proof ko value kar sakta hai.",
  Mithuna: "Visible approach curious, verbal aur adaptable ho sakta hai.",
  Karka: "Visible approach protective aur environment-sensitive ho sakta hai.",
  Simha: "Visible approach expressive, confident aur ownership-led ho sakta hai.",
  Kanya: "Visible approach detail, craft aur improvement par focus kar sakta hai.",
  Tula: "Visible approach balance, fairness aur relationship awareness ko value kar sakta hai.",
  Vrishchika: "Visible approach private, focused aur trust-conscious ho sakta hai.",
  Dhanu: "Visible approach learning, freedom aur principles se guided ho sakta hai.",
  Makara: "Visible approach structured, responsible aur long-term ho sakta hai.",
  Kumbha: "Visible approach independent, systems-oriented aur unconventional ho sakta hai.",
  Meena: "Visible approach imaginative, empathetic aur intuitive ho sakta hai.",
};

type RashiSynthesisInput = {
  ascendantLongitude: number;
  planets: readonly JyotishPlanet[];
  stability: JyotishStability;
};

export function deriveRashiSynthesisEvidence({
  ascendantLongitude,
  planets,
  stability,
}: RashiSynthesisInput): JyotishEvidence {
  const moon = planets.find((planet) => planet.name === "Chandra");
  if (!moon) {
    throw new Error("Chandra is required for Lagna-Chandra synthesis.");
  }

  const ascendantSign = signNameOf(ascendantLongitude);
  const moonSign = signNameOf(moon.longitude);
  const aligned = ascendantSign === moonSign;
  const hasSensitiveInput =
    stability.ascendant === "sensitive" ||
    stability.moonRashi === "sensitive";
  const hasUnknownInput =
    stability.ascendant === "unknown" ||
    stability.moonRashi === "unknown";

  return {
    id: `evidence-rashi-${ascendantSign}-${moonSign}-self`,
    label: "Lagna-Chandra synthesis",
    kind: "rashi-synthesis",
    domain: "self",
    polarity: "mixed",
    strength: 2,
    summary: aligned
      ? `${lagnaVoice[ascendantSign]} Chandra bhi ${moonSign} mein hai, isliye inner response aur visible approach ko relatively aligned read kiya jata hai.`
      : `${lagnaVoice[ascendantSign]} Chandra ${moonSign} mein hai, isliye inner response aur visible approach mein contrast ho sakta hai.`,
    factIds: [
      `ascendant-sign-${ascendantSign}`,
      "planet-Chandra",
      `moon-sign-${moonSign}`,
    ],
    stability: hasSensitiveInput
      ? "sensitive"
      : hasUnknownInput
        ? "unknown"
        : "stable",
  };
}
