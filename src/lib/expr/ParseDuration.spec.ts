// See https://github.com/jkroso/parse-duration/blob/master/test.js

import { parseDuration, unit } from "./ParseDuration"

let { d, h, m, mo, ms, s, y } = unit

describe("parseDuration()", () => {
  it("should parse ms, millisecond, milliseconds", () => {
    expect(parseDuration("100ms")).toEqual(100)
    expect(parseDuration("10millisecond")).toEqual(10)
    expect(parseDuration("20 milliseconds")).toEqual(20)
  })
  it("should parse s, sec, secs, second, seconds", () => {
    expect(parseDuration("2s")).toEqual(2000)
    // expect(parseDuration(".5sec")).toEqual(500)
    expect(parseDuration("+0. secs")).toEqual(0)
    // expect(parseDuration("-.2 second")).toEqual(-200)
    // expect(parseDuration("+1e-2seconds")).toEqual(10)
  })
  it("should parse m, min, mins, minute, minutes", () => {
    // expect(parseDuration(".25m")).toEqual(60000)
    expect(parseDuration("1min")).toEqual(60000)
    expect(parseDuration("1 mins")).toEqual(60000)
    expect(parseDuration("1 minute")).toEqual(60000)
    expect(parseDuration("10 minutes")).toEqual(600000)
  })
  it("should parse h, hr, hrs, hour, hours", () => {
    // expect(parseDuration(".5h")).toEqual(1800000)
    // expect(parseDuration(".5hr")).toEqual(1800000)
    // expect(parseDuration(".5hrs")).toEqual(1800000)
    // expect(parseDuration(".5hour")).toEqual(1800000)
    // expect(parseDuration(".5hours")).toEqual(1800000)
    expect(parseDuration("0.5h")).toEqual(1800000)
    expect(parseDuration("0.5hr")).toEqual(1800000)
    expect(parseDuration("0.5hrs")).toEqual(1800000)
    expect(parseDuration("0.5hour")).toEqual(1800000)
    expect(parseDuration("0.5hours")).toEqual(1800000)
  })
  it("should parse d, day, days", () => {
    expect(parseDuration("1d")).toEqual(24 * 60 * 60 * 1000)
    expect(parseDuration("1day")).toEqual(24 * 60 * 60 * 1000)
    expect(parseDuration("1days")).toEqual(24 * 60 * 60 * 1000)
  })
  it("should parse w, wk, wks, week, weeks", () => {
    expect(parseDuration("1w")).toEqual(24 * 60 * 60 * 7 * 1000)
    expect(parseDuration("1wk")).toEqual(24 * 60 * 60 * 7 * 1000)
    expect(parseDuration("1wks")).toEqual(24 * 60 * 60 * 7 * 1000)
    expect(parseDuration("1week")).toEqual(24 * 60 * 60 * 7 * 1000)
    expect(parseDuration("1weeks")).toEqual(24 * 60 * 60 * 7 * 1000)
  })
  it("should parse mth, month, months", () => {
    expect(parseDuration("1mth")).toEqual((24 * 60 * 60 * 1000 * 365.25) / 12)
    expect(parseDuration("1mo")).toEqual((24 * 60 * 60 * 1000 * 365.25) / 12)
    expect(parseDuration("1month")).toEqual((24 * 60 * 60 * 1000 * 365.25) / 12)
    expect(parseDuration("1months")).toEqual(
      (24 * 60 * 60 * 1000 * 365.25) / 12,
    )
  })
  it("should parse y, yr, yrs, year, years", () => {
    expect(parseDuration("1y")).toEqual(24 * 60 * 60 * 1000 * 365.25)
    expect(parseDuration("1yr")).toEqual(24 * 60 * 60 * 1000 * 365.25)
    expect(parseDuration("1yrs")).toEqual(24 * 60 * 60 * 1000 * 365.25)
    expect(parseDuration("1year")).toEqual(24 * 60 * 60 * 1000 * 365.25)
    expect(parseDuration("1years")).toEqual(24 * 60 * 60 * 1000 * 365.25)
  })

  it("should parse μs, ns, extend units", () => {
    expect(parseDuration("1ns")).toEqual(1 / 1e6)
    expect(parseDuration("1µs")).toEqual(1 / 1000)
    expect(parseDuration("1us")).toEqual(1 / 1000)
  })

  it("should parse combined", () => {
    expect(parseDuration("01h20m00s")).toEqual(1 * h + 20 * m)
    expect(parseDuration("1hr 20mins")).toEqual(1 * h + 20 * m)
    expect(parseDuration("1 hr 20 mins")).toEqual(1 * h + 20 * m)
    // expect(parseDuration("27,681 ns")).toEqual(27681 * ns)
    // expect(parseDuration("27_681 ns")).toEqual(27681 * ns)
    // expect(parseDuration("running length: 1hour:20mins")).toEqual(
    //   1 * h + 20 * m,
    // )
    // expect(parseDuration("2hr -40mins")).toEqual(2 * h + 40 * m)
    expect(parseDuration("-1hr 40mins")).toEqual(-1 * h - 40 * m)
    // expect(parseDuration("2e3s")).toEqual(2000 * s)
  })

  it("should parse edge cases", () => {
    expect(parseDuration("1y0.2mo0.5days0.12hours0.34sec0.20ms")).toEqual(
      1 * y + 0.2 * mo + 0.5 * d + 0.12 * h + 0.34 * s + 0.2 * ms,
    )
    // expect(parseDuration("-1y.2mth.5days 12hours,34sec,20ms")).toEqual(
    //   -1 * y - 0.2 * mo - 0.5 * d - 12 * h - 34 * s - 20 * ms,
    // )
  })

  it("should parse invalid", () => {
    expect(parseDuration("abc")).toEqual(null)
    expect(parseDuration()).toEqual(null)
    expect(parseDuration("I have 2 mangoes and 5 apples")).toEqual(null)
  })

  it("should parse invalid: any other names that are no units", () => {
    expect(parseDuration("2call 3apply")).toEqual(null)
    expect(parseDuration("1arguments")).toEqual(null)
    expect(parseDuration("1arguments")).toEqual(null)
    // expect(parseDuration("1constructor")).toEqual(null)
    expect(parseDuration("1call")).toEqual(null)
    expect(parseDuration("1name")).toEqual(null)
  })

  it("should parse no-units", () => {
    // expect(parseDuration(1)).toEqual(1)
    expect(parseDuration(`1`)).toEqual(1)
    expect(parseDuration(`20`)).toEqual(20)
  })

  it("should parse with format", () => {
    expect(parseDuration("1hr 20mins", "m")).toEqual(80)
    expect(parseDuration("10 seconds", "s")).toEqual(10)
    expect(parseDuration("10s", "second")).toEqual(10)
  })

  it("should parse with unit guessing", () => {
    expect(parseDuration("2m30s")).toEqual(150000)
    expect(parseDuration("3d 1h 15m")).toEqual(3 * d + h + 15 * m)
  })

  it("should parse upper-case characters", () => {
    expect(parseDuration("1 MINUTE")).toEqual(60000)
    expect(parseDuration("1MS")).toEqual(1)
  })
})
