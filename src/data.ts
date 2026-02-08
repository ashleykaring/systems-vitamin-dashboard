export type VitaminKey = 'vitaminD' | 'calcium' | 'thiamine'

export type Reading = {
  date: string
  vitaminD: number
  calcium: number
  thiamine: number
  notes?: string
}

export const vitaminMeta: Record<
  VitaminKey,
  {
    label: string
    unit: string
    low: number
    high: number
    goal: number
    description: string
    tips: string[]
  }
> = {
  vitaminD: {
    label: 'Vitamin D',
    unit: 'ng/mL',
    low: 30,
    high: 80,
    goal: 50,
    description:
      'Vitamin D supports bone density, immune function, and mood regulation. It is synthesized through sun exposure and can be bolstered with diet or supplements.',
    tips: [
      'Aim for consistent, brief sun exposure when possible.',
      'Include fortified dairy or plant milks and fatty fish.',
      'Consider a D3 supplement if levels stay low.',
    ],
  },
  calcium: {
    label: 'Calcium',
    unit: 'mg/dL',
    low: 8.6,
    high: 10.2,
    goal: 9.4,
    description:
      'Calcium is critical for bones, teeth, and muscle contraction. Balance intake with vitamin D for optimal absorption.',
    tips: [
      'Prioritize calcium-rich foods like yogurt, tofu, and leafy greens.',
      'Spread intake through the day for better absorption.',
      'Pair with vitamin D to support uptake.',
    ],
  },
  thiamine: {
    label: 'B1 (Thiamine)',
    unit: 'nmol/L',
    low: 70,
    high: 180,
    goal: 110,
    description:
      'Thiamine helps convert food into energy and supports nerve function. It is water-soluble and benefits from steady intake.',
    tips: [
      'Include whole grains, legumes, and seeds.',
      'Limit excessive alcohol, which can lower levels.',
      'Add fortified cereals if intake is inconsistent.',
    ],
  },
}

export const readings: Reading[] = [
  { date: '2025-02-12', vitaminD: 26, calcium: 8.7, thiamine: 78, notes: 'Initial baseline' },
  { date: '2025-03-15', vitaminD: 31, calcium: 8.9, thiamine: 82 },
  { date: '2025-04-12', vitaminD: 34, calcium: 9.2, thiamine: 88, notes: 'Added vitamin D supplement' },
  { date: '2025-05-17', vitaminD: 38, calcium: 9.1, thiamine: 90 },
  { date: '2025-06-14', vitaminD: 42, calcium: 9.3, thiamine: 97, notes: 'Increased outdoor activity' },
  { date: '2025-07-12', vitaminD: 49, calcium: 9.5, thiamine: 104 },
  { date: '2025-08-16', vitaminD: 55, calcium: 9.6, thiamine: 112 },
  { date: '2025-09-14', vitaminD: 58, calcium: 9.4, thiamine: 117 },
  { date: '2025-10-12', vitaminD: 52, calcium: 9.3, thiamine: 109, notes: 'Travel, lower sun exposure' },
  { date: '2025-11-16', vitaminD: 46, calcium: 9.2, thiamine: 106 },
  { date: '2025-12-14', vitaminD: 43, calcium: 9.1, thiamine: 101 },
  { date: '2026-01-11', vitaminD: 45, calcium: 9.4, thiamine: 108, notes: 'Supplement adjusted' },
  { date: '2026-02-08', vitaminD: 48, calcium: 9.6, thiamine: 114, notes: 'Latest check-in' },
]
