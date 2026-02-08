import { Condition } from "../types";

export const conditions: Condition[] = [
  {
    id: "chronic-pain",
    name: "Chronic Pain Relief",
    description:
      "When conventional treatments haven't provided lasting relief, acupuncture and TCM offer a different path. Our patients regularly report significant pain reduction — often after just a few sessions.",
    examples: [
      "Fibromyalgia",
      "Migraines & headaches",
      "Rheumatoid arthritis",
      "Osteoarthritis",
      "Spinal stenosis",
      "Complex regional pain syndrome (CRPS)",
      "Sciatica",
    ],
    icon: "shield",
  },
  {
    id: "autoimmune",
    name: "Autoimmune Disorders",
    description:
      "TCM has been treating complex inflammatory conditions for millennia. Modern research confirms what practitioners have observed: acupuncture and herbal medicine modulate immune response, reduce inflammation, and improve quality of life.",
    examples: [
      "Crohn's disease",
      "Ulcerative colitis",
      "IBS",
      "Lupus (SLE)",
      "Hashimoto's thyroiditis",
      "Psoriatic arthritis",
      "Chronic fatigue syndrome",
    ],
    icon: "immune",
  },
  {
    id: "neuropathy",
    name: "Neuropathy",
    description:
      "Peripheral nerve dysfunction causing numbness, tingling, and weakness can be debilitating. Our electroacupuncture and MA48 techniques have shown remarkable results in restoring nerve function and sensation.",
    examples: [
      "Peripheral neuropathy",
      "Diabetic neuropathy",
      "Numbness and tingling",
      "Nerve pain",
      "Post-chemotherapy neuropathy",
    ],
    icon: "nerve",
  },
  {
    id: "womens-health",
    name: "Women's Health",
    description:
      "From hormonal balance to reproductive health, TCM offers comprehensive support for conditions that often don't respond fully to conventional approaches alone.",
    examples: [
      "PMS & menstrual irregularities",
      "PCOS",
      "Endometriosis",
      "Uterine fibroids",
      "Interstitial cystitis",
      "Menopausal symptoms",
    ],
    icon: "heart",
  },
  {
    id: "mens-health",
    name: "Men's Health",
    description:
      "If you're dealing with prostate issues or other men's health concerns, you don't have to accept them as inevitable. TCM provides effective, drug-free approaches that your urologist may not have mentioned.",
    examples: [
      "BPH (enlarged prostate)",
      "Elevated PSA/PHI",
      "Erectile dysfunction",
      "Low libido",
      "Urinary symptoms",
    ],
    icon: "strength",
  },
  {
    id: "general-wellness",
    name: "General Wellness",
    description:
      "You don't need a specific condition to benefit from TCM. Preventative care, stress management, digestive optimization, and overall vitality — invest in your health before something breaks.",
    examples: [
      "Digestive issues",
      "Fatigue & low energy",
      "Anxiety & stress",
      "Sleep disorders",
      "Respiratory issues",
      "Preventative care",
    ],
    icon: "wellness",
  },
];
