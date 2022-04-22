import { addEventListener, selectOne } from 'vevet-dom';
import { IRemovable } from '../types/general';
import { SmoothScroll } from '../../components/scroll/smooth-scroll/SmoothScroll';
import { id as orderId } from '../common';

type Container = string | Element | SmoothScroll | Window;

interface ArgData {
    scrollTop: number;
    scrollLeft: number;
}

interface Instance {
    id: string;
    container: Container;
    callbacks: {
        id: string;
        callback: (
            data: ArgData,
        ) => void;
    }[];
    isPassive: boolean;
    listeners: IRemovable[];
}

interface Props {
    container: Container;
    callback: (data: ArgData) => void;
    isPassive?: boolean;
}

let instances: Instance[] = [];

/**
 * Add OnScroll event
 */
export default function onScroll ({
    container,
    callback,
    isPassive = false,
}: Props): IRemovable {
    // check if listeners for this element already exist
    let instance = instances.find((data) => (
        data.container === container && data.isPassive === isPassive
    ))!;
    const callbackId = orderId('scroll-event');

    // if a listener exists, we just add a new callback to its stack
    if (instance) {
        instance.callbacks.push({
            id: callbackId,
            callback,
        });
    } else {
        // otherwise we create a new instance
        instance = {
            id: orderId('scroll-event-instance'),
            container,
            callbacks: [{
                id: callbackId,
                callback,
            }],
            isPassive,
            listeners: [],
        };
        instances.push(instance);

        // vars
        const { listeners } = instance;

        // smooth scroll events
        if (container instanceof SmoothScroll) {
            listeners.push(
                container.addCallback('scroll', () => {
                    const { scrollTop, scrollLeft } = container;
                    for (let index = 0; index < instance.callbacks.length; index += 1) {
                        instance.callbacks[index].callback({
                            scrollTop,
                            scrollLeft,
                        });
                    }
                }),
            );
        } else {
            // dom scroll events
            const isWindow = container instanceof Window;
            const domContainer = selectOne(container) as any;
            listeners.push(addEventListener(
                domContainer,
                'scroll',
                () => {
                    const scrollTop = isWindow
                        ? domContainer.pageYOffset : domContainer.scrollTop;
                    const scrollLeft = isWindow
                        ? domContainer.pageXOffset : domContainer.scrollLeft;
                    for (let index = 0; index < instance.callbacks.length; index += 1) {
                        instance.callbacks[index].callback({
                            scrollTop,
                            scrollLeft,
                        });
                    }
                },
                {
                    passive: isPassive,
                },
            ));
        }
    }

    return {
        remove: () => {
            const newCallbacks = instance.callbacks.filter((item) => {
                if (item.id !== callbackId) {
                    return true;
                }
                return false;
            });
            instance.callbacks = newCallbacks;
            if (newCallbacks.length === 0) {
                instance.listeners.forEach((listener) => {
                    listener.remove();
                });
                instances = instances.filter((item) => item.id !== instance.id);
            }
        },
    };
}
