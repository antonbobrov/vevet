import { Timeline } from '../../components/timeline/Timeline';
import { ScrollLike } from '../types/general';
import getScrollValues from './getScrollValues';

interface Props {
    /**
     * @default window
     */
    container?: Window | Element | ScrollLike;
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
 * Scroll to coordinates
 */
export default function scrollTo ({
    container = window,
    top = 0,
    left = 0,
    duration = 250,
}: Props) {
    return new Promise<void>((
        resolve, reject,
    ) => {
        // save start values
        const startValues = getScrollValues(container);
        if (startValues) {
            // create animation
            const timeline = new Timeline({
                duration,
            });
            timeline.addCallback('progress', (data) => {
                if (container) {
                    container.scrollTo({
                        top: startValues.scrollTop
                            + (top - startValues.scrollTop) * data.easing,
                        left: startValues.scrollLeft
                            + (left - startValues.scrollLeft) * data.easing,
                        behavior: 'auto',
                    });
                }
            });
            timeline.addCallback('end', () => {
                resolve();
            });
            timeline.play();
            return;
        }
        reject();
    });
}
