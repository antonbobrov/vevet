import { Module, TModuleOnCallbacksProps } from '@/base';
import { initVevet } from '@/global/initVevet';
import { cnAdd, cnHas, cnRemove, cnToggle } from '@/internal/cn';
import { body, doc, html } from '@/internal/env';
import { noopIfDestroyed } from '@/internal/noopIfDestroyed';
import { TRequiredProps } from '@/internal/requiredProps';
import { getTextDirection } from '@/internal/textDirection';
import { addEventListener, clamp, onResize, toPixels } from '@/utils';

import { ISwipeCoords, Swipe } from '../Swipe';

import { MUTABLE_PROPS, STATIC_PROPS } from './props';
import { createScrollbarStyles } from './styles';
import {
  IScrollbarCallbacksMap,
  IScrollbarMutableProps,
  IScrollbarStaticProps,
} from './types';
import { isSnap } from './utils/isSnap';

export * from './types';

type TC = IScrollbarCallbacksMap;
type TS = IScrollbarStaticProps;
type TM = IScrollbarMutableProps;

/**
 * A custom scrollbar component. Supports both `window` and `HTMLElement` containers.
 *
 * [Documentation](https://vevetjs.com/docs/Scrollbar)
 *
 * @group Components
 */
export class Scrollbar extends Module<TC, TS, TM> {
  /** Get default static properties */
  public _getStatic(): TRequiredProps<TS> {
    return { ...super._getStatic(), ...STATIC_PROPS };
  }

  /** Get default mutable properties */
  public _getMutable(): TRequiredProps<TM> {
    return { ...super._getMutable(), ...MUTABLE_PROPS };
  }

  /**
   * Scrollbar outer element.
   */
  private _outer!: HTMLElement;

  /**
   * Scrollbar track element (the container of the thumb).
   */
  private _track!: HTMLElement;

  /**
   * Scrollbar thumb element (draggable handle).
   */
  private _thumb!: HTMLElement;

  /** Save scroll value on swipe start */
  private _valueOnSwipeStart = 0;

  /** Previous scroll value */
  private _prevScrollValue = 0;

  /** Timeout for scroll action */
  private _addInActionTimeout?: NodeJS.Timeout;

  /** Timeout for scroll action */
  private _removeInActionTimeout?: NodeJS.Timeout;

  /** Detects if the container is RTL */
  private _isRtl = false;

  constructor(
    props?: TS & TM & TModuleOnCallbacksProps<TC, Scrollbar>,
    onCallbacks?: TModuleOnCallbacksProps<TC, Scrollbar>,
  ) {
    super(props, onCallbacks as any);

    // detect features
    this._isRtl = getTextDirection(this.parent) === 'rtl' && this.axis === 'x';

    // No need to remove styles on destroy
    createScrollbarStyles(this.prefix);

    // Create elements
    this._create();

    // Set events
    this._setResize();
    this._setOnscroll();
    this._setSwipe();

    // Initialize
    cnAdd(this.outer, this._cn('_inited'));
  }

  get prefix() {
    return `${initVevet().prefix}scrollbar`;
  }

  /**
   * Scrollbar outer element
   */
  get outer() {
    return this._outer;
  }

  /**
   * The element to which the scrollbar is applied.
   */
  get container() {
    return this.props.container;
  }

  /**
   * Scrollbar track element (the container of the thumb).
   */
  get track() {
    return this._track;
  }

  /**
   * Scrollbar thumb element (draggable handle).
   */
  get thumb() {
    return this._thumb;
  }

  /** Scroll axis */
  get axis() {
    return this.props.axis;
  }

  /**
   * The element where the scrollbar is appended.
   * If `parent` is not set, it defaults to `container` or `document.body` (if applied to `window`).
   */
  get parent() {
    const { parent, container } = this.props;

    if (parent) {
      return parent;
    }

    if (container instanceof Window) {
      return body;
    }

    if (isSnap(container)) {
      return container.container;
    }

    return container;
  }

  /**
   * The actual scrollable element.
   * Returns `document.documentElement` for `window`, otherwise the `container` itself.
   */
  get scrollElement() {
    return this.container instanceof Window ? html : this.container;
  }

  /**
   * Returns the total scroll width/height of the content.
   */
  get scrollSize() {
    const { scrollElement } = this;

    if (isSnap(scrollElement)) {
      return scrollElement.max - scrollElement.min;
    }

    return this.axis === 'x'
      ? scrollElement.scrollWidth
      : scrollElement.scrollHeight;
  }

  /**
   * Returns the total scrollable distance.
   */
  get scrollableSize() {
    const { scrollElement } = this;

    if (isSnap(scrollElement)) {
      return scrollElement.max - scrollElement.min;
    }

    return this.axis === 'x'
      ? this.scrollSize - scrollElement.clientWidth
      : this.scrollSize - scrollElement.clientHeight;
  }

  /**
   * Returns scrollTop or scrollLeft of the scrollable element.
   */
  get scrollValue() {
    const { axis } = this;

    if (isSnap(this.container)) {
      return this.container.loopedCurrent;
    }

    if (this.container instanceof Window) {
      return axis === 'x' ? window.scrollX : window.scrollY;
    }

    return axis === 'x' ? this.container.scrollLeft : this.container.scrollTop;
  }

  /** Returns the current track size. */
  get trackSize() {
    return this.axis === 'x'
      ? this._track.offsetWidth
      : this._track.offsetHeight;
  }

  /** Returns the current thumb size. */
  get thumbSize() {
    return this.axis === 'x'
      ? this._thumb.offsetWidth
      : this._thumb.offsetHeight;
  }

  /** Handles property mutations */
  protected _handleProps(props: Partial<TM>) {
    super._handleProps(props);

    this.resize();
  }

  /** Create elements */
  private _create() {
    const isInWindow = this.container instanceof Window;
    const { scrollElement } = this;

    this._outer = this._createOuter();
    this.parent.appendChild(this._outer);

    this._track = this._createTrack();
    this._outer.appendChild(this._track);

    this._thumb = this._createThumb();
    this._track.appendChild(this._thumb);

    // Apply global styles
    if (isInWindow) {
      this._addTempClassName(html, this._cn('-scrollable'));
      this._addTempClassName(body, this._cn('-scrollable'));
    } else if (scrollElement instanceof HTMLElement) {
      this._addTempClassName(scrollElement, this._cn('-scrollable'));
    }

    this.onDestroy(() => this._outer.remove());
  }

  /** Create outer element */
  private _createOuter() {
    const cn = this._cn.bind(this);

    const { props, axis } = this;

    const element = doc.createElement('div');
    element.setAttribute('data-scrollbar', 'true');
    cnAdd(element, cn(''));
    cnAdd(element, cn(`_${axis}`));

    if (props.class) {
      cnAdd(element, props.class);
    }

    if (this.container instanceof Window) {
      this._addTempClassName(element, this._cn('_in-window'));
    }

    if (props.autoHide) {
      this._addTempClassName(element, this._cn('_auto-hide'));
    }

    return element;
  }

  /** Create track element */
  private _createTrack() {
    const cn = this._cn.bind(this);

    const { axis } = this;

    const element = doc.createElement('div');
    cnAdd(element, cn('__track'));
    cnAdd(element, cn(`__track_${axis}`));

    return element;
  }

  /** Create thumb element */
  private _createThumb() {
    const cn = this._cn.bind(this);

    const element = doc.createElement('div');
    cnAdd(element, cn('__thumb'));
    cnAdd(element, cn(`__thumb_${this.axis}`));

    return element;
  }

  /** Set resize events */
  private _setResize() {
    const { scrollElement } = this;

    // Snap

    if (isSnap(scrollElement)) {
      const destruct = scrollElement.on('resize', () => this.resize());

      this.onDestroy(() => destruct());

      return;
    }

    // DOM

    const createResizeHandler = () => {
      const children = Array.from(scrollElement.children);

      return onResize({
        element: [this.track, this.parent, scrollElement, ...children],
        viewportTarget: 'width',
        resizeDebounce: this.props.resizeDebounce,
        callback: () => this.resize(),
      });
    };

    let resizeHandler = createResizeHandler();
    resizeHandler.resize();

    const childrenObserver = new MutationObserver(() => {
      resizeHandler.remove();
      resizeHandler = createResizeHandler();
      resizeHandler.debounceResize();
    });

    childrenObserver.observe(scrollElement, { childList: true });

    this.onDestroy(() => {
      resizeHandler.remove();
      childrenObserver.disconnect();
    });
  }

  /** Set scroll events */
  private _setOnscroll() {
    const { container } = this;

    if (isSnap(container)) {
      const destruct = container.on('update', () => this._onScroll());
      this.onDestroy(() => destruct());

      return;
    }

    const handler = addEventListener(
      container,
      'scroll',
      () => this._onScroll(),
      { passive: true },
    );

    this.onDestroy(() => handler());
  }

  /** Set swipe events */
  private _setSwipe() {
    if (!this.props.draggable) {
      return;
    }

    const swipe = new Swipe({ container: this.thumb, grabCursor: true });

    swipe.on('start', (coord) => this._handleSwipeStart(coord));
    swipe.on('move', (coord) => this._handleSwipeMove(coord));
    swipe.on('end', (coord) => this._handleSwipeEnd(coord));
    swipe.on('touchmove', (event) => this._handleSwipeTouchMove(event));
    swipe.on('mousemove', (event) => this._handleSwipeMouseMove(event));

    this.onDestroy(() => swipe.destroy());
  }

  /** Handles swipe start */
  private _handleSwipeStart(coords: ISwipeCoords) {
    const { container } = this;

    if (isSnap(container)) {
      this._valueOnSwipeStart = container.target;
    } else {
      this._valueOnSwipeStart = this.scrollValue;
    }

    this.callbacks.emit('swipeStart', coords);
  }

  /** Handle swipe move */
  private _handleSwipeMove(coords: ISwipeCoords) {
    this._onSwipeMove(coords);
    this.callbacks.emit('swipe', coords);
  }

  /** Handle swipe end */
  private _handleSwipeEnd(coords: ISwipeCoords) {
    this.callbacks.emit('swipeEnd', coords);
  }

  /** Handle swipe touchmove */
  private _handleSwipeTouchMove(event: TouchEvent) {
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  /** Handle swipe mousemove */
  private _handleSwipeMouseMove(event: MouseEvent) {
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  /** Resize the scrollbar. */
  @noopIfDestroyed
  public resize() {
    const { scrollableSize, scrollSize, outer, track, thumb, props, axis } =
      this;
    const { autoSize: shouldAutoSize } = props;
    const isHorizontal = axis === 'x';

    // Define if the scrollbar is empty
    cnToggle(outer, this._cn('_empty'), scrollableSize === 0);

    // Save sizes
    const trackSize = isHorizontal ? track.offsetWidth : track.offsetHeight;

    // Calculate minimum thumb size
    const minThumbSize = toPixels(props.minSize);
    let newThumbSize = minThumbSize;

    // Calculate thumb sizes if auto-size is enabled
    if (shouldAutoSize) {
      newThumbSize = clamp(
        trackSize / (scrollSize / trackSize),
        minThumbSize,
        Infinity,
      );
    }

    // Apply sizes
    const { style } = thumb;
    if (isHorizontal) {
      style.width = `${newThumbSize}px`;
    } else {
      style.height = `${newThumbSize}px`;
    }

    // Reset timeouts
    if (this._addInActionTimeout) {
      clearTimeout(this._addInActionTimeout);
    }

    // Render the scrollbar
    this._render();

    // Emit callbacks
    this.callbacks.emit('resize', undefined);
  }

  /** Render the scrollbar. */
  private _render() {
    const { scrollValue, scrollableSize, axis, thumbSize, trackSize } = this;
    const isRtl = this._isRtl;

    const normalizedScrollValue = isRtl ? Math.abs(scrollValue) : scrollValue;
    let scrollProgress = clamp(normalizedScrollValue / scrollableSize);

    if (isRtl) {
      scrollProgress = 1 - scrollProgress;
    }

    const translate = (trackSize - thumbSize) * scrollProgress;
    const x = axis === 'x' ? translate : 0;
    const y = axis === 'y' ? translate : 0;

    this._thumb.style.transform = `translate(${x}px, ${y}px)`;

    // Emit callbacks
    this.callbacks.emit('update', undefined);
  }

  /** Handle scroll update */
  private _onScroll() {
    const { scrollValue, outer } = this;
    const inActionClass = this._cn('_in-action');

    if (scrollValue !== this._prevScrollValue) {
      this._addInActionTimeout = setTimeout(() => {
        if (!cnHas(outer, inActionClass)) {
          cnAdd(outer, inActionClass);
          this.callbacks.emit('show', undefined);
        }
      }, 50);
    } else {
      this._prevScrollValue = scrollValue;
    }

    this._render();

    if (this._removeInActionTimeout) {
      clearTimeout(this._removeInActionTimeout);
    }

    this._removeInActionTimeout = setTimeout(() => {
      cnRemove(outer, inActionClass);
      this.callbacks.emit('hide', undefined);
    }, 500);
  }

  /** Handle swipe move */
  private _onSwipeMove(data: ISwipeCoords) {
    const { scrollElement, axis, trackSize, thumbSize, scrollableSize } = this;

    const valueOnStart = this._valueOnSwipeStart;
    const diff = axis === 'x' ? data.diff.x : data.diff.y;
    let iterator = (diff / (trackSize - thumbSize)) * scrollableSize;

    if (isSnap(scrollElement)) {
      iterator = this._isRtl ? -iterator : iterator;

      const { min, max } = scrollElement;
      const trackLength = scrollElement.max - scrollElement.min;
      const loopCount = scrollElement.props.loop ? scrollElement.loopCount : 0;

      const target = clamp(
        valueOnStart + iterator,
        min + trackLength * loopCount,
        max + trackLength * loopCount,
      );

      scrollElement.setTarget(target);
    } else {
      const target = valueOnStart + iterator;

      scrollElement.scrollTo({
        top: axis === 'y' ? target : undefined,
        left: axis === 'x' ? target : undefined,
        behavior: 'instant',
      });
    }
  }

  /**
   * Destroys the component and cleans up resources.
   */
  protected _destroy() {
    super._destroy();

    if (this._addInActionTimeout) {
      clearTimeout(this._addInActionTimeout);
    }

    if (this._removeInActionTimeout) {
      clearTimeout(this._removeInActionTimeout);
    }
  }
}
