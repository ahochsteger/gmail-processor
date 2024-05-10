/**
 * Represents the direction a list should be ordered.
 */
export enum OrderDirection {
  /**
   * Order ascending.
   */
  ASC = "asc",
  /**
   * Order descending.
   */
  DESC = "desc",
}

export type OrderableEntityConfig<T extends string> = {
  orderBy: T
  orderDirection: OrderDirection
}
