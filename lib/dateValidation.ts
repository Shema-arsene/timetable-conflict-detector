export const validateTimetableDates = (
  startDate: string,
  endDate: string,
): { valid: boolean; message?: string } => {
  if (!startDate || !endDate) {
    return { valid: false, message: "Start and end dates are required." }
  }

  const start = new Date(startDate)
  const end = new Date(endDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Check if dates are in the future
  if (start < today) {
    return { valid: false, message: "Start date must be in the future." }
  }

  // Calculate difference in weeks
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const diffWeeks = diffDays / 7

  // Check minimum 3 weeks
  if (diffWeeks < 3) {
    return {
      valid: false,
      message: `Timetable must be at least 3 weeks long (currently ${diffWeeks.toFixed(1)} weeks).`,
    }
  }

  // Check maximum 4 weeks
  if (diffWeeks > 4) {
    return {
      valid: false,
      message: `Timetable cannot exceed 4 weeks (currently ${diffWeeks.toFixed(1)} weeks).`,
    }
  }

  // Check if end date is after start date
  if (end <= start) {
    return { valid: false, message: "End date must be after start date." }
  }

  return { valid: true }
}

// Helper to get min and max dates for date pickers
export const getDateConstraints = () => {
  const today = new Date()

  const minStartDate = new Date(today)
  minStartDate.setDate(today.getDate() + 1) // At least tomorrow

  const maxStartDate = new Date(today)
  maxStartDate.setMonth(today.getMonth() + 6) // Reasonable max: 6 months ahead

  return {
    minStartDate: minStartDate.toISOString().split("T")[0],
    maxStartDate: maxStartDate.toISOString().split("T")[0],
  }
}

// Helper to calculate end date based on start date and weeks
export const calculateEndDate = (startDate: string, weeks: number): string => {
  const start = new Date(startDate)
  start.setDate(start.getDate() + weeks * 7)
  return start.toISOString().split("T")[0]
}
