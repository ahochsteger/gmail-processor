/* eslint-disable @typescript-eslint/ban-types */
type NotNill<T> = T extends null | undefined ? never : T
type Primitive = undefined | null | boolean | string | number | Function

// Work-around to the error "Type instantiation is excessively deep and possibly infinite.":
export type RequiredDeep<
  T,
  D extends number = 7, // NOTE: This indicates the maximum recursion level which may be increased if needed
  A extends unknown[] = [],
> = A["length"] extends D
  ? never
  : T extends Primitive
    ? NotNill<T>
    : {
        [P in keyof T]-?: T[P] extends Array<infer U>
          ? Array<RequiredDeep<U, D, [0, ...A]>>
          : T[P] extends ReadonlyArray<infer U2>
            ? RequiredDeep<U2, D, [0, ...A]>
            : RequiredDeep<T[P], D, [0, ...A]>
      }
