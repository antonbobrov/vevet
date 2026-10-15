interface IModuleLike {
  prefix: string;
  destroy: () => void;
}

declare type TPrimitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | undefined
  | null;

declare type TBuiltin =
  | TPrimitive
  | Function
  | Date
  | Error
  | RegExp
  | Element
  | Window
  | IModuleLike;

declare type TTRequiredProps<T> = T extends TBuiltin
  ? NonNullable<T>
  : T extends Map<infer K, infer V>
    ? Map<TTRequiredProps<K>, TTRequiredProps<V>>
    : T extends ReadonlyMap<infer K, infer V>
      ? ReadonlyMap<TTRequiredProps<K>, TTRequiredProps<V>>
      : T extends WeakMap<infer K, infer V>
        ? WeakMap<TTRequiredProps<K>, TTRequiredProps<V>>
        : T extends Set<infer U>
          ? Set<TTRequiredProps<U>>
          : T extends ReadonlySet<infer U>
            ? ReadonlySet<TTRequiredProps<U>>
            : T extends WeakSet<infer U>
              ? WeakSet<TTRequiredProps<U>>
              : T extends Promise<infer U>
                ? Promise<TTRequiredProps<U>>
                : T extends {}
                  ? {
                      [K in keyof T]-?: TTRequiredProps<T[K]>;
                    }
                  : NonNullable<T>;

export declare type TRequiredProps<T> = TTRequiredProps<T>;
