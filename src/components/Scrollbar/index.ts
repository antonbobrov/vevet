import { TRequiredProps } from '@/internal/requiredProps';
import { Module, TModuleOnCallbacksProps } from '@/base';
import {
  IScrollbarCallbacksMap,
  IScrollbarMutableProps,
  IScrollbarStaticProps,
} from './types';
import { initVevet } from '@/global/initVevet';
import { addEventListener, clamp, onResize, toPixels } from '@/utils';
import { createScrollbarStyles } from './styles';
import { ISwipeCoords, Swipe } from '../Swipe';
import { noopIfDestroyed } from '@/internal/noopIfDestroyed';
import { getTextDirection } from '@/internal/textDirection';
import { cnAdd, cnHas, cnRemove, cnToggle } from '@/internal/cn';
import { body, doc, html } from '@/internal/env';

export * from './types';

/**
 * A custom scrollbar component. Supports both `window` and `HTMLElement` containers.
 *
 * [Documentation](https://vevetjs.com/docs/Scrollbar)
 *
 * @group Components
 */
export class Scrollbar<
  C extends IScrollbarCallbacksMap = IScrollbarCallbacksMap,
  S extends IScrollbarStaticProps = IScrollbarStaticProps,
  M extends IScrollbarMutableProps = IScrollbarMutableProps,
> extends Module<C, S, M> {
  /** Get default static properties. */
  public _getStatic(): TRequiredProps<S> {
    return {
      ...super._getStatic(),
      container: window,
      parent: false,
      class: false,
      axis: 'y',
      draggable: true,
      autoHide: true,
      resizeDebounce: 10,
    } as TRequiredProps<S>;
  }

  /** Get default mutable properties. */
  public _getMutable(): TRequiredProps<M> {
    return {
      ...super._getMutable(),
      minSize: 50,
      autoSize: true,
    } as TRequiredProps<M>;
  }

  get prefix() {
    return `${initVevet().prefix}scrollbar`;
  }

  /**
   * The element to which the scrollbar is applied.
   */
  get container() {
    return this._props.container;
  }

  /**
   * Scrollbar outer element.
   */
  protected _outer!: HTMLElement;

  /**
   * Scrollbar outer element
   */
  get outer() {
    return this._outer;
  }

  /**
   * Scrollbar track element (the container of the thumb).
   */
  protected _track!: HTMLElement;

  /**
   * Scrollbar track element (the container of the thumb).
   */
  get track() {
    return this._track;
  }

  /**
   * Scrollbar thumb element (draggable handle).
   */
  protected _thumb!: HTMLElement;

  /**
   * Scrollbar thumb element (draggable handle).
   */
  get thumb() {
    return this._thumb;
  }

  /** Save scroll value on swipe start */
  protected _valueOnSwipeStart = 0;

  /** Timeout for scroll action */
  protected _addInActionTimeout?: NodeJS.Timeout;

  /** Timeout for scroll action */
  protected _removeInActionTimeout?: NodeJS.Timeout;

  /** Previous scroll value */
  protected _prevScrollValue = 0;

  /** Detects if the container is RTL */
  protected _isRtl = false;

  constructor(
    props?: S & M,
    onCallbacks?: TModuleOnCallbacksProps<C, Scrollbar<C, S, M>>,
  ) {
    super(props, onCallbacks as any);

    // detect features
    this._isRtl = getTextDirection(this.parent) === 'rtl';

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

  /** Handles property mutations */
  protected _handleProps() {
    super._handleProps();

    this.resize();
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

    return parent || (container instanceof Window ? body : container);
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

    return this.axis === 'x'
      ? scrollElement.scrollWidth
      : scrollElement.scrollHeight;
  }

  /**
   * Returns the total scrollable distance.
   */
  get scrollableSize() {
    const { scrollElement } = this;

    return this.axis === 'x'
      ? this.scrollSize - scrollElement.clientWidth
      : this.scrollSize - scrollElement.clientHeight;
  }

  /**
   * Returns scrollTop or scrollLeft of the scrollable element.
   */
  get scrollValue() {
    const { axis } = this;

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

  /** Create elements */
  protected _create() {
    const { parent, scrollElement } = this;

    const isInWindow = this.container instanceof Window;

    this._outer = this._createOuter();
    parent.appendChild(this._outer);

    this._track = this._createTrack();
    this._outer.appendChild(this._track);

    this._thumb = this._createThumb();
    this._track.appendChild(this._thumb);

    // Apply global styles
    if (isInWindow) {
      this._addTempClassName(html, this._cn('-scrollable'));
      this._addTempClassName(body, this._cn('-scrollable'));
    } else {
      this._addTempClassName(scrollElement, this._cn('-scrollable'));
    }

    this.onDestroy(() => this._outer.remove());
  }

  /** Create outer element */
  protected _createOuter() {
    const cn = this._cn.bind(this);

    const { props, axis } = this;

    const element = doc.createElement('div');
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
  protected _createTrack() {
    const cn = this._cn.bind(this);

    const { axis } = this;

    const element = doc.createElement('div');
    cnAdd(element, cn('__track'));
    cnAdd(element, cn(`__track_${axis}`));

    return element;
  }

  /** Create thumb element */
  protected _createThumb() {
    const cn = this._cn.bind(this);

    const element = doc.createElement('div');
    cnAdd(element, cn('__thumb'));
    cnAdd(element, cn(`__thumb_${this.axis}`));

    return element;
  }

  /** Set resize events */
  protected _setResize() {
    const createResizeHandler = () => {
      const children = Array.from(this.scrollElement.children);

      return onResize({
        element: [this.track, this.parent, this.scrollElement, ...children],
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

    childrenObserver.observe(this.scrollElement, { childList: true });

    this.onDestroy(() => {
      resizeHandler.remove();
      childrenObserver.disconnect();
    });
  }

  /** Set scroll events */
  protected _setOnscroll() {
    const handler = addEventListener(
      this.container,
      'scroll',
      () => this._onScroll(),
      {
        passive: true,
      },
    );

    this.onDestroy(() => handler());
  }

  /** Set swipe events */
  protected _setSwipe() {
    if (!this.props.draggable) {
      return;
    }

    const swipe = new Swipe({ container: this.thumb, grabCursor: true });

    swipe.on('start', (coords) => {
      this._valueOnSwipeStart = this.scrollValue;
      this.callbacks.emit('swipeStart', coords);
    });

    swipe.on('move', (coords) => {
      this._onSwipeMove(coords);
      this.callbacks.emit('swipe', coords);
    });

    swipe.on('end', (coords) => {
      this.callbacks.emit('swipeEnd', coords);
    });

    swipe.on('touchmove', (event) => {
      event.stopPropagation();
      event.stopImmediatePropagation();
    });

    swipe.on('mousemove', (event) => {
      event.stopPropagation();
      event.stopImmediatePropagation();
    });

    this.onDestroy(() => swipe.destroy());
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
  protected _render() {
    const { scrollValue, scrollableSize, axis, thumbSize, trackSize } = this;
    let scrollProgress = clamp(Math.abs(scrollValue) / scrollableSize);

    if (this._isRtl && axis === 'x') {
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
  protected _onScroll() {
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
  protected _onSwipeMove({ diff }: ISwipeCoords) {
    const { scrollElement, axis, trackSize, thumbSize, scrollableSize } = this;

    const diffCoord = axis === 'x' ? diff.x : diff.y;
    const iterator = (diffCoord / (trackSize - thumbSize)) * scrollableSize;
    const target = this._valueOnSwipeStart + iterator;

    scrollElement.scrollTo({
      top: axis === 'y' ? target : undefined,
      left: axis === 'x' ? target : undefined,
      behavior: 'instant',
    });
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
