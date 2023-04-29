import { ValidateFunction } from "ajv"
import fs from "fs"
import { validateConfig } from "../src/config/Validate"
import { validateV1Config } from "../src/config/v1/V1Validate"

let validate: ValidateFunction

if (process.argv.length < 4) {
  console.log("Missing arguments!\nUsage: <configVersion> <files...>")
}
const configVersion = process.argv[2]
if (configVersion == "v1") {
  validate = validateV1Config
} else if (configVersion == "v2") {
  validate = validateConfig
} else {
  console.error(`Unsupported config version: ${configVersion}`)
  process.exit(1)
}
const dataFiles = process.argv.slice(3)
dataFiles.forEach((f) => {
  const data = JSON.parse(fs.readFileSync(f).toString())
  validate(data)
  if (validate.errors) {
    console.error(`There are validation errors in file ${f}:`)
    console.error(validate.errors)
    process.exit(1)
  } else {
    console.log(`${f} is valid.`)
  }
})
