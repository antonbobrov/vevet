import { IAddEventListener } from 'vevet-dom';
import { SmoothScroll } from '../../components/scroll/smooth-scroll/SmoothScroll';
import { IRemovable } from '../types/general';

/**
 * Add OnScroll event
 */
export default function onScroll (
    outer: Element | SmoothScroll | Window,
    callback: (arg: {
        scrollTop: number,
        scrollLeft: number
    }) => void,
): IRemovable {
    const listeners: IAddEventListener[] = [];

    if (outer instanceof SmoothScroll) {
        outer.addCallback('scroll', () => {
            callback({
                scrollTop: outer.scrollTop,
                scrollLeft: outer.scrollLeft,
            });
        });
    } else {
        outer.addEventListener('scroll', () => {
            const scrollTop = outer instanceof Window ? outer.pageYOffset : outer.scrollTop;
            const scrollLeft = outer instanceof Window ? outer.pageXOffset : outer.scrollLeft;
            callback({
                scrollTop,
                scrollLeft,
            });
        });
    }

    return {
        remove: () => {
            listeners.forEach((listener) => {
                listener.remove();
            });
        },
    };
}
