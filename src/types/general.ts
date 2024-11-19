export interface IScrollLike {
  scrollWidth: number;
  scrollHeight: number;
  clientWidth: number;
  clientHeight: number;
  scrollTop: number;
  scrollLeft: number;
  scrollTo(options: ScrollToOptions): void;
}
