export interface IRemovable {
  remove: () => void;
}

export interface IDestroyable {
  destroy: () => void;
}

export interface IScrollLike {
  scrollWidth: number;
  scrollHeight: number;
  clientWidth: number;
  clientHeight: number;
  scrollTop: number;
  scrollLeft: number;
  scrollTo(options: ScrollToOptions): void;
}
