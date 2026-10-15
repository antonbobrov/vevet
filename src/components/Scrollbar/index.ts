import { Module } from '@/base/Module';
import { TModuleProps } from '@/base/Module/types';
import { initVevet } from '@/global/initVevet';
import { noopIfDestroyed, TRequiredProps, isRtl } from '@/internal';
import { addEventListener, clamp } from '@/utils';

import { ScrollbarAction } from './Action';
import { ScrollbarDom } from './Dom';
import { ScrollbarDrag } from './Drag';
import { ScrollbarMetrics } from './Metrics';
import { MUTABLE_PROPS, STATIC_PROPS } from './props';
import { ScrollbarResizer } from './Resizer';
import {
  IScrollbarCallbacksMap,
  IScrollbarMutableProps,
  IScrollbarStaticProps,
} from './types';
import { isSnap } from './utils/isSnap';

type TC = IScrollbarCallbacksMap;
type TS = IScrollbarStaticProps;
type TM = IScrollbarMutableProps;

/**
 * Custom scrollbar for `window`, `HTMLElement`, and {@link Snap} containers.
 *
 * - Hides the native scrollbar on the scroll target and renders track/thumb DOM
 * - Syncs thumb position on scroll (`scroll` or Snap `update`)
 * - Optional thumb drag via {@link Swipe} when `draggable` is enabled
 * - Auto-sizes the thumb and reacts to content/container resize
 * - `autoHide` fades the bar in on scroll and out after inactivity
 *
 * One instance controls a single axis. Use separate instances for `x` and `y`.
 *
 * [Documentation](https://vevetjs.com/docs/Scrollbar)
 *
 * @group Components
 */
export class Scrollbar extends Module<TC, TS, TM> {
  public _getStatic(): TRequiredProps<TS> {
    return { ...super._getStatic(), ...STATIC_PROPS };
  }

  public _getMutable(): TRequiredProps<TM> {
    return { ...super._getMutable(), ...MUTABLE_PROPS };
  }

  private _dom: ScrollbarDom;

  private _metrics: ScrollbarMetrics;

  private _resizer: ScrollbarResizer;

  private _action: ScrollbarAction;

  /** Last `scrollValue` seen by {@link _onScroll} (auto-hide). */
  private _prevScrollValue = 0;

  /** `direction: rtl` on {@link parent} when {@link axis} is `x`. */
  private _rtl = false;

  constructor(props?: TModuleProps<TC, TS, TM, Scrollbar>) {
    super(props);

    this._dom = new ScrollbarDom(this);

    this._rtl = isRtl(this.parent) && this.axis === 'x';

    this._metrics = new ScrollbarMetrics(this);
    this._action = new ScrollbarAction(this);
    this._resizer = new ScrollbarResizer(this, () => this._handleResize());

    if (this.props.draggable) {
      new ScrollbarDrag(this, this._rtl);
    }

    this._setOnscroll();
  }

  get prefix() {
    return `${initVevet().prefix}scrollbar`;
  }

  /** Scrollbar outer element */
  get outer() {
    return this._dom.outer;
  }

  /** The element to which the scrollbar is applied */
  get container() {
    return this._dom.container;
  }

  /** Scrollbar track element (the container of the thumb) */
  get track() {
    return this._dom.track;
  }

  /** Scrollbar thumb element (draggable handle) */
  get thumb() {
    return this._dom.thumb;
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
    return this._dom.domParent;
  }

  /**
   * The actual scrollable element.
   * Returns `document.documentElement` for `window`, otherwise the `container` itself.
   */
  get scrollElement() {
    return this._dom.scrollElement;
  }

  /**
   * Returns the total scroll width/height of the content.
   */
  get scrollSize() {
    return this._metrics.scrollSize;
  }

  /**
   * Returns the total scrollable distance.
   */
  get scrollableSize() {
    return this._metrics.scrollableSize;
  }

  /**
   * Returns scrollTop or scrollLeft of the scrollable element.
   */
  get scrollValue() {
    return this._metrics.scrollValue;
  }

  /** Returns the current track size. */
  get trackSize() {
    return this._metrics.trackSize;
  }

  /** Returns the current thumb size. */
  get thumbSize() {
    return this._metrics.thumbSize;
  }

  protected _handleProps(props: Partial<TM>) {
    super._handleProps(props);

    this.resize();
  }

  /** Listens to DOM `scroll` or Snap `update` on {@link container}. */
  private _setOnscroll() {
    const { container } = this;

    if (isSnap(container)) {
      const destruct = container.on('update', () => this._onScroll());

      this.onDestroy(() => destruct());
    } else {
      const handler = addEventListener(
        container,
        'scroll',
        () => this._onScroll(),
        { passive: true },
      );

      this.onDestroy(() => handler());
    }
  }

  /** Resize the scrollbar. */
  @noopIfDestroyed
  public resize() {
    this._resizer.resize();
  }

  /** After thumb sizing: cancel pending show, render, emit `resize`. */
  private _handleResize() {
    this._action.cancelIn();
    this._render();

    this.callbacks.emit('resize', undefined);
  }

  /** Scroll/Snap update: auto-hide, thumb position, `update` callback. */
  private _onScroll() {
    const { scrollValue } = this;

    if (scrollValue !== this._prevScrollValue) {
      this._action.in();
    }

    this._prevScrollValue = scrollValue;

    this._render();
    this._action.out();
  }

  /** Positions the thumb from scroll progress (RTL-aware on axis `x`). */
  private _render() {
    const { scrollValue, scrollableSize, axis, thumbSize, trackSize } = this;
    const isRtl = this._rtl;

    const normalizedScrollValue = isRtl ? Math.abs(scrollValue) : scrollValue;
    let scrollProgress = clamp(normalizedScrollValue / scrollableSize);

    if (isRtl) {
      scrollProgress = 1 - scrollProgress;
    }

    const translate = (trackSize - thumbSize) * scrollProgress;
    const x = axis === 'x' ? translate : 0;
    const y = axis === 'y' ? translate : 0;

    this.thumb.style.transform = `translate(${x}px, ${y}px)`;

    this.callbacks.emit('update', undefined);
  }
}
