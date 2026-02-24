import { FirstVisitStep, FAQ } from "../types";

export const firstVisitSteps: FirstVisitStep[] = [
  {
    step: 1,
    title: "Arrival & Welcome",
    description:
      "You'll be greeted at our Grayslake clinic and asked to complete a brief intake form covering your health history, current symptoms, medications, and goals for treatment. Arrive 10-15 minutes early to complete paperwork comfortably.",
  },
  {
    step: 2,
    title: "Comprehensive Intake",
    description:
      "Dr. Vel will sit down with you for a thorough conversation about your health — not a rushed 15-minute appointment. Expect detailed questions about your condition, medical history, lifestyle, diet, sleep, stress levels, and what you have tried before. This is the foundation of your treatment plan.",
  },
  {
    step: 3,
    title: "TCM Diagnosis",
    description:
      "Dr. Vel performs a traditional diagnostic assessment including pulse reading (checking six positions on each wrist), tongue examination, and palpation of relevant areas. These techniques — refined over millennia — reveal patterns of imbalance that standard medical tests often miss.",
  },
  {
    step: 4,
    title: "Treatment Plan",
    description:
      "Before any treatment begins, Dr. Vel will explain exactly what he found, what it means, and what he recommends. You will understand the 'why' behind every element of your treatment plan — which modalities, how many sessions, and what to realistically expect. Questions are encouraged.",
  },
  {
    step: 5,
    title: "Needle Placement",
    description:
      "If acupuncture is part of your treatment, Dr. Vel will place ultra-thin needles at specific therapeutic points. The needles are hair-thin — significantly thinner than the hypodermic needles used for injections. Most patients feel little to no discomfort. Some feel a brief sensation of heaviness or warmth at the needle site — this is a sign the treatment is working.",
  },
  {
    step: 6,
    title: "Rest & Treatment",
    description:
      "Once the needles are placed, you will rest comfortably for 20-30 minutes while the treatment takes effect. Many patients find this deeply relaxing — some fall asleep. Dr. Vel may incorporate additional modalities during this time: moxibustion, electroacupuncture, or cupping, depending on your treatment plan.",
  },
  {
    step: 7,
    title: "After-Care & Next Steps",
    description:
      "After the needles are removed, Dr. Vel will discuss what to expect over the next few days, any lifestyle or dietary recommendations, and the recommended treatment schedule going forward. Most patients feel relaxed and energized. Some experience continued improvement over the 24-48 hours following treatment.",
  },
];

export const faqs: FAQ[] = [
  {
    question: "Does acupuncture hurt?",
    answer:
      "Most patients feel little to no pain. Acupuncture needles are hair-thin — about the width of a human hair and significantly thinner than the hypodermic needles used for blood draws or injections. You may feel a brief sensation of heaviness, warmth, or tingling at the needle site, which is a normal therapeutic response. Many patients find the experience so relaxing that they fall asleep during treatment.",
  },
  {
    question: "How many sessions will I need?",
    answer:
      "It depends on your condition, its duration, and your overall health. Acute conditions (recent injuries, acute pain) often respond in 3-5 sessions. Chronic conditions that have been present for months or years typically require 8-12 sessions for significant improvement, though many patients notice meaningful changes within the first 3-4 visits. Dr. Vel will give you an honest timeline during your first visit — not a vague commitment.",
  },
  {
    question: "Does insurance cover acupuncture?",
    answer:
      "Insurance coverage for acupuncture varies by provider and plan. Many insurance plans now include acupuncture benefits, and coverage has expanded significantly in recent years. We recommend calling your insurance provider to verify your specific coverage. Our office can provide the documentation and billing codes you need for reimbursement. We also accept HSA and FSA payments.",
  },
  {
    question: "What should I wear?",
    answer:
      "Wear loose, comfortable clothing that can be rolled up above the elbows and knees. Many acupuncture points are located on the forearms, lower legs, abdomen, and back. If your condition requires access to other areas, gowns are available. Avoid wearing heavy perfume or cologne, as the treatment room is a shared healing space.",
  },
  {
    question: "Can I eat before my appointment?",
    answer:
      "Yes — in fact, we recommend it. Arrive neither overly full nor on an empty stomach. A light meal or snack 1-2 hours before your appointment is ideal. Avoid heavy meals, alcohol, and caffeine immediately before treatment. Stay well hydrated.",
  },
  {
    question: "Are there any side effects?",
    answer:
      "Acupuncture is one of the safest medical treatments available when performed by a qualified practitioner. Occasional minor effects include slight bruising at a needle site, temporary fatigue or lightheadedness immediately after treatment, or mild soreness. These are infrequent and resolve quickly. Serious adverse events are extremely rare — Dr. Vel's DACM training includes extensive safety protocols.",
  },
];

export const whatToBring = [
  "Photo ID and insurance card (if applicable)",
  "List of current medications and supplements",
  "Any recent lab results or imaging reports relevant to your condition",
  "Comfortable, loose-fitting clothing",
  "A list of questions — Dr. Vel encourages them",
];
