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
  const metadataKeys = Reflect.getMetadataKeys(obj)
  requiredProps = requiredProps.concat([])
  console.log(
    `essentialObject(): requiredProps=${JSON.stringify(
      requiredProps,
    )}, metadataKeys=${metadataKeys}`,
  )
  Object.keys(obj).forEach((key: string) => {
    const prop = essentialProp((obj as any)[key], propEssentialMap[key])
    const propType = Reflect.getMetadata("design:type", obj, key)
    console.log(`essentialObject(): propType(${key})=${propType}`)
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
