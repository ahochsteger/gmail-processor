import { ConfigSchema, RequiredConfig } from "./Config"

export interface ValidationError {
  message: string
  path: string
}

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: ValidationError[] }

export function validateConfig(config: any): ValidationResult<RequiredConfig> {
  const result = ConfigSchema.strict().safeParse(config)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return {
    success: false,
    errors: result.error.issues.map((e) => ({
      message: e.message,
      path: e.path.join("."),
    })),
  }
}
