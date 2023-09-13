/* eslint-disable @typescript-eslint/no-explicit-any */

export function essentialProp(prop: any, essentialFn: (obj: any) => any) {
  if (Array.isArray(prop) && essentialFn) {
    prop = prop.map((entry) => essentialFn(entry))
  } else if (typeof prop === "object" && essentialFn) {
    prop = essentialFn(prop)
  }
  return prop
}

export function essentialObject(
  obj: any,
  defaultObj: any,
  propEssentialMap: { [key: string]: (obj: any) => any } = {},
  requiredProps: string[] = [],
): any {
  requiredProps = requiredProps.concat([])
  Object.keys(obj).forEach((key: string) => {
    const prop = essentialProp((obj as any)[key], propEssentialMap[key])
    const jsonVal = JSON.stringify(prop)
    if (
      !requiredProps.includes(key) &&
      (prop === null ||
      jsonVal === JSON.stringify(defaultObj[key]) ||
      jsonVal === "[]" ||
        jsonVal === "{}")
    )
      delete (obj as any)[key]
  })
  return obj
}
