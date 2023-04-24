import {
  Expose,
  Transform,
  Type,
  instanceToPlain,
  plainToInstance,
} from "class-transformer"
import "reflect-metadata"

class Nested {
  @Expose() num? = 2
  @Expose() bool? = true
  @Type(() => String)
  @Expose()
  arr: string[] = ["default1", "default2"]
  @Expose() str = "default"
}
class Root {
  @Expose() num? = 1
  @Expose() bool? = true
  @Expose()
  @Type(() => String)
  arr: string[] = ["default1", "default2"]
  @Expose() str = "default"
  @Expose()
  @Type(() => Nested)
  nested = new Nested()
  @Expose()
  @Type(() => Nested)
  @Transform(
    ({ value }) =>
      Array.isArray(value) && value.length === 0 ? undefined : value,
    { toPlainOnly: true },
  )
  nestedArray: Nested[] = []
}

function getNewRootObj(j: Record<string, any>): Root {
  const o = new Root()
  if (j) {
    o.bool = j.bool
    o.nested.arr = j.nested.arr
    o.nested.str = j.nested.str
    const no = new Nested()
    no.num = j.nestedArray[0].num
    no.str = j.nestedArray[0].str
    o.nestedArray = [no]
  }
  return o
}

const jsonData = {
  bool: false,
  nested: {
    arr: ["c", "d"],
    str: "mystring",
  },
  nestedArray: [
    {
      num: 3,
      str: "nestedArrayStr",
    },
  ],
}

const plainToInstanceTransformOptions = {
  exposeDefaultValues: true,
  excludeExtraneousValues: true,
  exposeUnsetFields: false,
}
describe("plainToInstance", () => {
  it("should set defaults for missing properties from JSON", () => {
    {
      const actual = plainToInstance(Root, jsonData, {
        exposeDefaultValues: true,
      })
      const expected = getNewRootObj(jsonData)
      expect(actual).toMatchObject(expected)
    }
  })
  it("should remove additional properties from JSON", () => {
    {
      const actual = plainToInstance(
        Root,
        { ...jsonData, add: "additional" },
        plainToInstanceTransformOptions,
      )
      const expected = getNewRootObj(jsonData)
      expect(actual).toMatchObject(expected)
      expect((actual as any).add).toBeUndefined()
      expect(actual.nested.str).toEqual("mystring")
    }
  })
})

describe("instanceToPlain (created using new)", () => {
  it("should serialize to JSON config with default values", () => {
    const obj = getNewRootObj(jsonData)
    const actual = instanceToPlain(obj, { exposeDefaultValues: true })
    expect(actual).toMatchObject({
      ...jsonData,
      str: "default",
      nested: { num: 2, bool: true },
      nestedArray: [{ bool: true, arr: ["default1", "default2"] }],
    })
  })
  test.todo("should serialize to JSON config without default values")
  // it("should serialize to JSON config without default values", () => {
  //   const obj = getNewRootObj(jsonData)
  //   const actual: any = instanceToPlain(obj, { exposeDefaultValues: false, exposeUnsetFields: false })
  //   expect(actual).toMatchObject(jsonData)
  //   expect(actual.str).toBeUndefined()
  //   expect(actual.nested?.num).toBeUndefined()
  //   expect(actual.nested?.bool).toBeUndefined()
  //   expect(actual.nestedArray[0]?.bool).toBeUndefined()
  //   expect(actual.nestedArray[0]?.arr).toBeUndefined()
  // })
  it("should serialize to JSON config empty arrays removed", () => {
    const obj = new Root()
    const actual = instanceToPlain(obj, { exposeDefaultValues: false })
    expect(actual.nestedArray).toBeUndefined()
  })
})

describe("instanceToPlain (created using plainToInstance)", () => {
  it("should serialize to JSON config with default values", () => {
    const obj = plainToInstance(Root, jsonData)
    const actual = instanceToPlain(obj, {
      exposeDefaultValues: true,
    })
    expect(actual).toEqual({ ...jsonData })
  })
  it("should serialize to JSON config without default values", () => {
    const obj = plainToInstance(Root, jsonData)
    const actual = instanceToPlain(obj, { exposeDefaultValues: false })
    expect(actual).toEqual(jsonData)
  })
  it("should serialize to JSON config empty arrays removed", () => {
    const actual = instanceToPlain(new Root(), { exposeDefaultValues: false })
    expect(actual.nestedArray).toBeUndefined()
  })
})
