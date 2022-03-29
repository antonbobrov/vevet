import { selectOne } from 'vevet-dom';
import { ScrollLike } from '../types/general';
import getScrollValues from './getScrollValues';
import clamp from '../math/clamp';
import scrollTo from './scrollTo';

interface Props {
    /**
     * @default window
     */
    container?: Window | Element | ScrollLike;
    /**
     * The target element
     */
    el: Element | string;
    /**
     * top padding
     * @default 0
     */
    top?: number;
    /**
     * left padding
     * @default 0
     */
    left?: number;
    /**
     * scroll duration
     * @default 250
     */
    duration?: number;
}

/**
 * Scroll to element
 */
export default function scrollToElement ({
    container = window,
    el,
    top = 0,
    left = 0,
    duration = 250,
}: Props) {
    return new Promise<void>((
        resolve, reject,
    ) => {
        const startValues = getScrollValues(container);
        if (startValues) {
            const element = selectOne(el);
            if (element) {
                const bounding = element.getBoundingClientRect();
                const toTop = clamp(
                    bounding.top + startValues.scrollTop - top,
                    [0, Infinity],
                );
                const toLeft = clamp(
                    bounding.left + startValues.scrollLeft - left,
                    [0, Infinity],
                );
                scrollTo({
                    container,
                    top: toTop,
                    left: toLeft,
                    duration,
                }).then(() => {
                    resolve();
                }).catch(() => {
                    reject();
                });
            }
            return;
        }
        reject();
    });
}
