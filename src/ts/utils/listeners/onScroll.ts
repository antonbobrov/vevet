import { addEventListener, IAddEventListener, selectOne } from 'vevet-dom';
import { NCallbacks } from '../..';
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
    let smoothScrollEvent: NCallbacks.AddedCallback | undefined;

    if (selector instanceof SmoothScroll) {
        smoothScrollEvent = selector.addCallback('scroll', () => {
            callback({
                scrollTop: selector.scrollTop,
                scrollLeft: selector.scrollLeft,
            });
        });
    } else {
        let outer: any;
        if (typeof selector === 'string') {
            outer = selectOne(selector) as Element;
        } else {
            outer = selector;
        }
        if (outer) {
            const isWindow = outer instanceof Window;
            listeners.push(addEventListener(
                outer,
                'scroll',
                () => {
                    const scrollTop = isWindow ? outer.pageYOffset : outer.scrollTop;
                    const scrollLeft = isWindow ? outer.pageXOffset : outer.scrollLeft;
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
            smoothScrollEvent?.remove();
        },
    };
}
