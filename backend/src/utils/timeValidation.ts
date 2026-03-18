export function isStartTimeInFuture(
  startDate: string,
  startTime: string,
): boolean {
  const start = new Date(`${startDate}T${startTime}`)
  return start.getTime() > Date.now()
}

export function isValidTimeRange(startTime: string, endTime: string): boolean {
  const [sh, sm] = startTime.split(":").map(Number)
  const [eh, em] = endTime.split(":").map(Number)

  return sh * 60 + sm < eh * 60 + em
}
