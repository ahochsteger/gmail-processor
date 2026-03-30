import { essentialObject } from "./ConfigUtils"

describe("essentialObject", () => {
  it("should remove properties that match default values", () => {
    const obj = { a: 1, b: 2 }
    const defaultObj = { a: 1, b: 0 }
    const result = essentialObject(obj, defaultObj)
    expect(result).toEqual({ b: 2 })
    expect(result.a).toBeUndefined()
  })

  it("should remove null properties", () => {
    const obj = { a: null as any, b: 2 }
    const defaultObj = { a: 1, b: 0 }
    const result = essentialObject(obj, defaultObj)
    expect(result).toEqual({ b: 2 })
  })

  it("should remove empty arrays and empty objects", () => {
    const obj = { a: [], b: {}, c: [1] }
    const defaultObj = { a: [1], b: { x: 1 }, c: [] } as any
    const result = essentialObject(obj, defaultObj)
    expect(result).toEqual({ c: [1] })
  })

  it("should NOT remove required properties even if they match default", () => {
    const obj = { a: 1, b: 2 }
    const defaultObj = { a: 1, b: 2 }
    const result = essentialObject(obj, defaultObj, {}, ["a"])
    expect(result).toEqual({ a: 1 })
  })

  it("should NOT remove required properties even if they are null or empty", () => {
    const obj = { a: null as any, b: [] as any, c: {} as any }
    const defaultObj = { a: 1, b: [1], c: { x: 1 } }
    const result = essentialObject(obj, defaultObj, {}, ["a", "b", "c"])
    expect(result).toEqual({ a: null, b: [], c: {} })
  })

  it("should use propEssentialMap for sub-objects", () => {
    const obj = {
      sub: { a: 1, b: 2 },
      other: 3,
    }
    const defaultObj = {
      sub: { a: 1 },
      other: 0,
    }
    const propEssentialMap = {
      sub: (o: any) => {
        if (o.a === 1) delete o.a
        return o
      },
    }
    const result = essentialObject(obj, defaultObj as any, propEssentialMap)
    // sub becomes {b: 2} after essentialFn.
    // {b: 2} != {a: 1}, so it stays.
    expect(result).toEqual({ sub: { b: 2 }, other: 3 })
  })

  it("should remove sub-object if it becomes empty and not required", () => {
    const obj = {
      sub: { a: 1 },
    }
    const defaultObj = {
      sub: { a: 1 },
    }
    const propEssentialMap = {
      sub: (o: any) => {
        delete o.a
        return o
      },
    }
    const result = essentialObject(obj, defaultObj as any, propEssentialMap)
    // sub becomes {} after essentialFn.
    // {} is one of the removal criteria.
    expect(result).toEqual({})
  })

  it("should use propEssentialMap for arrays of objects", () => {
    const obj = {
      list: [
        { a: 1, b: 2 },
        { a: 1, b: 3 },
      ],
    }
    const defaultObj = {
      list: [],
    }
    const propEssentialMap = {
      list: (o: any) => {
        if (Array.isArray(o)) {
          o.forEach((item) => delete item.a)
        }
        return o
      },
    }
    const result = essentialObject(obj, defaultObj as any, propEssentialMap)
    expect(result).toEqual({
      list: [{ b: 2 }, { b: 3 }],
    })
  })

  it("should handle nested essentialObject calls through propEssentialMap", () => {
    const obj = {
      sub: { a: 1, b: 2 },
    }
    const defaultObj = {
      sub: { a: 1, b: 0 },
    }
    const propEssentialMap = {
      sub: (o: any) => essentialObject(o, { a: 1, b: 0 }),
    }
    const result = essentialObject(obj, defaultObj as any, propEssentialMap)
    // inner essentialObject( {a:1, b:2}, {a:1, b:0} ) -> {b: 2}
    // outer essentialObject compares {b:2} with {a:1, b:0} -> different, so keeps {b:2}
    expect(result).toEqual({ sub: { b: 2 } })
  })

  it("should remove property if it matches default after essentialFn processing", () => {
    const obj = {
      sub: { a: 1, b: 2 },
    }
    const defaultObj = {
      sub: { a: 1 },
    }
    const propEssentialMap = {
      sub: (o: any) => {
        delete o.b
        return o
      },
    }
    const result = essentialObject(obj, defaultObj as any, propEssentialMap)
    // sub becomes {a: 1} which matches defaultObj.sub
    expect(result).toEqual({})
  })
})
