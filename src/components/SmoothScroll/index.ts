import { selectOne } from 'vevet-dom';
import { Component as ComponentClass } from '@/base/Component';
import { NSmoothScroll } from './types';
import { IScrollLike } from '@/types/general';
import { clamp, lerp } from '@/utils/math';
import { normalizeWheel } from '@/utils/scroll';
import { Elements } from './Elements';
import { AnimationFrame } from './AnimatonFrame';
import { onResize } from '@/utils/listeners/onResize';

export type { NSmoothScroll };

/**
 * Smooth scrolling
 */
export class SmoothScroll<
    StaticProps extends NSmoothScroll.IStaticProps = NSmoothScroll.IStaticProps,
    ChangeableProps extends NSmoothScroll.IChangeableProps = NSmoothScroll.IChangeableProps,
    CallbacksTypes extends NSmoothScroll.ICallbacksTypes = NSmoothScroll.ICallbacksTypes
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
    return `${this.app.prefix}smooth-scroll`;
  }

  /** Scroll container */
  private _container: HTMLElement;

  /** Scroll container */
  get container() {
    return this._container;
  }

  private _elements: Elements;

  /**
   * Scroll wrapper. If the element does not exist indide the `container`,
   * it will be created automatically
   */
  get wrapper() {
    return this._elements.wrapper;
  }

  /** `scrollLeft` target value */
  protected _targetLeft: number;

  /** `scrollLeft` target value */
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

  /** `scrollTop` target value */
  protected _targetTop: number;

  /** `scrollTop` target value */
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

  /** `scrollLeft` */
  protected _scrollLeft: number;

  /** `scrollLeft` */
  get scrollLeft() {
    return this._scrollLeft;
  }

  set scrollLeft(value) {
    this.setTargetLeft(value);
    this._scrollLeft = this._targetLeft;
    this._enable();
  }

  /** `scrollTop` */
  protected _scrollTop: number;

  /** `scrollTop` */
  get scrollTop() {
    return this._scrollTop;
  }

  set scrollTop(value) {
    this.setTargetTop(value);
    this._scrollTop = this._targetTop;
    this._enable();
  }

  /** Scroll width */
  protected _scrollWidth: number;

  /** Scroll width */
  get scrollWidth() {
    return this._scrollWidth;
  }

  /** Scroll height */
  protected _scrollHeight: number;

  /** Scroll height */
  get scrollHeight() {
    return this._scrollHeight;
  }

  /** Container width */
  protected _clientWidth: number;

  /** Container width */
  get clientWidth() {
    return this._clientWidth;
  }

  /** Container height */
  protected _clientHeight: number;

  /** Container height */
  get clientHeight() {
    return this._clientHeight;
  }

  /** Wrapper width */
  protected _wrapperWidth: number;

  /** Wrapper height */
  protected _wrapperHeight: number;

  /** Maximum scrollable area of the X axis */
  get maxScrollableWidth() {
    return this.scrollWidth - this.clientWidth;
  }

  /** Maximum scrollable area of the Y axis */
  get maxScrollableHeight() {
    return this.scrollHeight - this.clientHeight;
  }

  /** Has scroll */
  get hasScroll() {
    return this.maxScrollableHeight > 0 || this.maxScrollableWidth > 0;
  }

  /** If the approximation between the target and current scroll values must be instantaneous */
  protected _isInstant?: boolean;

  /** Animation frame */
  private _animationFrame: AnimationFrame;

  /** Frame index */
  protected _frameIndex: number;

  /** Equal lerp for all elements */
  protected _isEqualLerp: boolean;

  get isSmoothScroll() {
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
    this._setDirectionClassNames(true);

    // create animation frame
    this._animationFrame = new AnimationFrame({
      callback: () => this.render(),
      outerAnimationFrame: animationFrame as any,
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

  protected _setDirectionClassNames(isActive: boolean) {
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
      this.handleWheel(event)
    );

    // prevent native scroll
    this.addEventListener(this.container, 'scroll', () => {
      this.container.scrollTop = 0;
      this.container.scrollLeft = 0;
    });
  }

  /** Set resize events */
  private _setResize() {
    const { viewportTarget, resizeDebounce } = this.props;

    // resize handler
    const resizeHandler = onResize({
      onResize: ({ trigger }) => this.resize(trigger !== 'ResizeObserver'),
      element: [this.container, this.wrapper],
      viewportTarget,
      resizeDebounce,
      hasBothEvents: true,
    });
    this.addDestroyableAction(() => resizeHandler.remove());

    // initial resize
    resizeHandler.resize();

    // if resize observer not used, we recalculate sizes on each 10th frame
    if (!resizeHandler.hasResizeObserver) {
      this.addCallback(
        'render',
        (() => {
          if (this._frameIndex % 10 === 0) {
            this._recalculateScrollSizes();
          }
        }) as any,
        { isProtected: true, name: this.name }
      );
    }
  }

  /** Handle properties mutation */
  protected _onPropsMutate() {
    super._onPropsMutate();

    this._setDirectionClassNames(true);

    this.resize();
    this._toggle();
  }

  /** Recalculate scroll sizes */
  protected _recalculateScrollSizes() {
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
    isNative = false
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
    this._elements.updateElementsProp(this.scrollLeft, this.scrollTop);
  }

  /** Event on wheel */
  public handleWheel(event: WheelEvent) {
    const {
      isEnabled,
      hasWheel,
      hasStopPropagation,
      isInversedHandlerDirection,
    } = this.props;

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

    // get normalized delta
    const { pixelX, pixelY } = normalizeWheel(event);

    // set new scroll targets
    const leftIterator = isInversedHandlerDirection ? pixelY : pixelX;
    const topIterator = isInversedHandlerDirection ? pixelX : pixelY;
    this.setTargetLeft(this.targetLeft + leftIterator);
    this.setTargetTop(this.targetTop + topIterator);

    // play animation frame
    this._enable();

    // launch events
    this.callbacks.tbt('wheel', { event });
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

    this._animationFrame.enable();
  }

  /** Disable scrolling */
  protected _disable() {
    this._animationFrame.disable();
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

      element.smoothScrollLeft = this._lerp(
        element.smoothScrollLeft,
        this._targetLeft,
        elementLerp
      );

      element.smoothScrollTop = this._lerp(
        element.smoothScrollTop,
        this._targetTop,
        elementLerp
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
    const isInnerInterpolated = this._elements.checkAllScrollValuesEqual();

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
  protected _getLerp(element?: NSmoothScroll.IElement) {
    const { lerp: lerpEase, isFpsNormalized } = this.props;

    const fpsMultiplier = isFpsNormalized
      ? this._animationFrame.easeMultiplier
      : 1;

    if (this._isEqualLerp || !element) {
      return lerpEase * fpsMultiplier;
    }

    return (element.smoothScrollLerp ?? lerpEase) * fpsMultiplier;
  }

  /** Scroll to */
  public scrollTo({ top, left, behavior }: ScrollToOptions) {
    if (typeof left !== 'undefined') {
      if (behavior === 'smooth') {
        this.setTargetLeft(left);
      } else {
        this._isEqualLerp = true;
        this.scrollLeft = left;
      }
    }

    if (typeof top !== 'undefined') {
      if (behavior === 'smooth') {
        this.setTargetTop(top);
      } else {
        this._isEqualLerp = true;
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

    this._elements.destroy();
    this._animationFrame.destroy();

    this._setDirectionClassNames(false);
    this._container.classList.remove(this.className('_has-scroll'));
    this._container.classList.remove(this.className('_no-scroll'));
  }
}
