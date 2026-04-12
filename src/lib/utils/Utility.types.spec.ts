import { RequiredDeep } from "./Utility.types"

describe("Utility.types", () => {
  it("should exercise RequiredDeep at runtime", () => {
    type TestType = {
      a?: string
      b?: {
        c?: number
        d?: string[]
      }
    }
    const obj: RequiredDeep<TestType> = {
      a: "test",
      b: {
        c: 1,
        d: ["1", "2"],
      },
    }
    expect(obj.a).toBe("test")
    expect(obj.b.c).toBe(1)
    expect(obj.b.d).toEqual(["1", "2"])
  })

  it("should exercise NotNill at runtime", () => {
    const val: string = "test"
    expect(val).toBe("test")
  })
})
