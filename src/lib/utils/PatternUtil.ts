import { Context, MetaInfo } from "../Context"
import { ExprEvaluator } from "../expr/ExprEvaluator"

export class PatternUtil {
  public static substitute(ctx: Context, s: string) {
    return ExprEvaluator.evaluate(ctx, s)
  }

  public static stringValue(ctx: Context, key: string, m: MetaInfo = ctx.meta) {
    return ExprEvaluator.evaluate(ctx, `\${${key}}`, m)
  }
}
