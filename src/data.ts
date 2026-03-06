export type VitaminKey = "vitaminD" | "calcium" | "thiamine";

export type Level = "low" | "med" | "high";

export type MetricState = {
  level: Level;
};

export type Reading = {
  date: string;
  vitaminD: MetricState;
  calcium: MetricState;
  thiamine: MetricState;
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
  thiamine: {
    label: "B1 (Thiamine)",
    targetState: "Med",
    description:
      "Thiamine helps convert food into energy and supports nerve function. Status tracking highlights category transitions and consistency.",
    tips: [
      "Include whole grains, legumes, and seeds.",
      "Limit excessive alcohol, which can lower status.",
      "Use fortified options when dietary consistency drops.",
    ],
  },
};

export const readings: Reading[] = [
  {
    date: "2025-02-12",
    vitaminD: { level: "low" },
    calcium: { level: "med" },
    thiamine: { level: "low" },
    notes: "Initial baseline",
  },
  {
    date: "2025-03-15",
    vitaminD: { level: "med" },
    calcium: { level: "med" },
    thiamine: { level: "med" },
  },
  {
    date: "2025-04-12",
    vitaminD: { level: "med" },
    calcium: { level: "med" },
    thiamine: { level: "med" },
    notes: "Added vitamin D supplement",
  },
  {
    date: "2025-05-17",
    vitaminD: { level: "med" },
    calcium: { level: "med" },
    thiamine: { level: "med" },
  },
  {
    date: "2025-06-14",
    vitaminD: { level: "med" },
    calcium: { level: "med" },
    thiamine: { level: "med" },
    notes: "Increased outdoor activity",
  },
  {
    date: "2025-07-12",
    vitaminD: { level: "med" },
    calcium: { level: "med" },
    thiamine: { level: "med" },
  },
  {
    date: "2025-08-16",
    vitaminD: { level: "high" },
    calcium: { level: "med" },
    thiamine: { level: "med" },
  },
  {
    date: "2025-09-14",
    vitaminD: { level: "high" },
    calcium: { level: "med" },
    thiamine: { level: "high" },
  },
  {
    date: "2025-10-12",
    vitaminD: { level: "med" },
    calcium: { level: "med" },
    thiamine: { level: "med" },
    notes: "Travel period",
  },
  {
    date: "2025-11-16",
    vitaminD: { level: "med" },
    calcium: { level: "med" },
    thiamine: { level: "med" },
  },
  {
    date: "2025-12-14",
    vitaminD: { level: "med" },
    calcium: { level: "med" },
    thiamine: { level: "med" },
  },
  {
    date: "2026-01-11",
    vitaminD: { level: "med" },
    calcium: { level: "med" },
    thiamine: { level: "med" },
    notes: "Routine adjusted",
  },
  {
    date: "2026-02-08",
    vitaminD: { level: "med" },
    calcium: { level: "med" },
    thiamine: { level: "med" },
    notes: "Latest check-in",
  },
];
