import { writeFileSync } from "fs"
import { z } from "zod"
import { ConfigSchema } from "../src/lib/config/Config"
import { V1ConfigSchema } from "../src/lib/config/v1/V1Config"

function generateSchema(schema: any, title: string, filePath: string) {
  const jsonSchema = (z as any).toJSONSchema(schema)
  jsonSchema.title = title
  writeFileSync(filePath, JSON.stringify(jsonSchema, null, 2))
  console.log(`Generated schema: ${filePath}`)
}

generateSchema(
  V1ConfigSchema,
  "GMail2GDrive Config (v1)",
  "src/lib/config/v1/config-schema-v1.json",
)
generateSchema(
  ConfigSchema,
  "Gmail Processor Config (v2)",
  "src/lib/config/config-schema-v2.json",
)
