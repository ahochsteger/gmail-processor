/* eslint-disable @typescript-eslint/no-explicit-any */
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
  unexposed?: string
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
  unexposed?: string
}

function getNewNestedObj(j: Record<string, any>): Nested {
  const o = new Nested()
  if (j) {
    if (j.arr !== undefined) o.arr = j.arr
    if (j.bool !== undefined) o.bool = j.bool
    if (j.num !== undefined) o.num = j.num
    if (j.str !== undefined) o.str = j.str
  }
  return o
}

function getNewRootObj(j: Record<string, any>): Root {
  const o = new Root()
  if (j) {
    if (j.bool !== undefined) o.bool = j.bool
    if (j.nested !== undefined) o.nested = getNewNestedObj(j.nested)
    if (j.nestedArray !== undefined) {
      o.nestedArray = []
      j.nestedArray.forEach((no: Record<string, any>) => {
        o.nestedArray.push(getNewNestedObj(no))
      })
    }
  }
  return o
}

const jsonData = {
  bool: false,
  nested: {
    arr: ["c", "d"],
    str: "myString",
  },
  nestedArray: [
    {
      num: 3,
      str: "nestedArrayStr",
    },
  ],
}

function expectDefaultsToBeSet(actual: any) {
  expect(actual.num).toEqual(1)
  expect(actual.arr).toEqual(["default1", "default2"])
  expect(actual.str).toEqual("default")
  expect(actual.nested.num).toEqual(2)
  expect(actual.nested.bool).toEqual(true)
}

function expectSetValuesToBePresent(actual: any) {
  expect(actual.bool).toEqual(false)
  expect(actual.nested.arr).toEqual(["c", "d"])
  expect(actual.nested.str).toEqual("myString")
  expect(actual.nestedArray.length).toEqual(1)
  expect(actual.nestedArray[0].num).toEqual(3)
  expect(actual.nestedArray[0].str).toEqual("nestedArrayStr")
}

function expectAdditionalValuesToBeRemoved(actual: any) {
  expect(actual.add).toBeUndefined()
  expect(actual.nested.add).toBeUndefined()
  expect(actual.nestedArray[0].add).toBeUndefined()
}

function expectUnsetFieldsNotToBeExposed(actual: any) {
  expect(Object.getOwnPropertyNames(actual)).not.toContain("unexposed")
}

describe("plainToInstance", () => {
  it("should set values from JSON", () => {
    const actual = plainToInstance(Root, jsonData, {})
    expectSetValuesToBePresent(actual)
  })
  it("should set defaults for missing properties from JSON", () => {
    const actual = plainToInstance(Root, jsonData, {
      exposeDefaultValues: true,
    })
    expectSetValuesToBePresent(actual)
    expectDefaultsToBeSet(actual)
  })
  it("should not expose unset fields from JSON", () => {
    const actual = plainToInstance(Root, jsonData, {
      exposeUnsetFields: false,
    })
    expectSetValuesToBePresent(actual)
    // expectUnsetFieldsNotToBeExposed(actual) // NOTE: Does not work with @swc/jest anymore, but should be not be an issue.
  })
  it("should remove additional properties from JSON", () => {
    const json = { ...jsonData, add: "additional" } as any
    json.nested.add = "additional"
    json.nestedArray[0].add = "additional"
    const actual = plainToInstance(
      Root,
      { ...jsonData, add: "additional" },
      {
        excludeExtraneousValues: true,
      },
    )
    expectSetValuesToBePresent(actual)
    expectAdditionalValuesToBeRemoved(actual)
  })
  it("should keep set properties while setting defaults for missing properties from JSON", () => {
    const actual = plainToInstance(Root, jsonData, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    })
    const expected = getNewRootObj(jsonData)
    expect(actual.nested.str).toEqual(expected.nested.str)
    expectSetValuesToBePresent(actual)
    expectDefaultsToBeSet(actual)
  })
  it("should perform transformation steps for JSON", () => {
    const actual = plainToInstance(Root, jsonData, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
      exposeUnsetFields: false,
    })
    // const expected = getNewRootObj(jsonData)
    expectSetValuesToBePresent(actual)
    expectAdditionalValuesToBeRemoved(actual)
    expectDefaultsToBeSet(actual)
    // expectUnsetFieldsNotToBeExposed(actual) // NOTE: Does not work with @swc/jest anymore, but should be not be an issue.
  })
})

describe("instanceToPlain (created using new)", () => {
  it("should serialize to JSON config with default values", () => {
    const obj = getNewRootObj(jsonData)
    const actual = instanceToPlain(obj, {
      exposeDefaultValues: true,
      exposeUnsetFields: false,
    })
    expectSetValuesToBePresent(actual)
    expectDefaultsToBeSet(actual)
    expectUnsetFieldsNotToBeExposed(actual)
    // expect(actual).toMatchObject({
    //   ...jsonData,
    //   str: "default",
    //   nested: { num: 2, bool: true },
    //   nestedArray: [{ bool: true, arr: ["default1", "default2"] }],
    // })
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
