export interface IRemovable {
    remove: () => void;
}

export interface IDestroyable {
    destroy: () => void;
}

export interface ScrollLike {
    scrollTop: number;
    scrollLeft: number;
}
