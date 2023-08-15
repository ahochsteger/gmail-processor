import { V1Rule, newV1Rule } from "./V1Rule"

it("should expect a JSON config", () => {
  const actual = newV1Rule({})
  expect(actual).toMatchObject({
    archive: false,
    filter: "",
    folder: "",
  } as V1Rule)
})
