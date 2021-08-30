interface ModuleLike {
    prop: any;
    prefix: string;
    name: string;
    destroy: () => void;
}

export declare type Primitive = string | number | boolean | bigint | symbol | undefined | null;
export declare type Builtin =
    Primitive | Function | Date | Error | RegExp | Element | Window | ModuleLike;

declare type DeepRequired<T> = T extends Builtin
    ? NonNullable<T>
    : T extends Map<infer K, infer V>
    ? Map<DeepRequired<K>, DeepRequired<V>>
    : T extends ReadonlyMap<infer K, infer V>
    ? ReadonlyMap<DeepRequired<K>, DeepRequired<V>>
    : T extends WeakMap<infer K, infer V>
    ? WeakMap<DeepRequired<K>, DeepRequired<V>>
    : T extends Set<infer U>
    ? Set<DeepRequired<U>>
    : T extends ReadonlySet<infer U>
    ? ReadonlySet<DeepRequired<U>>
    : T extends WeakSet<infer U>
    ? WeakSet<DeepRequired<U>>
    : T extends Promise<infer U>
    ? Promise<DeepRequired<U>>
    : T extends {}
    ? {
        [K in keyof T]-?: DeepRequired<T[K]>;
    }
    : NonNullable<T>;

export declare type RequiredModuleProp<T> = DeepRequired<T>;
