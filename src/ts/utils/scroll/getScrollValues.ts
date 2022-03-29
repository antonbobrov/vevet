import type { SmoothScroll } from '../../components/scroll/smooth-scroll/SmoothScroll';

/**
 * Get scroll values of a certain element
 */
export default function getScrollValues (
    selector: (Window | Element | SmoothScroll | undefined),
) {
    if (selector) {
        const scrollTop = selector instanceof Window
            ? selector.pageYOffset : selector.scrollTop;
        const scrollLeft = selector instanceof Window
            ? selector.pageXOffset : selector.scrollLeft;
        return {
            scrollTop,
            scrollLeft,
        };
    }
    return undefined;
}
