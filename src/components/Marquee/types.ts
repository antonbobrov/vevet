import { NComponent } from '@/base/Component/types';
import { TOnResizeTarget } from '@/utils/listeners/onResize';

export namespace NMarquee {
  export interface IStaticProps extends NComponent.IStaticProps {
    /**
     * Marquee container. You may use a CSS selector or the element itself.
     * @default '#v-marquee'
     */
    container?: string | HTMLElement;
    /**
     * Viewport target
     * @default 'width'
     */
    viewportTarget?: TOnResizeTarget;
    /**
     * Timeout of resize event
     * @default 0
     */
    resizeDebounce?: number;
    /**
     * Prepend a whitespace
     * @default true
     */
    prependWhitespace?: boolean;
  }

  export interface IChangeableProps extends NComponent.IChangeableProps {
    /**
     * Marquee speed
     * @default 1
     */
    speed?: number;
    /**
     * Enable animation
     * @default true
     */
    isEnabled?: boolean;
    /**
     * Pause on hover
     * @default false
     */
    pauseOnHover?: boolean;
    /**
     * On different screens with different FPS, animation may be slower or faster.
     * This property is to normalize animation speed across different screens.
     * @default true
     */
    isFpsNormalized?: boolean;
  }

  export interface ICallbacksTypes extends NComponent.ICallbacksTypes {
    render: undefined;
  }
}
