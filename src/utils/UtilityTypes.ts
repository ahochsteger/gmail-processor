/* eslint-disable @typescript-eslint/ban-types */
export type NotNill<T> = T extends null | undefined ? never : T
export type Primitive = undefined | null | boolean | string | number | Function
export type RequiredDeep<T> = T extends Primitive
  ? NotNill<T>
  : {
      [P in keyof T]-?: T[P] extends Array<infer U>
        ? Array<RequiredDeep<U>>
        : T[P] extends ReadonlyArray<infer U2>
        ? RequiredDeep<U2>
        : RequiredDeep<T[P]>
    }
