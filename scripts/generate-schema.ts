import { writeFileSync } from "fs"
import { z } from "zod"
import { ConfigSchema } from "../src/lib/config/Config"
import { V1ConfigSchema } from "../src/lib/config/v1/V1Config"

function deepStrict(schema: any): any {
  const def = schema._def as any
  const description = schema.description
  let resultSchema: any = schema

  if (schema.constructor.name === "ZodObject") {
    const shape = schema.shape
    const newShape: any = {}
    for (const key in shape) {
      newShape[key] = deepStrict(shape[key])
    }
    resultSchema = z.object(newShape).strict()
  } else if (schema.constructor.name === "ZodArray") {
    resultSchema = z.array(deepStrict(schema.element))
  } else if (schema.constructor.name === "ZodOptional") {
    resultSchema = deepStrict(schema.unwrap()).optional()
  } else if (schema.constructor.name === "ZodNullable") {
    resultSchema = deepStrict(schema.unwrap()).nullable()
  } else if (schema.constructor.name === "ZodDefault") {
    let inner = deepStrict(def.innerType)
    resultSchema = inner.default(def.defaultValue)
  }

  if (description && typeof resultSchema.describe === "function") {
    resultSchema = resultSchema.describe(description)
  }

  return resultSchema
}

function generateSchema(schema: any, title: string, filePath: string) {
  const strictSchema = deepStrict(schema)
  const jsonSchema = (z as any).toJSONSchema(strictSchema, { io: "input" })
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
