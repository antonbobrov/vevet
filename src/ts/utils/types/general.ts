export interface IRemovable {
    remove: () => void;
}

export interface IDestroyable {
    destroy: () => void;
}

export interface ScrollLike {
    scrollTop: number;
    scrollLeft: number;
    scrollTo(options: ScrollToOptions): void;
    scrollTo(x: number, y: number): void;
}

export interface ImagePaths {
    original: string;
    thumb?: string;
    thumbWebp?: string;
}

export interface ImageAdaptivePaths<
    S extends Record<string | number, string> = {}
> extends ImagePaths {
    sizes?: S;
    sizesWebp?: S;
}
