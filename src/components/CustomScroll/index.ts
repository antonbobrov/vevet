import { Component as ComponentClass } from '@/base/Component';
import { NCustomScroll } from './types';
import { IScrollLike } from '@/types/general';
import { clamp, lerp } from '@/utils/math';
import { normalizeWheel } from '@/utils/scroll';
import { Elements } from './Elements';
import { AnimationFrame } from './AnimatonFrame';
import { onResize } from '@/utils/listeners/onResize';
import { getApp } from '@/utils/internal/getApp';
import { selectOne } from '@/utils/dom/selectOne';

export type { NCustomScroll };

/**
 * Custom smooth scrolling component that replaces native scrolling behavior.
 * It provides smooth interpolation, custom scroll events, and integration with other elements.
 *
 * @requires Requires styles: `@import '~vevet/lib/styles/components/CustomScroll';`
 *
 * @link See examples https://antonbobrov.github.io/vevet-demo/custom-scroll/
 *
 * @link See docs https://antonbobrov.github.io/vevet/classes/CustomScroll.html
 */
export class CustomScroll<
    StaticProps extends NCustomScroll.IStaticProps = NCustomScroll.IStaticProps,
    ChangeableProps extends
      NCustomScroll.IChangeableProps = NCustomScroll.IChangeableProps,
    CallbacksTypes extends
      NCustomScroll.ICallbacksTypes = NCustomScroll.ICallbacksTypes,
  >
  extends ComponentClass<StaticProps, ChangeableProps, CallbacksTypes>
  implements IScrollLike
{
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      container: `#${this.prefix}`,
      elements: false,
      animationFrame: false,
      viewportTarget: 'any',
      resizeDebounce: 0,
      hasWillChange: true,
      translatePrecision: 2,
      isEnabled: true,
      hasWheel: true,
      wheelSpeed: 1,
      wheelDirection: 'default',
      direction: 'vertical',
      isInversedHandlerDirection: false,
      shouldAutoStop: true,
      hasStopPropagation: true,
      lerp: 0.1,
      isFpsNormalized: true,
      lerpApproximation: 0.1,
    };
  }

  get prefix() {
    return `${getApp().prefix}custom-scroll`;
  }

  /** Scroll container element */
  protected _container: HTMLElement;

  /** Scroll container element */
  get container() {
    return this._container;
  }

  /**
   * Internal handler for the scroll elements
   * @ignore
   */
  protected _elements: Elements;

  /**
   * Scroll wrapper. If the element does not exist indide the `container`, it will be created automatically
   */
  get wrapper() {
    return this._elements.wrapper;
  }

  /** The `scrollLeft` target value */
  protected _targetLeft: number;

  /** The `scrollLeft` target value */
  get targetLeft() {
    return this._targetLeft;
  }

  set targetLeft(value) {
    this.setTargetLeft(value);
    this._enable();
  }

  /** Update `targetLeft` without animation */
  protected setTargetLeft(value: number) {
    this._targetLeft = clamp(value, [0, this.maxScrollableWidth]);
  }

  /** The `scrollTop` target value */
  protected _targetTop: number;

  /** The `scrollTop` target value */
  get targetTop() {
    return this._targetTop;
  }

  set targetTop(value) {
    this.setTargetTop(value);
    this._enable();
  }

  /** Update `targetTop` without animation */
  protected setTargetTop(value: number) {
    this._targetTop = clamp(value, [0, this.maxScrollableHeight]);
  }

  /** The current `scrollLeft` value */
  protected _scrollLeft: number;

  /** The current `scrollLeft` value */
  get scrollLeft() {
    return this._scrollLeft;
  }

  set scrollLeft(value) {
    this.setTargetLeft(value);
    this._scrollLeft = this._targetLeft;

    this._isInstant = true;
    this._isEqualLerp = true;

    this._enable();
  }

  /** The current `scrollTop` value */
  protected _scrollTop: number;

  /** The current `scrollTop` value */
  get scrollTop() {
    return this._scrollTop;
  }

  set scrollTop(value) {
    this.setTargetTop(value);
    this._scrollTop = this._targetTop;

    this._isInstant = true;
    this._isEqualLerp = true;

    this._enable();
  }

  /** The scroll width of the container */
  protected _scrollWidth: number;

  /** The scroll width of the container */
  get scrollWidth() {
    return this._scrollWidth;
  }

  /** The scroll height of the container */
  protected _scrollHeight: number;

  /** The scroll width of the container */
  get scrollHeight() {
    return this._scrollHeight;
  }

  /** The container width */
  protected _clientWidth: number;

  /** The container width */
  get clientWidth() {
    return this._clientWidth;
  }

  /** The container height */
  protected _clientHeight: number;

  /** The container height */
  get clientHeight() {
    return this._clientHeight;
  }

  /** The wrapper width */
  protected _wrapperWidth: number;

  /** The wrapper height */
  protected _wrapperHeight: number;

  /** Maximum scrollable area of the X axis */
  get maxScrollableWidth() {
    return this.scrollWidth - this.clientWidth;
  }

  /** Maximum scrollable area of the Y axis */
  get maxScrollableHeight() {
    return this.scrollHeight - this.clientHeight;
  }

  /** The container has scroll */
  get hasScroll() {
    return this.maxScrollableHeight > 0 || this.maxScrollableWidth > 0;
  }

  /** If the approximation between the target and current scroll values must be instantaneous */
  protected _isInstant?: boolean;

  /**
   * Animation frame
   * @ignore
   */
  protected _raf: AnimationFrame;

  /** Frame index */
  protected _frameIndex: number;

  /** Use equal lerp for all elements */
  protected _isEqualLerp: boolean;

  /** Disable timeout */
  protected _disableDelayDebounce?: NodeJS.Timeout;

  /** If the component is a custom scroll */
  get isCustomScroll() {
    return true;
  }

  constructor(initialProps?: StaticProps & ChangeableProps, canInit = true) {
    super(initialProps, false);

    // set default variables
    this._targetLeft = 0;
    this._targetTop = 0;
    this._scrollLeft = 0;
    this._scrollTop = 0;
    this._scrollWidth = 0;
    this._scrollHeight = 0;
    this._clientWidth = 0;
    this._clientHeight = 0;
    this._wrapperWidth = 0;
    this._wrapperHeight = 0;
    this._frameIndex = 0;
    this._isEqualLerp = false;

    const {
      container,
      elements,
      hasWillChange,
      animationFrame,
      translatePrecision,
    } = this.props;

    // get outer elements
    this._container = selectOne(container) as HTMLElement;
    if (!(this._container instanceof HTMLElement)) {
      throw new Error(`${container} is not a HTMLElement`);
    }
    this.toggleClassName(this._container, this.className(''), true);

    // create elements
    this._elements = new Elements({
      container: this._container,
      wrapperClassName: this.className('__wrapper'),
      elements,
      hasWillChange,
      translatePrecision,
    });

    // set classnames
    this._setClassNames(true);

    // create animation frame
    this._raf = new AnimationFrame({
      callback: () => this.render(),
      raf: animationFrame as any,
    });

    // initialize the class
    if (canInit) {
      this.init();
    }
  }

  protected _init() {
    super._init();

    this._setEvents();
    this._toggle();
  }

  /**
   * Sets the class names for the elements.
   */
  protected _setClassNames(isActive: boolean) {
    const { direction } = this.props;

    const isHorizontal = direction === 'horizontal' && isActive;
    const isVertical = direction === 'vertical' && isActive;

    this.wrapper.classList.toggle(this.className('_horizontal'), isHorizontal);
    this.wrapper.classList.toggle(this.className('_vertical'), isVertical);
  }

  /** Set events */
  protected _setEvents() {
    this._setResize();

    // wheel
    this.addEventListener(this.container, 'wheel', (event) =>
      this.handleWheel(event),
    );

    // prevent native scroll
    this.addEventListener(this.container, 'scroll', () => {
      this.container.scrollTop = 0;
      this.container.scrollLeft = 0;
    });
  }

  /** Set resize events */
  protected _setResize() {
    const { viewportTarget, resizeDebounce } = this.props;

    // resize handler
    const resizeHandler = onResize({
      onResize: ({ trigger }) => this.resize(trigger !== 'ResizeObserver'),
      element: [this.container, this.wrapper],
      viewportTarget,
      resizeDebounce,
      hasBothEvents: true,
    });
    this.addDestroyable(() => resizeHandler.remove());

    // initial resize
    resizeHandler.resize();

    // if the ResizeObserver cannot be used, recalculate sizes on each 10th frame
    if (!resizeHandler.hasResizeObserver) {
      this.on(
        'render',
        (() => {
          if (this._frameIndex % 10 === 0) {
            this._recalculate();
          }
        }) as any,
        { isProtected: true, name: this.name },
      );
    }
  }

  /** Handle properties mutation */
  protected _onPropsMutate() {
    super._onPropsMutate();

    this._setClassNames(true);

    this.resize();
    this._toggle();
  }

  /** Recalculate scroll sizes */
  protected _recalculate() {
    const { wrapper } = this;

    const height = wrapper.clientHeight;
    const width = wrapper.clientWidth;

    if (height !== this._wrapperHeight || width !== this._wrapperWidth) {
      this.resize(false);
    }
  }

  /** Resize the scene */
  public resize(isNative = false) {
    this._resize(isNative);

    // launch callbacks
    this.callbacks.tbt('resize', undefined);

    // enable animation
    this._enable();
  }

  /** Resize the scene */
  protected _resize(
    /** If the method was called natively on window resize */
    isNative = false,
  ) {
    const { container, wrapper } = this;

    this._clientWidth = container.clientWidth;
    this._clientHeight = container.clientHeight;

    this._wrapperWidth = wrapper.clientWidth;
    this._wrapperHeight = wrapper.clientHeight;

    this._scrollWidth = clamp(this._wrapperWidth, [this.clientWidth, Infinity]);

    this._scrollHeight = clamp(this._wrapperHeight, [
      this.clientHeight,
      Infinity,
    ]);

    // force instant change
    // it means that after resizing, scrolling will be instantaneous for a while
    if (isNative) {
      this._isInstant = true;
    }

    // sometimes after resizing it may happen that targets are less or more
    // than maximum values of scrolling
    // that's why we fix it here
    if (isNative) {
      this.setTargetLeft(parseInt(this.targetLeft.toFixed(0), 10));
      this.setTargetTop(parseInt(this.targetTop.toFixed(0), 10));
    }

    // set scroll classes
    container.classList.toggle(this.className('_has-scroll'), this.hasScroll);
    container.classList.toggle(this.className('_no-scroll'), !this.hasScroll);

    // update elements
    this._elements.updateProps(this.scrollLeft, this.scrollTop);
  }

  /** Event on wheel */
  public handleWheel(event: WheelEvent) {
    const { isEnabled, hasWheel, hasStopPropagation } = this.props;

    if (!isEnabled || !hasWheel || !this.hasScroll) {
      return;
    }

    const isPropagationStopped =
      hasStopPropagation ||
      (this.scrollTop > 0 && this.scrollTop < this.maxScrollableHeight) ||
      (this.scrollLeft > 0 && this.scrollLeft < this.maxScrollableWidth);

    if (isPropagationStopped) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
    }

    // iterate wheel
    this._iterateWheel(event);

    // play animation frame
    this._enable();

    // launch events
    this.callbacks.tbt('wheel', { event });
  }

  /** Iterate wheel */
  protected _iterateWheel(event: WheelEvent) {
    const { isInversedHandlerDirection, wheelSpeed } = this.props;

    // get normalized delta
    const { pixelX, pixelY } = normalizeWheel(event);

    // set new scroll targets
    const leftIterator = isInversedHandlerDirection ? pixelY : pixelX;
    const topIterator = isInversedHandlerDirection ? pixelX : pixelY;

    this.setTargetLeft(this.targetLeft + leftIterator * wheelSpeed);
    this.setTargetTop(this.targetTop + topIterator * wheelSpeed);
  }

  /** Toggle animation: Enable / Disable scrolling */
  protected _toggle() {
    if (this.props.isEnabled) {
      this._enable();
    } else {
      this._disable();
    }
  }

  /** Enable scrolling */
  protected _enable() {
    if (!this.props.isEnabled) {
      return;
    }

    this._raf.enable();
  }

  /** Disable scrolling */
  protected _disable() {
    this._raf.disable();
  }

  /** Render elements */
  public render() {
    this._frameIndex += 1;

    this._calcScrollValues();
    this._calcElementsValues();
    this._elements.render();

    // disable instant scrolling
    if (this._isInstant) {
      this._isInstant = false;
    }

    // disable equal lerp
    this._isEqualLerp = false;

    // launch callbacks
    this.callbacks.tbt('render', undefined);

    // auto stop
    this._checkAutoStop();
  }

  /** Calculate scroll values */
  protected _calcScrollValues() {
    this._scrollLeft = this._lerp(this.scrollLeft, this.targetLeft);
    this._scrollTop = this._lerp(this.scrollTop, this.targetTop);
  }

  /** Calculate elements' values */
  protected _calcElementsValues() {
    const { elements } = this._elements;

    for (let index = 0; index < elements.length; index += 1) {
      const element = elements[index];
      const elementLerp = this._getLerp(element);

      element.customScrollLeft = this._lerp(
        element.customScrollLeft,
        this._targetLeft,
        elementLerp,
      );

      element.customScrollTop = this._lerp(
        element.customScrollTop,
        this._targetTop,
        elementLerp,
      );
    }
  }

  /** Make auto stop if the target and current values are equal */
  protected _checkAutoStop() {
    if (!this.props.shouldAutoStop) {
      return;
    }

    const yDiff = Math.abs(this.targetTop - this.scrollTop);
    const xDiff = Math.abs(this.targetLeft - this.scrollLeft);

    const isGlobalInterpolated = xDiff === 0 && yDiff === 0;
    const isInnerInterpolated = this._elements.getIsEqual();

    if (isGlobalInterpolated && isInnerInterpolated) {
      this._disable();
    }
  }

  /** Interpolate values */
  protected _lerp(current: number, target: number, ease = this._getLerp()) {
    const { lerpApproximation } = this.props;
    const currentEase = this._isInstant ? 1 : ease;

    const value = lerp(current, target, currentEase, lerpApproximation);

    return value;
  }

  /** Get lerp */
  protected _getLerp(element?: NCustomScroll.IElement) {
    const { lerp: lerpEase, isFpsNormalized } = this.props;

    const fpsMultiplier = isFpsNormalized ? this._raf.ease : 1;

    if (this._isEqualLerp || !element) {
      return lerpEase * fpsMultiplier;
    }

    return (element.customScrollLerp ?? lerpEase) * fpsMultiplier;
  }

  /** Scroll to */
  public scrollTo({ top, left, behavior }: ScrollToOptions) {
    if (typeof left !== 'undefined') {
      if (behavior === 'smooth') {
        this.setTargetLeft(left);
      } else {
        this.scrollLeft = left;
      }
    }

    if (typeof top !== 'undefined') {
      if (behavior === 'smooth') {
        this.setTargetTop(top);
      } else {
        this.scrollTop = top;
      }
    }

    if (behavior === 'smooth') {
      this._enable();
    }
  }

  /** Destroy the module */
  protected _destroy() {
    super._destroy();

    this._disable();

    const { container } = this;

    this._elements.destroy();
    this._raf.destroy();

    this._setClassNames(false);
    container.classList.remove(this.className('_has-scroll'));
    container.classList.remove(this.className('_no-scroll'));
  }
}
