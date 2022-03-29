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
