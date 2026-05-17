import { ValidationResult } from "../Validate"
import { RequiredV1Config, V1ConfigSchema } from "./V1Config"

export function validateV1Config(
  config: unknown,
): ValidationResult<RequiredV1Config> {
  const result = V1ConfigSchema.strict().safeParse(config)
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
