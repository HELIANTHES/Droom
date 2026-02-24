import { Service } from "../types";

export const services: Service[] = [
  {
    id: "acupuncture",
    name: "Acupuncture",
    shortDescription:
      "Stimulates the body's natural healing response through precise needle placement at specific therapeutic points.",
    fullDescription:
      "Acupuncture is our flagship therapy. By inserting ultra-thin needles at specific points along the body's meridians, we stimulate the nervous system to release natural pain-relieving chemicals, improve blood circulation, and activate the body's self-healing mechanisms. Research demonstrates that acupuncture modulates the nervous system's pain signaling pathways, making it effective for a wide range of conditions.",
    whatToExpect:
      "Your first visit begins with a thorough consultation and health history review. Dr. Vel will perform a hands-on evaluation, then develop a personalized treatment plan. The needles used are hair-thin — most patients feel little to no discomfort. Sessions typically last 45-60 minutes, and many patients report feeling deeply relaxed during treatment.",
    conditions: [
      "Chronic pain",
      "Migraines",
      "Sciatica",
      "Arthritis",
      "Fibromyalgia",
      "Neuropathy",
      "Autoimmune conditions",
    ],
    icon: "needle",
    heroImage: "/hero-4.png",
    howItWorks:
      "Acupuncture works by inserting ultra-thin, sterile needles at specific points along the body's meridian network — pathways identified over millennia of clinical observation and now mapped by modern neuroimaging. When a needle is placed at a therapeutic point, it activates sensory neurons beneath the skin, sending signals through the spinal cord to the brain. This triggers a cascade of neurochemical responses: the release of endorphins (natural painkillers), serotonin (mood regulation), and anti-inflammatory cytokines. Simultaneously, acupuncture increases local blood flow to the treatment area, delivering oxygen and nutrients that accelerate tissue repair. For chronic pain patients, this means the nervous system gradually recalibrates its pain signaling — reducing the hypersensitivity that keeps you in pain even after the original injury has healed.",
    tcmPerspective:
      "In Traditional Chinese Medicine, health depends on the smooth flow of Qi (vital energy) through the body's meridian system. When Qi becomes blocked or deficient — through injury, stress, poor diet, or environmental factors — pain and illness result. Acupuncture restores the proper flow of Qi by stimulating specific points along meridians associated with the affected organ systems. Dr. Vel's diagnostic approach combines pulse reading, tongue examination, and a thorough health history to identify the root pattern of imbalance, not just the surface symptoms.",
    researchBasis:
      "The National Institutes of Health (NIH) and World Health Organization (WHO) recognize acupuncture as effective for over 40 conditions. A landmark meta-analysis published in the Journal of the American Medical Association (JAMA) found that acupuncture produces clinically significant pain reduction for chronic back pain, osteoarthritis, and headache. The effects persist over time and are not attributable to placebo.",
    relatedConditions: ["chronic-pain", "autoimmune", "neuropathy", "general-wellness"],
    relatedTestimonial: "patricia-j",
  },
  {
    id: "herbal-medicine",
    name: "Chinese Herbal Medicine",
    shortDescription:
      "Custom herbal formulations prescribed to address internal imbalances and support healing from within.",
    fullDescription:
      "Chinese Herbal Medicine uses carefully selected combinations of natural herbs, tailored to each patient's unique constitution and condition. These formulations work synergistically with acupuncture to address the root cause of illness — not just symptoms. Dr. Vel prescribes customized formulas based on your specific diagnosis, adjusting them as your condition evolves.",
    whatToExpect:
      "After a thorough evaluation, Dr. Vel will prescribe an herbal formula specific to your condition. The herbs may come as teas, capsules, or granules. You'll receive clear instructions on preparation and dosage, along with an explanation of how each herb contributes to your treatment plan.",
    conditions: [
      "Autoimmune disorders",
      "Digestive issues",
      "Hormonal imbalances",
      "Chronic fatigue",
      "Anxiety and sleep disorders",
    ],
    icon: "herb",
    heroImage: "/hero-1.jpg",
    howItWorks:
      "Chinese herbal formulas typically contain 8 to 15 herbs working in concert. Each formula has a precise architecture: a chief herb that targets the primary condition, deputy herbs that enhance the chief's action, assistant herbs that address secondary symptoms, and envoy herbs that direct the formula to the correct organ system. Dr. Vel adjusts formulas as your condition evolves — what you take in week one may differ from week four as your body responds. Unlike single-compound pharmaceuticals, multi-herb formulas address the condition from multiple angles simultaneously while the balancing herbs minimize side effects.",
    tcmPerspective:
      "Herbal medicine is the internal counterpart to acupuncture's external approach. While acupuncture works through the meridian system from the outside, herbs work from within — nourishing deficient systems, clearing excess heat or dampness, moving stagnant blood, and calming an overactive immune response. Dr. Vel's herbal prescriptions are based on pattern differentiation: the same Western diagnosis (e.g., IBS) may require completely different herbal formulas depending on whether the root pattern is Spleen Qi deficiency, Liver Qi stagnation, or Damp-Heat accumulation.",
    researchBasis:
      "Modern pharmacological research has identified active compounds in many traditional Chinese herbs. Astragalus (Huang Qi) has demonstrated immunomodulatory effects in clinical trials. Curcumin from turmeric shows significant anti-inflammatory properties. A 2019 systematic review in the British Medical Journal found that integrated Chinese herbal medicine improved outcomes for IBS patients compared to conventional treatment alone.",
    relatedConditions: ["autoimmune", "womens-health", "general-wellness"],
    relatedTestimonial: "jenna-b",
  },
  {
    id: "nutrition",
    name: "Eastern Nutrition / Food-Therapy",
    shortDescription:
      "Personalized dietary guidance based on TCM principles — using food as medicine for your specific constitution.",
    fullDescription:
      "In Traditional Chinese Medicine, food is medicine. Eastern Nutrition therapy goes beyond standard dietary advice by tailoring recommendations to your individual constitution, current condition, and the season. Dr. Vel analyzes your body's specific needs and creates a nutritional plan that supports your treatment and promotes long-term wellness.",
    whatToExpect:
      "Dr. Vel will assess your constitution and current health status, then provide specific dietary recommendations. You'll learn which foods support your healing and which may be aggravating your condition. The guidance is practical and integrates with your existing lifestyle.",
    conditions: [
      "Digestive disorders",
      "Autoimmune conditions",
      "Weight management",
      "Fatigue",
      "Inflammation",
    ],
    icon: "nutrition",
    heroImage: "/hero-3.jpg",
    howItWorks:
      "Eastern nutrition classifies foods not by calories or macronutrients, but by their thermal nature (warming, cooling, neutral), flavor profile (sweet, sour, bitter, pungent, salty), and the organ systems they influence. A patient with a 'cold' digestive pattern — bloating, loose stools, fatigue after eating — receives warming foods (ginger, cinnamon, cooked root vegetables) and avoids raw, cold foods that tax the digestive system. A patient with excess 'heat' — inflammation, acid reflux, skin rashes — receives cooling foods (cucumber, mung beans, pear) and avoids spicy, fried, or overly rich meals. The recommendations are specific and practical — not generic 'eat healthy' advice.",
    tcmPerspective:
      "The Spleen and Stomach are considered the root of post-natal Qi — the energy your body generates from food and drink. When digestion is impaired, every other system suffers. Eastern nutrition therapy strengthens digestive function first, then addresses the specific condition. This is why patients often report improved energy, sleep, and mood alongside resolution of their primary complaint — when the body properly extracts and distributes nutrients, everything works better.",
    researchBasis:
      "The anti-inflammatory diet principles in Eastern nutrition align closely with modern research on the Mediterranean diet and gut microbiome health. Studies published in Nature Medicine demonstrate that dietary interventions can modulate immune response and reduce inflammatory markers in autoimmune patients. The thermal classification system, while framed differently, corresponds to observable physiological effects — ginger genuinely increases peripheral circulation, and cooling foods do reduce metabolic heat production.",
    relatedConditions: ["autoimmune", "general-wellness", "womens-health"],
    relatedTestimonial: "jenna-b",
  },
  {
    id: "dry-needling",
    name: "Dry Needling",
    shortDescription:
      "Targeted technique for musculoskeletal pain relief that reduces trigger points and restores function.",
    fullDescription:
      "Dry Needling targets myofascial trigger points — the tight knots in muscle tissue that refer pain to other areas of the body. By inserting a thin needle directly into these trigger points, the technique releases muscle tension, improves blood flow, and restores normal function. It is particularly effective for acute and chronic musculoskeletal pain.",
    whatToExpect:
      "Dr. Vel will identify the trigger points causing your pain through palpation. The needle insertion may produce a brief twitch response in the muscle — this is a sign that the trigger point is releasing. Most patients experience immediate improvement in range of motion and pain reduction.",
    conditions: [
      "Shoulder pain",
      "Back pain",
      "Neck pain",
      "Sports injuries",
      "Muscle tension",
      "Carpal tunnel",
    ],
    icon: "target",
    heroImage: "/hero-4.png",
    howItWorks:
      "When a needle enters a myofascial trigger point, it produces a local twitch response — an involuntary contraction of the taut muscle band. This twitch is therapeutic: it disrupts the sustained contraction that forms the trigger point, increases blood flow to the oxygen-starved tissue, and flushes out the accumulated waste products (including substance P and inflammatory mediators) that sensitize local nerve endings. The result is immediate relaxation of the muscle band and a measurable increase in range of motion. For chronic trigger points that have been present for months or years, a series of sessions progressively resolves deeper layers of dysfunction.",
    tcmPerspective:
      "While dry needling is rooted in Western anatomy, Dr. Vel integrates it with TCM diagnostic principles. Many trigger points correspond to traditional acupuncture points — the gallbladder meridian points along the upper trapezius, for instance, overlap with the most common neck and shoulder trigger points. By combining the anatomical precision of dry needling with the systemic thinking of TCM, Dr. Vel addresses both the local muscle dysfunction and the underlying patterns that caused it.",
    researchBasis:
      "A systematic review in the Journal of Orthopaedic & Sports Physical Therapy found that dry needling produces significant short-term improvements in pain and disability for patients with myofascial trigger points. Research published in Pain Medicine demonstrated that dry needling reduces muscle stiffness as measured by shear wave elastography, providing objective evidence of the tissue changes patients feel.",
    relatedConditions: ["chronic-pain"],
    relatedTestimonial: "patsy-w",
  },
  {
    id: "moxibustion",
    name: "Moxibustion",
    shortDescription:
      "Heat therapy using mugwort applied to specific points to increase circulation and relieve pain.",
    fullDescription:
      "Moxibustion involves burning dried mugwort (moxa) on or near specific acupuncture points on the body. The gentle, penetrating heat increases blood circulation, stimulates the immune system, and promotes the body's natural healing processes. This therapy is especially effective for conditions that involve cold or stagnation in the body.",
    whatToExpect:
      "During treatment, Dr. Vel will place moxa either directly on the skin with a protective barrier or hold it near the treatment area. You'll feel a pleasant warming sensation that penetrates deep into the tissue. The treatment is deeply relaxing and often combined with acupuncture for enhanced results.",
    conditions: [
      "Chronic pain",
      "Digestive issues",
      "Cold-related conditions",
      "Immune support",
      "Fatigue",
    ],
    icon: "flame",
    heroImage: "/hero-2.jpg",
    howItWorks:
      "Moxibustion delivers infrared heat at specific wavelengths that penetrate 2-3 centimeters below the skin surface — deeper than a heating pad or hot pack. This deep, sustained warmth dilates local blood vessels, increases microcirculation, and activates heat-sensitive immune cells. The burning of mugwort (Artemisia vulgaris) also releases volatile compounds that are absorbed through the skin and have demonstrated anti-inflammatory and analgesic properties. When applied to acupuncture points, moxibustion amplifies the therapeutic effect of needle treatment — the combination of mechanical (needle) and thermal (moxa) stimulation activates multiple neural pathways simultaneously.",
    tcmPerspective:
      "Moxibustion is the warming counterpart to acupuncture's stimulating action. In TCM, many chronic conditions involve patterns of 'cold' and 'deficiency' — the body lacks sufficient warmth and vital energy to heal itself. Cold patterns manifest as dull aching pain that worsens in cold weather, chronic fatigue, poor digestion, and a feeling of internal coldness. Moxibustion directly supplements Yang energy and expels pathogenic cold. It is particularly indicated for conditions where the body's self-healing capacity has been depleted by prolonged illness, overwork, or aging.",
    researchBasis:
      "Research published in Evidence-Based Complementary and Alternative Medicine found that moxibustion significantly improved symptoms in patients with knee osteoarthritis compared to sham treatment. Studies in the Journal of Traditional Chinese Medicine demonstrated that moxibustion at specific points (ST36) increases white blood cell counts and enhances immune function, supporting its traditional use for immune support and recovery from chronic illness.",
    relatedConditions: ["chronic-pain", "autoimmune", "general-wellness"],
    relatedTestimonial: "laurel-k",
  },
  {
    id: "electroacupuncture",
    name: "Microacupuncture 48 (MA48) / Electroacupuncture",
    shortDescription:
      "Advanced technique combining precise needle placement with electrical stimulation for enhanced therapeutic effect.",
    fullDescription:
      "This advanced modality pairs traditional acupuncture with mild electrical stimulation to enhance the therapeutic effect. Microacupuncture 48 (MA48) uses a specialized system of 48 points, primarily around the hands and feet, that has shown remarkable results for eye conditions, neuropathy, and complex pain cases. Electroacupuncture applies a gentle electrical current between pairs of acupuncture needles, amplifying pain relief and nerve function restoration.",
    whatToExpect:
      "The procedure begins like standard acupuncture, with the addition of small electrode clips attached to select needles. You'll feel a gentle tingling or pulsing sensation — the intensity is always adjusted to your comfort level. Sessions typically last 30-45 minutes.",
    conditions: [
      "Neuropathy",
      "Eye conditions",
      "Complex pain cases",
      "Nerve damage",
      "Post-surgical recovery",
    ],
    icon: "zap",
    heroImage: "/hero-2.jpg",
    howItWorks:
      "Electroacupuncture adds a controlled electrical current (typically 2-100 Hz) between pairs of acupuncture needles. Different frequencies produce different effects: low frequency (2-4 Hz) triggers endorphin and enkephalin release for deep pain relief, while high frequency (80-100 Hz) stimulates dynorphin release for localized analgesia. This frequency-dependent response allows Dr. Vel to precisely target the neurochemical pathway most relevant to your condition. The MA48 system is a specialized protocol using 48 points concentrated around the hands and feet that creates a powerful neurological stimulus for conditions affecting the eyes, peripheral nerves, and complex pain syndromes.",
    tcmPerspective:
      "Electroacupuncture represents the integration of modern technology with classical acupuncture theory. The electrical stimulation amplifies the Qi-moving effect of needle insertion, making it particularly effective for severe stagnation patterns and conditions where conventional acupuncture alone provides partial relief. MA48 works on the principle that the hands and feet contain microsystems that reflect and influence the entire body — a concept that has parallels in reflexology and auricular acupuncture, and increasingly supported by neuroimaging studies showing somatotopic cortical representation.",
    researchBasis:
      "Electroacupuncture has one of the strongest evidence bases in acupuncture research. A Cochrane review found it effective for chemotherapy-induced nausea. Studies in the journal Neurology demonstrated significant improvement in peripheral neuropathy symptoms with electroacupuncture compared to sham treatment. Research specifically on the MA48 protocol, published in the Journal of Chinese Medicine, reports measurable improvements in visual acuity for macular degeneration patients — a condition with few effective conventional treatments.",
    relatedConditions: ["neuropathy", "chronic-pain"],
    relatedTestimonial: "celeste-b",
  },
  {
    id: "manual-therapy",
    name: "Tui-na, Guasha & Cupping",
    shortDescription:
      "Manual therapy techniques that complement acupuncture — massage, scraping, and suction to release tension and improve circulation.",
    fullDescription:
      "These three complementary therapies are frequently combined with acupuncture for comprehensive treatment. Tui-na is a form of therapeutic massage that works the body's energy channels. Guasha uses a smooth tool to scrape the skin, breaking up stagnation and improving circulation. Cupping applies suction cups to the skin to draw blood flow to specific areas, relieving muscle tension and promoting healing.",
    whatToExpect:
      "Dr. Vel will determine which combination of techniques is appropriate for your condition. Tui-na involves deep tissue manipulation. Guasha may leave temporary redness that resolves within a few days. Cupping typically leaves circular marks that fade within a week. All techniques are adjusted to your comfort level.",
    conditions: [
      "Muscle tension",
      "Back and shoulder pain",
      "Poor circulation",
      "Respiratory issues",
      "Recovery from injury",
    ],
    icon: "hands",
    heroImage: "/hero-1.jpg",
    howItWorks:
      "Each technique works through a different mechanism. Tui-na (therapeutic massage) applies pressure, kneading, and manipulation along meridian pathways and muscle groups to release tension and improve Qi and blood flow. Guasha uses a smooth-edged tool to apply repeated strokes across the skin, creating controlled microtrauma that triggers an anti-inflammatory and immune response — the resulting redness (petechiae) indicates the release of stagnant blood and metabolic waste. Cupping creates negative pressure that lifts tissue layers apart, increasing blood flow to the treatment area by up to 400%, flushing out metabolic waste, and releasing fascial adhesions.",
    tcmPerspective:
      "In TCM theory, pain is fundamentally caused by stagnation — blocked Qi and blood that cannot circulate freely. Manual therapies directly address stagnation by physically moving Qi and blood through the affected area. Tui-na works the meridian channels. Guasha breaks up blood stasis (Yu Xue). Cupping draws pathogenic factors to the surface for elimination. When combined with acupuncture, these techniques provide both internal regulation (through the needle's neurological effects) and external mobilization (through manual tissue manipulation) — a comprehensive approach that resolves both cause and symptom.",
    researchBasis:
      "A systematic review in Complementary Therapies in Medicine found that cupping therapy produces significant improvements in chronic neck pain. Research published in the Journal of Alternative and Complementary Medicine demonstrated that guasha increases surface microcirculation by 400% and upregulates heme oxygenase-1, an enzyme with anti-inflammatory, antioxidant, and cytoprotective effects. Studies on tui-na in Pain Research and Management found it comparable to physical therapy for chronic low back pain.",
    relatedConditions: ["chronic-pain", "general-wellness"],
    relatedTestimonial: "eric-s",
  },
];
