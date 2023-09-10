import { IAddEventListener, addEventListener } from 'vevet-dom';
import { ICoords, IBarProps } from './types';
import { IRemovable } from '@/types/general';
import { DraggerMove, NDraggerMove } from '@/components/DraggerMove';
import { IOnScrollCallbackParameter, onScroll } from '@/utils/scroll/onScroll';
import { clamp } from '@/utils/math';
import { getScrollValues } from '@/utils/scroll';

export default class Bar {
  private _outer: HTMLElement;

  get outer() {
    return this._outer;
  }

  private _thumb: HTMLElement;

  get thumb() {
    return this._thumb;
  }

  get prefix() {
    return this.props.prefix;
  }

  get isHorizontal() {
    return this.props.direction === 'x';
  }

  get isVertical() {
    return !this.isHorizontal;
  }

  get scrollElement() {
    return this.props.container instanceof Window
      ? document.documentElement
      : this.props.container;
  }

  get scrollLine() {
    const { scrollElement } = this;

    return this.isHorizontal
      ? scrollElement.scrollWidth - scrollElement.clientWidth
      : scrollElement.scrollHeight - scrollElement.clientHeight;
  }

  get scrollWidth() {
    return this.scrollElement.scrollWidth;
  }

  get scrollHeight() {
    return this.scrollElement.scrollHeight;
  }

  private _outerHeight: number;

  private _outerWidth: number;

  private _thumbHeight: number;

  private _thumbWidth: number;

  private _prevScrollValue: number;

  private _coordsAtDragStart: ICoords;

  private _listeners?: IAddEventListener[];

  private _scrollEvent?: IRemovable;

  private _actionTimeout?: NodeJS.Timeout;

  private _dragger?: DraggerMove;

  get props() {
    return this._props;
  }

  constructor(private _props: IBarProps) {
    const { direction, domParent, container, canAutoHide } = _props;

    // set default vars
    this._outerHeight = 0;
    this._outerWidth = 0;
    this._thumbHeight = 0;
    this._thumbWidth = 0;
    this._prevScrollValue = 0;
    this._coordsAtDragStart = { scrollLeft: 0, scrollTop: 0 };

    // create container
    const outer = document.createElement('div');
    this._outer = outer;
    outer.classList.add(this.className(''));
    outer.classList.add(this.className(`_${direction}`));
    if (container instanceof Window) {
      outer.classList.add(this.className('_in-window'));
    }
    outer.classList.toggle(this.className('_auto-hide'), canAutoHide);
    domParent.append(outer);

    // create a thumb
    const thumb = document.createElement('div');
    this._thumb = thumb;
    thumb.classList.add(this.className('__thumb'));
    thumb.classList.add(this.className(`__thumb_${direction}`));
    outer.append(thumb);

    // set events
    this._setEvents();
  }

  private className(value: string) {
    return `${this.props.prefix}${value}`;
  }

  /** Set scrolblar events */
  private _setEvents() {
    if (!this._listeners) {
      this._listeners = [];
    }

    const { outer, thumb, props } = this;

    this._listeners.push(
      addEventListener(outer, 'mouseenter', () => this._handleHover(true))
    );
    this._listeners.push(
      addEventListener(outer, 'mouseleave', () => this._handleHover(false))
    );

    this._scrollEvent = onScroll({
      container: props.container,
      callback: (data) => this._handleScroll(data),
    });

    if (this.props.isDraggable) {
      this._dragger = new DraggerMove({ container: thumb });

      this._dragger.addCallback('start', () => {
        this._coordsAtDragStart = getScrollValues(this.props.container)!;
      });

      this._dragger.addCallback('move', (data) => this._handleThumbDrag(data));
    }
  }

  /** Remove events */
  private _removeEvents() {
    this._listeners?.forEach((listener) => listener.remove());
    this._scrollEvent?.remove();
    this._dragger?.destroy();
  }

  /** Handle hover state */
  private _handleHover(isHovered: boolean) {
    const className = this.className('_is-hovered');

    this.outer.classList.toggle(className, isHovered);
  }

  /** Handle Scroll Event */
  private _handleScroll({ scrollLeft, scrollTop }: IOnScrollCallbackParameter) {
    let hasChanged = false;

    // check if changes happened
    if (this.isHorizontal) {
      hasChanged = scrollLeft !== this._prevScrollValue;
      this._prevScrollValue = scrollLeft;
    } else {
      hasChanged = scrollTop !== this._prevScrollValue;
      this._prevScrollValue = scrollTop;
    }

    // continue if there are changes
    if (!hasChanged) {
      return;
    }

    // set auto hide
    if (this.props.canAutoHide && hasChanged) {
      const actionClassName = this.className('_in-action');

      this.outer.classList.add(actionClassName);

      if (this._actionTimeout) {
        clearTimeout(this._actionTimeout);
      }

      this._actionTimeout = setTimeout(
        () => this.outer.classList.remove(actionClassName),
        500
      );
    }

    // render elements
    this._renderThumb();
  }

  /** Event on dragger move */
  private _handleThumbDrag({
    event,
    coords,
    start,
  }: NDraggerMove.ICallbacksTypes['move']) {
    event.preventDefault();

    const { scrollLine } = this;
    const { container } = this.props;

    // calculate scroll iterators
    const leftIterator =
      ((coords.x - start.x) / (this._outerWidth - this._thumbWidth)) *
      scrollLine;
    const topIterator =
      ((coords.y - start.y) / (this._outerHeight - this._thumbHeight)) *
      scrollLine;

    // calculate new scroll values
    let { scrollLeft, scrollTop } = this._coordsAtDragStart;
    if (this.isHorizontal) {
      scrollLeft += leftIterator;
    } else {
      scrollTop += topIterator;
    }

    // apply the values
    container.scrollTo({
      top: scrollTop,
      left: scrollLeft,
      behavior:
        'isSmoothScroll' in this.props.container
          ? this.props.scrollBehavior
          : 'auto',
    });
  }

  /** Render thumb */
  private _renderThumb() {
    const progress = clamp(this._prevScrollValue / this.scrollLine, [0, 1]);

    const x = this.isHorizontal
      ? (this._outerWidth - this._thumbWidth) * progress
      : 0;
    const y = this.isVertical
      ? (this._outerHeight - this._thumbHeight) * progress
      : 0;

    this._thumb.style.transform = `translate(${x}px, ${y}px)`;
  }

  /** Resize the scene */
  public resize() {
    const {
      outer,
      thumb,
      scrollLine,
      scrollWidth,
      scrollHeight,
      isHorizontal,
    } = this;

    const { minSize, hasAutoSize } = this.props;

    // get outer sizes
    this._outerHeight = outer.clientHeight;
    this._outerWidth = outer.clientWidth;

    // calculate thumb sizes
    if (hasAutoSize) {
      if (isHorizontal) {
        const barSize = clamp(
          this._outerWidth / (scrollWidth / (scrollWidth - scrollLine)),
          [minSize, Infinity]
        );
        thumb.style.width = `${barSize}px`;
      } else {
        const barSize = clamp(
          this._outerHeight / (scrollHeight / (scrollHeight - scrollLine)),
          [minSize, Infinity]
        );
        thumb.style.height = `${barSize}px`;
      }
    }

    // get thumb sizes
    this._thumbHeight = thumb.clientHeight;
    this._thumbWidth = thumb.clientWidth;

    // define if empty
    outer.classList.toggle(this.className('_is-empty'), scrollLine === 0);

    // render elements
    this._renderThumb();
  }

  public destroy() {
    this._removeEvents();

    if (this._actionTimeout) {
      clearTimeout(this._actionTimeout);
    }

    this._outer.remove();
  }
}
