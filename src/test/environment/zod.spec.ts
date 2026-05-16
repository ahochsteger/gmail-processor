import { z } from "zod"

describe("Zod Environment Tests", () => {
  const Schema = z.object({
    numberField: z.number().default(123),
    stringField: z.string().optional(),
    booleanField: z.boolean().default(true),
    enumField: z.enum(["a", "b", "c"]).default("a"),
  })

  it("should parse valid input", () => {
    const input = {
      numberField: 456,
      stringField: "test",
      booleanField: false,
      enumField: "b",
    }
    const result = Schema.parse(input)
    expect(result).toEqual(input)
  })

  it("should apply defaults for missing fields", () => {
    const input = {}
    const result = Schema.parse(input)
    expect(result).toEqual({
      numberField: 123,
      booleanField: true,
      enumField: "a",
    })
  })

  it("should throw for invalid input", () => {
    expect(() => Schema.parse({ numberField: "not-a-number" })).toThrow()
  })

  it("should support nested schemas", () => {
    const NestedSchema = z.object({
      nested: Schema,
    })
    const input = {
      nested: {
        numberField: 789,
      },
    }
    const result = NestedSchema.parse(input)
    expect(result.nested.numberField).toBe(789)
    expect(result.nested.booleanField).toBe(true)
  })

  it("should support type inference", () => {
    type inferredType = z.infer<typeof Schema>
    const val: inferredType = {
      numberField: 1,
      booleanField: true,
      enumField: "c",
      stringField: "s",
    }
    expect(val.stringField).toBe("s")
  })

  it("should support safeParse for validation without throwing", () => {
    const result = Schema.safeParse({ numberField: "not-a-number" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("numberField")
    }
  })

  it("should preserve nested any properties", () => {
    const schema = z.object({
      name: z.string(),
      args: z.any().optional(),
    })
    const input = {
      name: "test",
      args: {
        key1: "val1",
        key2: { nested: "val2" },
      },
      extra: "stripped",
    }
    const result = schema.parse(input)
    expect(result.name).toBe("test")
    expect(result.args).toEqual({
      key1: "val1",
      key2: { nested: "val2" },
    })
    expect((result as any).extra).toBeUndefined()
  })
})
