import Ajv from "ajv"
import { V1Config } from "./V1Config"
import * as schema from "./config-schema-v1.json"

const ajv = new Ajv({
  allErrors: true,
  strict: false,
  useDefaults: true,
})
export const validateV1Config = ajv.compile<V1Config>(schema, true)
