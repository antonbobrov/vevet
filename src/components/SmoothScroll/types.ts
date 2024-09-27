import { NComponent } from '@/base/Component/types';
import { AnimationFrame } from '../AnimationFrame';
import { TOnResizeTarget } from '@/utils/listeners/onResize';

export namespace NSmoothScroll {
  export interface IStaticProps extends NComponent.IStaticProps {
    /**
     * Container selector
     * @default '#v-smooth-scroll'
     */
    container?: string | HTMLElement;
    /**
     * Scrollable elements inside the wrapper
     * @default false
     */
    elements?:
      | false
      | string
      | NodeListOf<HTMLElement>
      | HTMLElement
      | HTMLElement[];
    /**
     * Pass an `AnimationFrame` instance if you want to control scrolling animation outside this class.
     * @default false
     */
    animationFrame?: false | AnimationFrame;
    /**
     * Viewport target
     * @default 'any'
     */
    viewportTarget?: TOnResizeTarget;
    /**
     * Timeout of resize event
     * @default 0
     */
    resizeDebounce?: number;
    /**
     * If need to add will-change to scrollable elements
     * @default true
     */
    hasWillChange?: boolean;
    /**
     * Sometimes scrolling may be choppy because of large decimal values in transforms.
     * In such cases you may want to use this property.
     * It works on the basis of "toFixed()" method. Only integers
     * @default 2
     */
    translatePrecision?: false | number;
  }

  export interface IChangeableProps extends NComponent.IChangeableProps {
    /**
     * Scrolling is enabled
     * @default true
     */
    isEnabled?: boolean;
    /**
     * Use wheel
     * @default true
     */
    hasWheel?: boolean;
    /**
     * Wheel speed
     * @default 1
     */
    wheelSpeed?: number;
    /**
     * Main scrolling direction
     * @default 'vertical'
     */
    direction?: 'horizontal' | 'vertical';
    /**
     * Inverse scrolling values
     * @default false
     */
    isInversedHandlerDirection?: boolean;
    /**
     * Automatically stop animation frame when the target and current values are equal
     * @default true
     */
    shouldAutoStop?: boolean;
    /**
     * Stop propagation when scrolling
     * @default true
     */
    hasStopPropagation?: boolean;
    /**
     * Linear interpolation (from 0 to 1). Scroll elements may have different lerp values: via `smoothScrollLerp` property or the attribute `data-smooth-scroll-lerp`.
     * @default 0.1
     */
    lerp?: number;
    /**
     * On different screens with different FPS, animation may be slower or faster.
     * This property is to normalize animation speed across different screens.
     * @default true
     */
    isFpsNormalized?: boolean;
    /**
     * @default 0.1
     */
    lerpApproximation?: number;
  }

  export interface ICallbacksTypes extends NComponent.ICallbacksTypes {
    render: undefined;
    resize: undefined;
    wheel: IWheelParameter;
  }

  export interface IWheelParameter {
    event: WheelEvent;
  }

  export interface IElement extends HTMLElement {
    smoothScrollTop: number;
    smoothScrollLeft: number;
    smoothScrollLerp?: number;
  }
}
