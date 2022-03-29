import { ScrollLike } from '../../utils/types/general';

export interface ScrollableElement extends ScrollLike {
    scrollWidth: number;
    scrollHeight: number;
    clientWidth: number;
    clientHeight: number;
}
