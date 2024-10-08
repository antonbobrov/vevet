import { NComponent } from '@/base/Component/types';
import { AnimationFrame } from '../AnimationFrame';
import { TOnResizeTarget } from '@/utils/listeners/onResize';

export namespace NCustomScroll {
  export interface IStaticProps extends NComponent.IStaticProps {
    /**
     * Selector or HTMLElement for the scrollable container.
     * @default '#v-custom-scroll'
     */
    container?: string | HTMLElement;

    /**
     * Defines the scrollable elements inside the wrapper. Can be a selector, a list of elements, or a single element.
     * If set to `false`, no specific elements are defined.
     * @default false
     */
    elements?:
      | false
      | string
      | NodeListOf<HTMLElement>
      | HTMLElement
      | HTMLElement[];

    /**
     * Optional `AnimationFrame` instance to control scrolling animation externally.
     * @default false
     */
    animationFrame?: false | AnimationFrame;

    /**
     * Target for the viewport resize event.
     * @default 'any'
     */
    viewportTarget?: TOnResizeTarget;

    /**
     * Timeout value for the resize event, useful for debouncing resize calculations.
     * @default 0
     */
    resizeDebounce?: number;

    /**
     * If `true`, the `will-change` CSS property will be applied to the scrollable elements to improve performance.
     * @default true
     */
    hasWillChange?: boolean;

    /**
     * Sets precision for the `transform` property by limiting the number of decimal places.
     * Helps prevent choppy scrolling caused by large decimal values in transforms.
     * Set to `false` to disable precision rounding.
     * @default 2
     */
    translatePrecision?: false | number;
  }

  export interface IChangeableProps extends NComponent.IChangeableProps {
    /**
     * If `true`, scrolling is enabled.
     * @default true
     */
    isEnabled?: boolean;

    /**
     * If `true`, enables scrolling via mouse wheel.
     * @default true
     */
    hasWheel?: boolean;

    /**
     * Defines the scroll speed multiplier for the mouse wheel.
     * @default 1
     */
    wheelSpeed?: number;

    /**
     * Defines the main scrolling direction. Can be either horizontal or vertical.
     * @default 'vertical'
     */
    direction?: 'horizontal' | 'vertical';

    /**
     * Inverts the scroll direction. Useful for reversed scrolling behaviors.
     * @default false
     */
    isInversedHandlerDirection?: boolean;

    /**
     * Automatically stops the animation frame when the target and current scroll values are equal.
     * Improves performance by preventing unnecessary renders.
     * @default true
     */
    shouldAutoStop?: boolean;

    /**
     * If `true`, stops propagation of the scroll event to parent elements.
     * @default true
     */
    hasStopPropagation?: boolean;

    /**
     * Linear interpolation factor for smooth scrolling. Scroll elements can override this value using the `customScrollLerp` property or the "data-custom-scroll-lerp" attribute.
     * @default 0.1
     */
    lerp?: number;

    /**
     * Normalizes the scroll speed across different screens by accounting for varying FPS rates.
     * @default true
     */
    isFpsNormalized?: boolean;

    /**
     * Approximation factor for interpolation, used to prevent animation from getting too slow at very small differences between current and target values.
     * @default 0.1
     */
    lerpApproximation?: number;
  }

  export interface ICallbacksTypes extends NComponent.ICallbacksTypes {
    /**
     * Fired when the component renders a new scroll frame.
     */
    render: undefined;

    /**
     * Fired when the component or viewport is resized.
     */
    resize: undefined;

    /**
     * Fired when a scroll event is detected from a mouse wheel interaction.
     */
    wheel: IWheelParameter;
  }

  export interface IWheelParameter {
    /**
     * The original wheel event that triggered the scroll.
     */
    event: WheelEvent;
  }

  /**
   * Represents a scrollable element within the CustomScroll component.
   * These elements can track custom scroll positions and include custom interpolation settings.
   */
  export interface IElement extends HTMLElement {
    /**
     * The current custom scroll top value for this element.
     */
    customScrollTop: number;

    /**
     * The current custom scroll left value for this element.
     */
    customScrollLeft: number;

    /**
     * Optional custom interpolation (lerp) value specific to this element.
     */
    customScrollLerp?: number;
  }
}
