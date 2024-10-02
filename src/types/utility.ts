export interface IModuleLike {
  prop: any;
  prefix: string;
  name: string;
  destroy: () => void;
}

export declare type TPrimitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | undefined
  | null;

export declare type TBuiltin =
  | TPrimitive
  | Function
  | Date
  | Error
  | RegExp
  | Element
  | Window
  | IModuleLike;

export declare type TDeepRequired<T> = T extends TBuiltin
  ? NonNullable<T>
  : T extends Map<infer K, infer V>
    ? Map<TDeepRequired<K>, TDeepRequired<V>>
    : T extends ReadonlyMap<infer K, infer V>
      ? ReadonlyMap<TDeepRequired<K>, TDeepRequired<V>>
      : T extends WeakMap<infer K, infer V>
        ? WeakMap<TDeepRequired<K>, TDeepRequired<V>>
        : T extends Set<infer U>
          ? Set<TDeepRequired<U>>
          : T extends ReadonlySet<infer U>
            ? ReadonlySet<TDeepRequired<U>>
            : T extends WeakSet<infer U>
              ? WeakSet<TDeepRequired<U>>
              : T extends Promise<infer U>
                ? Promise<TDeepRequired<U>>
                : T extends {}
                  ? {
                      [K in keyof T]-?: TDeepRequired<T[K]>;
                    }
                  : NonNullable<T>;

export declare type TRequiredModuleProp<T> = TDeepRequired<T>;
