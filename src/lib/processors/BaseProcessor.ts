import { ProcessingContext } from "../Context"
import { ActionArgsType } from "../actions/ActionRegistry"
import { ActionConfig, ProcessingStage } from "../config/ActionConfig"

export abstract class BaseProcessor {
  protected static executeActions(
    ctx: ProcessingContext,
    processingStage: ProcessingStage,
    ...actionSets: ActionConfig[][]
  ) {
    actionSets.forEach((actions) => {
      actions
        .filter((action) => action.processingStage === processingStage)
        .forEach((action) =>
          ctx.proc.actionRegistry.executeAction(
            ctx,
            action.name,
            action.args as ActionArgsType,
          ),
        )
    })
  }
}
