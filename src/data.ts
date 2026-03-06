export type VitaminKey = "vitaminD" | "calcium" | "vitaminC" | "copper";

export type Level = "low" | "med" | "high";

export type MetricState = {
  level: Level;
};

export type Reading = {
  date: string;
  vitaminD: MetricState;
  calcium: MetricState;
  vitaminC: MetricState;
  copper: MetricState;
  notes?: string;
};

export const vitaminMeta: Record<
  VitaminKey,
  {
    label: string;
    targetState: string;
    description: string;
    tips: string[];
  }
> = {
  vitaminD: {
    label: "Vitamin D",
    targetState: "Med",
    description:
      "Vitamin D supports bone density, immune function, and mood regulation. This dashboard tracks category status only: Low, Med, or High.",
    tips: [
      "Aim for consistent, brief sun exposure when possible.",
      "Include fortified dairy or plant milks and fatty fish.",
      "Use a clinician-guided supplement plan if status trends Low.",
    ],
  },
  calcium: {
    label: "Calcium",
    targetState: "Med",
    description:
      "Calcium is critical for bones, teeth, and muscle function. This view focuses on categorical status movement over time rather than numeric lab values.",
    tips: [
      "Prioritize calcium-rich foods like yogurt, tofu, and leafy greens.",
      "Spread intake through the day for better absorption.",
      "Pair with vitamin D habits to support uptake.",
    ],
  },
  vitaminC: {
    label: "Vitamin C",
    targetState: "Med",
    description:
      "Vitamin C supports immune defense, collagen production, and antioxidant balance. Status tracking highlights category transitions and consistency.",
    tips: [
      "Include citrus, berries, peppers, and broccoli regularly.",
      "Favor fresh or lightly cooked produce to preserve content.",
      "Use food-first routines and only supplement when needed.",
    ],
  },
  copper: {
    label: "Copper",
    targetState: "Med",
    description:
      "Copper supports iron metabolism, connective tissue formation, and nervous system function. Category tracking shows whether status is Low, Med, or High over time.",
    tips: [
      "Include shellfish, nuts, seeds, and legumes regularly.",
      "Avoid excessive zinc-only supplementation without guidance.",
      "Use balanced multinutrient routines when intake is inconsistent.",
    ],
  },
};

export const readings: Reading[] = [
  {
    date: "2025-02-12",
    vitaminD: { level: "low" },
    calcium: { level: "low" },
    vitaminC: { level: "low" },
    copper: { level: "med" },
    notes: "Initial baseline",
  },
  {
    date: "2025-03-15",
    vitaminD: { level: "med" },
    calcium: { level: "low" },
    vitaminC: { level: "med" },
    copper: { level: "low" },
  },
  {
    date: "2025-04-12",
    vitaminD: { level: "med" },
    calcium: { level: "med" },
    vitaminC: { level: "high" },
    copper: { level: "med" },
    notes: "Added vitamin D supplement",
  },
  {
    date: "2025-05-17",
    vitaminD: { level: "high" },
    calcium: { level: "med" },
    vitaminC: { level: "high" },
    copper: { level: "high" },
  },
  {
    date: "2025-06-14",
    vitaminD: { level: "high" },
    calcium: { level: "high" },
    vitaminC: { level: "med" },
    copper: { level: "high" },
    notes: "Increased outdoor activity",
  },
  {
    date: "2025-07-12",
    vitaminD: { level: "med" },
    calcium: { level: "high" },
    vitaminC: { level: "low" },
    copper: { level: "med" },
  },
  {
    date: "2025-08-16",
    vitaminD: { level: "high" },
    calcium: { level: "med" },
    vitaminC: { level: "low" },
    copper: { level: "low" },
  },
  {
    date: "2025-09-14",
    vitaminD: { level: "high" },
    calcium: { level: "low" },
    vitaminC: { level: "high" },
    copper: { level: "low" },
  },
  {
    date: "2025-10-12",
    vitaminD: { level: "low" },
    calcium: { level: "med" },
    vitaminC: { level: "med" },
    copper: { level: "med" },
    notes: "Travel period",
  },
  {
    date: "2025-11-16",
    vitaminD: { level: "med" },
    calcium: { level: "high" },
    vitaminC: { level: "high" },
    copper: { level: "high" },
  },
  {
    date: "2025-12-14",
    vitaminD: { level: "low" },
    calcium: { level: "high" },
    vitaminC: { level: "med" },
    copper: { level: "high" },
  },
  {
    date: "2026-01-11",
    vitaminD: { level: "med" },
    calcium: { level: "med" },
    vitaminC: { level: "low" },
    copper: { level: "med" },
    notes: "Routine adjusted",
  },
  {
    date: "2026-02-08",
    vitaminD: { level: "high" },
    calcium: { level: "high" },
    vitaminC: { level: "med" },
    copper: { level: "high" },
    notes: "Latest check-in",
  },
];
