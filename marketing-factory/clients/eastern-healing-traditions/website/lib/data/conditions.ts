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
    heroImage: "/hero-4.png",
    overview:
      "Chronic pain affects more than 50 million Americans, and for many, conventional treatments offer only partial relief. Pain medications manage symptoms but carry risks of dependency and side effects. Surgery addresses structural issues but cannot always resolve the neurological sensitization that keeps you in pain after tissues have healed. If you have been living with persistent pain — whether from fibromyalgia, migraines, arthritis, sciatica, or another condition — you already know that there is no simple answer. What you may not know is that acupuncture and Traditional Chinese Medicine have been treating chronic pain for over 3,000 years, and modern research now confirms what practitioners have long observed: TCM produces clinically significant, lasting pain reduction for conditions that other treatments have failed to resolve.",
    howTCMHelps:
      "TCM addresses chronic pain through multiple mechanisms simultaneously. Acupuncture modulates the nervous system's pain signaling pathways, reducing the central sensitization that keeps you in pain. It triggers the release of endorphins, enkephalins, and anti-inflammatory cytokines — your body's own pain-relieving chemicals. Dry needling targets the myofascial trigger points that refer pain across the body. Moxibustion increases blood circulation to areas of stagnation, delivering oxygen and nutrients needed for tissue repair. Chinese herbal medicine reduces systemic inflammation from within. Rather than suppressing pain signals with medication, TCM helps your body recalibrate its pain response and heal the underlying dysfunction. Our patients — like Patricia J., who canceled her planned shoulder surgery after 3 sessions, and Patsy W., who resolved 20 years of shoulder pain in 3 treatments — demonstrate what becomes possible when the root cause is addressed.",
    modalities: ["acupuncture", "dry-needling", "moxibustion", "electroacupuncture", "manual-therapy"],
    relatedTestimonial: "patricia-j",
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
    heroImage: "/hero-1.jpg",
    overview:
      "Autoimmune conditions occur when the immune system mistakenly attacks the body's own tissues. Whether you are managing Crohn's disease, Hashimoto's thyroiditis, lupus, ulcerative colitis, or another autoimmune disorder, you know the frustration: flare-ups that disrupt your life, medications with significant side effects, and a medical system that often tells you 'your labs look fine' when you clearly do not feel fine. Conventional medicine excels at acute intervention but often falls short in managing the chronic, fluctuating nature of autoimmune disease. TCM offers a complementary approach that addresses what conventional treatment cannot — reducing flare frequency, minimizing medication side effects, and restoring the sense of control that chronic illness takes away.",
    howTCMHelps:
      "TCM views autoimmune conditions as patterns of immune dysregulation rooted in deeper constitutional imbalances. Rather than simply suppressing the immune system (as immunosuppressant drugs do), acupuncture and herbal medicine work to modulate immune function — calming the overactive response while preserving normal immunity. Acupuncture has been shown to regulate T-cell populations and reduce pro-inflammatory cytokines. Chinese herbal formulas containing astragalus, rehmannia, and other immunomodulatory herbs address the systemic inflammation that drives flare-ups. Dr. Vel creates individualized treatment plans based on your specific pattern — because two patients with Hashimoto's may have very different underlying imbalances requiring very different approaches. The goal is fewer flares, reduced medication dependency, and a measurably better quality of life.",
    modalities: ["acupuncture", "herbal-medicine", "nutrition", "moxibustion"],
    relatedTestimonial: "jenna-b",
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
    heroImage: "/hero-2.jpg",
    overview:
      "Neuropathy — damage or dysfunction of peripheral nerves — causes numbness, tingling, burning pain, and weakness, most commonly in the hands and feet. Whether your neuropathy stems from diabetes, chemotherapy, autoimmune disease, or unknown causes (idiopathic neuropathy), conventional medicine offers limited options: pain management through medications like gabapentin or pregabalin, which manage symptoms but do not restore nerve function. Many patients are told that nerve damage is irreversible — that the best they can hope for is slowing the progression. Our clinical experience, supported by a growing body of research, tells a different story. Electroacupuncture and the specialized MA48 protocol have produced measurable improvements in nerve function, sensation, and quality of life for neuropathy patients.",
    howTCMHelps:
      "Electroacupuncture is particularly effective for neuropathy because electrical stimulation directly activates nerve fibers and promotes neuroplasticity — the nervous system's ability to form new connections and repair damaged pathways. The MA48 (Microacupuncture 48) protocol uses a specialized system of 48 points around the hands and feet that creates a powerful neurological stimulus, and has shown remarkable results for peripheral neuropathy and even eye conditions involving nerve degeneration. Acupuncture also increases blood flow to peripheral nerves, delivering the oxygen and nutrients needed for nerve repair. Chinese herbal medicine supports nerve health from within through herbs with neuroprotective and neurotrophic properties. Celeste B.'s experience — years of progressive hand numbness improved to the point where she completed a 100-mile bike ride — illustrates the potential for recovery that conventional medicine does not always acknowledge.",
    modalities: ["electroacupuncture", "acupuncture", "herbal-medicine"],
    relatedTestimonial: "celeste-b",
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
    heroImage: "/hero-3.jpg",
    overview:
      "Women's health conditions — from menstrual irregularities and PCOS to endometriosis, fibroids, and menopausal symptoms — involve complex hormonal interactions that conventional medicine often addresses with a narrow toolkit: birth control pills, hormone replacement therapy, or surgery. These approaches can be effective but frequently come with significant side effects and do not address the underlying imbalance. TCM has been treating women's health conditions for millennia, with a sophisticated understanding of how hormonal cycles, emotional health, and physical symptoms interconnect. If you are managing a condition that conventional treatment has not fully resolved — or if you want to avoid the side effects of pharmaceutical intervention — TCM offers a comprehensive, whole-person approach.",
    howTCMHelps:
      "TCM views women's health through the lens of Blood and Qi circulation, Kidney essence, and Liver function — the organ systems most directly involved in hormonal regulation and reproductive health. Acupuncture regulates the hypothalamic-pituitary-ovarian axis, helping to normalize hormonal fluctuations that drive conditions like PMS, irregular periods, and PCOS. Chinese herbal formulas containing herbs like Dang Gui (Angelica sinensis), Bai Shao (white peony), and Chai Hu (bupleurum) have been used for centuries to regulate menstrual cycles, reduce pain, and support hormonal balance. Dr. Vel's approach addresses the whole pattern — not just the reproductive symptoms, but the digestive health, stress levels, sleep quality, and emotional well-being that influence hormonal function. Jenna B.'s experience — hormonal balance and digestive issues resolved in two months through combined acupuncture and herbal medicine — demonstrates how treating the whole person produces results that treating symptoms alone cannot.",
    modalities: ["acupuncture", "herbal-medicine", "nutrition", "moxibustion"],
    relatedTestimonial: "jenna-b",
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
    heroImage: "/hero-4.png",
    overview:
      "Men's health conditions — particularly BPH (benign prostatic hyperplasia), elevated PSA, erectile dysfunction, and urinary symptoms — are often treated as inevitable consequences of aging. Your urologist may prescribe alpha-blockers, 5-alpha reductase inhibitors, or PDE5 inhibitors, each with their own side effects. Or you may be told to 'watch and wait.' What most men are not told is that TCM has a long history of effectively treating prostate and urological conditions, and that acupuncture and herbal medicine can produce measurable improvements in symptoms, quality of life, and laboratory markers — without the side effects of pharmaceutical intervention.",
    howTCMHelps:
      "TCM addresses men's health through the Kidney system — which in Chinese medicine governs reproductive function, urinary health, bone health, and vitality. For BPH and urinary symptoms, acupuncture reduces prostate inflammation and relaxes the smooth muscle of the bladder neck, improving urinary flow without medication. Chinese herbal formulas targeting Kidney Yang deficiency and Damp-Heat in the lower burner have been used for centuries to address prostate enlargement, urinary frequency, and sexual dysfunction. For erectile dysfunction and low libido, acupuncture improves pelvic blood flow and regulates the hormonal axis. Dr. Vel's approach is direct, thorough, and evidence-based — this is clinical medicine, not lifestyle advice.",
    modalities: ["acupuncture", "herbal-medicine", "moxibustion", "electroacupuncture"],
    relatedTestimonial: "eric-s",
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
    heroImage: "/hero-3.jpg",
    overview:
      "You do not need to be in pain or managing a chronic condition to benefit from TCM. In fact, the original purpose of Chinese medicine was preventative — treating imbalances before they become illness. If you are dealing with persistent fatigue, digestive issues, poor sleep, anxiety, respiratory problems, or simply want to optimize your overall health, TCM offers tools that conventional medicine often overlooks. Rather than waiting for a diagnosis and then treating the disease, TCM identifies and corrects the functional imbalances that precede illness — keeping your body in a state where disease is less likely to develop.",
    howTCMHelps:
      "For general wellness, Dr. Vel uses a combination of acupuncture, herbal medicine, and nutrition therapy tailored to your constitution and current health status. Acupuncture regulates the autonomic nervous system, reducing the chronic stress response that underlies fatigue, anxiety, digestive dysfunction, and sleep disorders. Chinese herbal formulas support specific organ systems — strengthening digestion, calming the mind, boosting immune function, or improving respiratory health. Eastern nutrition therapy provides personalized dietary guidance based on your body's specific needs, not generic dietary advice. Many wellness patients report improvements they did not expect: better sleep, more stable energy, improved digestion, reduced anxiety, and a general sense of vitality they had forgotten was possible. Maria S.'s story — her child's ADD and anxiety symptoms resolved through acupuncture without medication — illustrates how TCM can address conditions that affect overall well-being, not just specific diseases.",
    modalities: ["acupuncture", "herbal-medicine", "nutrition", "moxibustion"],
    relatedTestimonial: "maria-s",
  },
];
