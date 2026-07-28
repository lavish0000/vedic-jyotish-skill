import type {
  EvidencePolarity,
  JyotishDomain,
} from "./types";

export function practicalTakeaway(
  domain: JyotishDomain,
  polarity: EvidencePolarity,
) {
  const takeaways: Record<
    JyotishDomain,
    Record<EvidencePolarity, string>
  > = {
    self: {
      supportive:
        "Aap initiative lene aur apne decisions ki zimmedari uthane mein comfortable ho sakte hain.",
      challenging:
        "Andar ki feeling aur bahar ka response kabhi match na kare; bade decisions se pehle thoda rukna aur trusted feedback lena useful rahega.",
      mixed:
        "Kabhi confidence jaldi aata hai aur feelings baad mein settle hoti hain; apni pace par sochkar decide karna better rahega.",
    },
    career: {
      supportive:
        "Structured roles, zimmedari aur kisi skill mein depth aapke career ko aage le ja sakti hai.",
      challenging:
        "Workload, boss ya direction ko lekar friction ho sakti hai; role aur priorities pehle se clear rakhein.",
      mixed:
        "Career progress ho sakti hai, par seedha route zaroori nahi; difficult problems solve karna aur kaam finish karna strength ban sakta hai.",
    },
    money: {
      supportive:
        "Income ko stable skill, regular saving aur long-term planning se zyada support mil sakta hai.",
      challenging:
        "Cash flow ya risk decisions kabhi uneven ho sakte hain; emergency fund aur spending limits pehle se tay rakhein.",
      mixed:
        "Kamai ke chances ke saath ups and downs bhi aa sakte hain; bada financial step lene se pehle cash buffer aur worst-case limit clear rakhein.",
    },
    relationships: {
      supportive:
        "Mutual respect, practical understanding aur healthy personal space se partnership stable ho sakti hai.",
      challenging:
        "Pace, control ya communication par tension ho sakti hai; assumptions ke bajay seedhi baat aur clear boundaries rakhein.",
      mixed:
        "Connection aur independence dono important ho sakte hain; compatibility ka real test disagreement ke baad ka behavior hoga.",
    },
    children: {
      supportive:
        "Children, mentoring ya creative responsibility mein patience aur steady involvement strength ban sakti hai.",
      challenging:
        "Expectations ya timing ko force karne ke bajay patience, support aur practical planning ko priority dein.",
      mixed:
        "Care, creativity aur responsibility ka mix strong ho sakta hai; flexibility aur realistic expectations useful rahengi.",
    },
    family: {
      supportive:
        "Family ke saath dependable communication aur clear responsibilities emotional stability ko support kar sakti hain.",
      challenging:
        "Family expectations aur personal boundaries takra sakte hain; responsibility ko silently carry karne ke bajay baat clear rakhein.",
      mixed:
        "Family attachment strong ho sakta hai, par space bhi zaroori rahegi; roles aur expectations ko openly define karna helpful hoga.",
    },
    wellbeing: {
      supportive:
        "Regular sleep, movement aur predictable routine energy ko stable rakhne mein help kar sakte hain.",
      challenging:
        "Stress ko ignore karna routine ko disturb kar sakta hai; rest aur professional care ko delay na karein.",
      mixed:
        "Energy phases mein chal sakti hai; demanding periods ke saath recovery time pehle se plan karna useful rahega.",
    },
    education: {
      supportive:
        "Structured learning, good mentors aur repeated practice se skills steadily deepen ho sakti hain.",
      challenging:
        "Too many directions focus tod sakti hain; ek clear syllabus aur measurable practice schedule rakhein.",
      mixed:
        "Curiosity strong ho sakti hai, par consistency vary karegi; theory ko practical projects ke saath jodna better rahega.",
    },
    property: {
      supportive:
        "Residence ya property decisions mein patient research aur long-term affordability ko priority dena supportive rahega.",
      challenging:
        "Emotional urgency ya family pressure mein property decision na lein; documents, debt aur maintenance cost independently verify karein.",
      mixed:
        "Home base important rahega, par timing straight-line nahi ho sakti; flexibility aur financial buffer rakhein.",
    },
    travel: {
      supportive:
        "Travel, distant networks aur new environments learning aur opportunity ko support kar sakte hain.",
      challenging:
        "Travel ya relocation ko escape plan na banayein; visa, work, housing aur support system pehle verify karein.",
      mixed:
        "Foreign connections meaningful ho sakte hain, par permanent settlement automatic nahi; options ko practical milestones se test karein.",
    },
  };

  return takeaways[domain][polarity];
}
