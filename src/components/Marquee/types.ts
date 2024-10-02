import { NComponent } from '@/base/Component/types';

export namespace NMarquee {
  export interface IStaticProps extends NComponent.IStaticProps {
    /**
     * Marquee container. You may use a CSS selector or the element itself.
     * @default '#v-marquee'
     */
    container?: string | HTMLElement;
    /**
     * Timeout of resize event
     * @default 0
     */
    resizeDebounce?: number;
    /**
     * If `true`, the `will-change` CSS property will be applied to the elements to improve performance.
     * @default true
     */
    hasWillChange?: boolean;
    /**
     * If need to clone nodes for a better animation. May be useful to set `false` when using with such frameworks as React.
     * @default true
     */
    canCloneNodes?: boolean;
  }

  export interface IChangeableProps extends NComponent.IChangeableProps {
    /**
     * Marquee speed
     * @default 1
     */
    speed?: number;
    /**
     * Gap between elements
     * @default 0
     */
    gap?: number;
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
    /**
     * If need to center elements
     * @default false
     */
    isCentered?: boolean;
  }

  export interface ICallbacksTypes extends NComponent.ICallbacksTypes {
    render: undefined;
    resize: undefined;
  }
}
