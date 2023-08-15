describe("Object", () => {
  it("should provide a working assign method", () => {
    const targetObject = {
      a: "a",
    }
    const sourceObject = {
      b: "b",
    }
    const expectedObject = {
      a: "a",
      b: "b",
    }
    const resultingObject = Object.assign(targetObject, sourceObject)
    expect(targetObject).toStrictEqual(expectedObject)
    expect(resultingObject).toStrictEqual(expectedObject)
  })
})
