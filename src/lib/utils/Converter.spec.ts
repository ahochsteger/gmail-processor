import { sha1Hex, sha256Hex } from "./Converter"

describe("Converter", () => {
  describe("sha1Hex", () => {
    it.each([
      ["empty string", "", "da39a3ee5e6b4b0d3255bfef95601890afd80709"],
      [
        "a known string",
        "hello world",
        "2aae6c35c94fcfb415dbe95f408b9ce91ee846ed",
      ],
      [
        "a string with special characters",
        "test string with spec!@l ch@racters",
        "7632223e4472d1a05036765ade575430efc7468d",
      ],
    ])(
      "should calculate correct SHA-1 hash for %s",
      (_description, input, expected) => {
        expect(sha1Hex(input)).toBe(expected)
      },
    )
  })

  describe("sha256Hex", () => {
    it.each([
      [
        "empty string",
        "",
        "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      ],
      [
        "a known string",
        "hello world",
        "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
      ],
      [
        "a string with special characters",
        "test string with spec!@l ch@racters",
        "d608a35ed395dfd53fb8073ad3acdb45de6bb2cb42b1c18599114ee36800a048",
      ],
    ])(
      "should calculate correct SHA-256 hash for %s",
      (_description, input, expected) => {
        expect(sha256Hex(input)).toBe(expected)
      },
    )
  })
})
