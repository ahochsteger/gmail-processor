import Ajv from "ajv"
import { Config } from "./Config"
import * as schema from "./config-schema-v2.json"

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  strict: false,
  useDefaults: true,
})
export const validateConfig = ajv.compile<Config>(schema, true)
