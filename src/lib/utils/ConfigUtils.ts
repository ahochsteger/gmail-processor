/* eslint-disable @typescript-eslint/no-explicit-any */

function essentialProp(prop: any, essentialFn?: (obj: any) => any) {
  if (Array.isArray(prop) && essentialFn) {
    prop = prop.map((entry) => essentialFn(entry))
  } else if (typeof prop === "object" && essentialFn) {
    prop = essentialFn(prop)
  }
  return prop
}

export function essentialObject<T extends object = any>(
  obj: T,
  defaultObj: T,
  propEssentialMap: { [key: string]: (obj: any) => any } = {},
  requiredProps: string[] = [],
): T {
  requiredProps = requiredProps.concat([])
  Object.keys(obj).forEach((key: string) => {
    const prop = essentialProp(
      obj[key as keyof T],
      propEssentialMap[key as string],
    )
    const jsonVal = JSON.stringify(prop)
    if (
      !requiredProps.includes(key as string) &&
      (prop === null ||
        jsonVal === JSON.stringify(defaultObj[key as keyof T]) ||
        jsonVal === "[]" ||
        jsonVal === "{}")
    )
      delete obj[key as keyof T]
  })
  return obj
}
