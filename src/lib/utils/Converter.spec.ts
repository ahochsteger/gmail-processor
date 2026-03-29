import { sha1Hex, sha256Hex } from "./Converter"

describe("Converter", () => {
  describe("sha1Hex", () => {
    it("should calculate correct SHA-1 hash for empty string", () => {
      expect(sha1Hex("")).toBe("da39a3ee5e6b4b0d3255bfef95601890afd80709")
    })

    it("should calculate correct SHA-1 hash for a known string", () => {
      expect(sha1Hex("hello world")).toBe(
        "2aae6c35c94fcfb415dbe95f408b9ce91ee846ed",
      )
    })

    it("should calculate correct SHA-1 hash for a string with special characters", () => {
      expect(sha1Hex("test string with spec!@l ch@racters")).toBe(
        "7632223e4472d1a05036765ade575430efc7468d",
      )
    })
  })

  describe("sha256Hex", () => {
    it("should calculate correct SHA-256 hash for empty string", () => {
      expect(sha256Hex("")).toBe(
        "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      )
    })

    it("should calculate correct SHA-256 hash for a known string", () => {
      expect(sha256Hex("hello world")).toBe(
        "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
      )
    })

    it("should calculate correct SHA-256 hash for a string with special characters", () => {
      expect(sha256Hex("test string with spec!@l ch@racters")).toBe(
        "d608a35ed395dfd53fb8073ad3acdb45de6bb2cb42b1c18599114ee36800a048",
      )
    })
  })
})
