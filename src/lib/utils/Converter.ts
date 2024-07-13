import sha1 from "crypto-js/sha1"
import sha256 from "crypto-js/sha256"

export function sha1Hex(s: string): string {
  return sha1(s).toString()
}

export function sha256Hex(s: string): string {
  return sha256(s).toString()
}
