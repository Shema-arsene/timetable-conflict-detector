export const CAMPUSES = ["Kacyiru", "Remera"] as const

export type Campus = (typeof CAMPUSES)[number]
