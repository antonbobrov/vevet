import { addEventListener, IAddEventListener, selectOne } from 'vevet-dom';
import { SmoothScroll } from '../../components/scroll/smooth-scroll/SmoothScroll';
import { IRemovable } from '../types/general';

interface Props {
    passive?: boolean;
}

/**
 * Add OnScroll event
 */
export default function onScroll (
    selector: string | Element | SmoothScroll | Window,
    callback: (arg: {
        scrollTop: number,
        scrollLeft: number
    }) => void,
    props?: Props,
): IRemovable {
    const listeners: IAddEventListener[] = [];

    if (selector instanceof SmoothScroll) {
        selector.addCallback('scroll', () => {
            callback({
                scrollTop: selector.scrollTop,
                scrollLeft: selector.scrollLeft,
            });
        });
    } else {
        let outer: Element | Window;
        if (typeof selector === 'string') {
            outer = selectOne(selector) as Element;
        } else {
            outer = selector;
        }
        if (outer) {
            listeners.push(addEventListener(
                outer,
                'scroll',
                () => {
                    const scrollTop = outer instanceof Window
                        ? outer.pageYOffset : outer.scrollTop;
                    const scrollLeft = outer instanceof Window
                        ? outer.pageXOffset : outer.scrollLeft;
                    callback({
                        scrollTop,
                        scrollLeft,
                    });
                },
                props ? {
                    passive: props.passive,
                } : undefined,
            ));
        }
    }

    return {
        remove: () => {
            listeners.forEach((listener) => {
                listener.remove();
            });
        },
    };
}
