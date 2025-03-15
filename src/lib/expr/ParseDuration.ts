// See https://github.com/jkroso/parse-duration/blob/master/index.js that has been the basis for this code.

export const unit = {
  ms: 1,
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
  w: 7 * 24 * 60 * 60 * 1000,
  mo: (365.25 / 12) * 24 * 60 * 60 * 1000,
  y: 365.25 * 24 * 60 * 60 * 1000,
  ns: 1 / 1e6,
  us: 1 / 1000,
  µs: 1 / 1000,
}

type UnitKey = keyof typeof unit

const unitAliases: Record<string, UnitKey> = {
  ms: "ms",
  millisecond: "ms",
  milliseconds: "ms",
  s: "s",
  sec: "s",
  secs: "s",
  second: "s",
  seconds: "s",
  m: "m",
  min: "m",
  mins: "m",
  minute: "m",
  minutes: "m",
  h: "h",
  hr: "h",
  hrs: "h",
  hour: "h",
  hours: "h",
  d: "d",
  day: "d",
  days: "d",
  w: "w",
  wk: "w",
  wks: "w",
  week: "w",
  weeks: "w",
  mo: "mo",
  mth: "mo",
  month: "mo",
  months: "mo",
  y: "y",
  yr: "y",
  yrs: "y",
  year: "y",
  years: "y",
  ns: "ns",
  us: "us",
  µs: "µs",
}

export function parseDuration(
  durationString?: string,
  targetUnit = "ms",
): number | null {
  if (!durationString) return null

  durationString = durationString.trim()
  const combinedRegex = /(?<value>[+-]?\d+(?:\.\d+)?)\s*(?<unit>[a-zA-Zµ]+)?/g
  const matchArray: { value: number; unit: UnitKey | undefined }[] = []
  let match
  let signFactor = 1

  if (durationString.startsWith("-")) {
    signFactor = -1
    durationString = durationString.substring(1).trim()
  }

  while ((match = combinedRegex.exec(durationString)) !== null) {
    const value = parseFloat(match.groups?.value ?? "")
    if (isNaN(value)) return null
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const unitString = match.groups?.unit?.toLowerCase()
    const unitKey = unitString ? unitAliases[unitString] : undefined
    if (unitString && !unitKey) return null
    matchArray.push({ value, unit: unitKey })
  }

  if (matchArray.length === 0) {
    const numberOnly = parseFloat(durationString)
    return isNaN(numberOnly) ? null : numberOnly
  }

  let totalMilliseconds = 0
  for (const { value, unit: unitKey } of matchArray) {
    totalMilliseconds += unitKey ? value * unit[unitKey] : value
  }

  const targetUnitKey = unitAliases[targetUnit.toLowerCase()]
  return (signFactor * totalMilliseconds) / unit[targetUnitKey]
}
