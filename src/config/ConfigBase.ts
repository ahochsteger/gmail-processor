import "reflect-metadata"

// See https://betterprogramming.pub/dynamically-convert-plain-objects-into-typescript-classes-adcc788e0bcc
export class ConfigBase<T> {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(payload: DeepPartial<T> = {}){}

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private init(payload: any = {}){
    for(const key in payload){
      if(Object.prototype.hasOwnProperty.call(this,key)){
        const factory: Constructor = Reflect.getMetadata('design:type', this, key)
        ;(this as Indexable)[key] = factory ? new factory(payload[key]) : payload[key]
      } else {
        console.log("Unsupported key '" + key + "' in payload: " + JSON.stringify(payload))
      }
    }
  }
}

export type Constructor<T = any> = { new(...args: any[]): T }

export type Indexable = { [key: string]: any }

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : DeepPartial<T[P]>
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function Primed(target: any, propertyKey: string) {}

export function Model<T extends Constructor>(constructor: T){
  /* tslint:disable:max-classes-per-file */
  return class extends constructor {
    constructor(...args: any[]){
      super()
      this.init(args[0])
    }
  }
}
