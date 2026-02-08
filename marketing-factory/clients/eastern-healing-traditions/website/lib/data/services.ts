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
  },
];
