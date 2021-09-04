export interface ScrollableElement {
    scrollTop: number;
    scrollTo(options: ScrollToOptions): void;
    scrollTo(x: number, y: number): void;
    scrollLeft: number;
    scrollWidth: number;
    scrollHeight: number;
    clientWidth: number;
    clientHeight: number;
}
