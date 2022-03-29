import { ScrollLike } from '../types/general';

/**
 * Get scroll values of a certain element
 */
export default function getScrollValues (
    selector: (Window | Element | ScrollLike | undefined) = window,
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
