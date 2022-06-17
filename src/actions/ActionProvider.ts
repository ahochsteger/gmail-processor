import { Actions } from "./Actions"

export interface ActionProvider {
  getActions(): Actions
}
