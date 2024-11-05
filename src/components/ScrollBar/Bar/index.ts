import { IBarProps } from './types';
import { IRemovable } from '@/types/general';
import { DraggerMove, NDraggerMove } from '@/components/DraggerMove';
import { IOnScrollCallbackParameter, onScroll } from '@/utils/scroll/onScroll';
import { clamp } from '@/utils/math';
import { getScrollValues } from '@/utils/scroll';
import { addEventListener } from '@/utils/dom/addEventListener';

/**
 * Represents a custom scroll bar with a draggable thumb.
 */
export class Bar {
  /** The outer container element of the scroll bar */
  private _outer: HTMLElement;

  /**
   * Gets the outer container of the scroll bar.
   */
  get outer() {
    return this._outer;
  }

  /** The scroll bar thumb element */
  private _thumb: HTMLElement;

  /**
   * Gets the thumb element of the scroll bar.
   */
  get thumb() {
    return this._thumb;
  }

  /** The outer height of the scroll bar container */
  private _outerHeight = 0;

  /** The outer width of the scroll bar container */
  private _outerWidth = 0;

  /** The thumb's height */
  private _thumbHeight = 0;

  /** The thumb's width */
  private _thumbWidth = 0;

  /** Stores the previous scroll value for comparison */
  private _prevScrollValue = 0;

  /** Stores the coordinates of the scroll element at the start of dragging */
  private _coordsAtDragStart = { scrollLeft: 0, scrollTop: 0 };

  /** Stores the list of event listeners */
  private _listeners: (() => void)[] = [];

  /** The scroll event handler */
  private _scrollEvent?: IRemovable;

  /** Timeout for handling auto-hide behavior */
  private _actionTimeout?: NodeJS.Timeout;

  /** Dragger instance for handling thumb dragging */
  private _dragger?: DraggerMove;

  /**
   * Determines if the scroll bar is horizontal.
   */
  get isHorizontal() {
    return this.props.direction === 'x';
  }

  /**
   * Determines if the scroll bar is vertical.
   */
  get isVertical() {
    return !this.isHorizontal;
  }

  /**
   * Gets the scrollable element.
   */
  get scrollElement() {
    return this.props.container instanceof Window
      ? document.documentElement
      : this.props.container;
  }

  /**
   * Gets the total scrollable distance (scroll line) for the scroll bar.
   */
  get scrollLine() {
    const { scrollElement } = this;

    return this.isHorizontal
      ? scrollElement.scrollWidth - scrollElement.clientWidth
      : scrollElement.scrollHeight - scrollElement.clientHeight;
  }

  /**
   * Gets the total width of the scrollable element.
   */
  get scrollWidth() {
    return this.scrollElement.scrollWidth;
  }

  /**
   * Gets the total height of the scrollable element.
   */
  get scrollHeight() {
    return this.scrollElement.scrollHeight;
  }

  /**
   * Gets the scroll bar properties.
   */
  get props() {
    return this._props;
  }

  constructor(private _props: IBarProps) {
    const { direction, domParent, container, canAutoHide } = _props;

    // Create the outer scroll bar container
    const outer = document.createElement('div');
    this._outer = outer;
    outer.classList.add(this.className(''));
    outer.classList.add(this.className(`_${direction}`));
    if (container instanceof Window) {
      outer.classList.add(this.className('_in-window'));
    }
    outer.classList.toggle(this.className('_auto-hide'), canAutoHide);
    domParent.append(outer);

    // Create the thumb for the scroll bar
    const thumb = document.createElement('div');
    this._thumb = thumb;
    thumb.classList.add(this.className('__thumb'));
    thumb.classList.add(this.className(`__thumb_${direction}`));
    outer.append(thumb);

    // Set events for the scroll bar
    this._setEvents();
  }

  /**
   * Generates the scroll bar's class name based on the prefix and value.
   * @param value - The suffix to add to the prefix for the class name.
   */
  private className(value: string) {
    return `${this.props.prefix}${value}`;
  }

  /**
   * Sets the necessary events for the scroll bar, such as hover and scroll events.
   */
  private _setEvents() {
    const { outer, thumb, props } = this;

    // Add hover events for the outer container
    this._listeners.push(
      addEventListener(outer, 'mouseenter', () => this._handleHover(true)),
    );
    this._listeners.push(
      addEventListener(outer, 'mouseleave', () => this._handleHover(false)),
    );

    // Add scroll event for the container
    this._scrollEvent = onScroll({
      container: props.container,
      callback: (data) => this._handleScroll(data),
    });

    // Set drag events if the scroll bar is draggable
    if (this.props.isDraggable) {
      this._dragger = new DraggerMove({ container: thumb });

      this._dragger.addCallback('start', () => {
        this._coordsAtDragStart = getScrollValues(this.props.container)!;
      });

      this._dragger.addCallback('move', (data) => this._handleThumbDrag(data));
    }
  }

  /**
   * Removes all the event listeners for the scroll bar.
   */
  private _removeEvents() {
    this._listeners?.forEach((listener) => listener());
    this._scrollEvent?.remove();
    this._dragger?.destroy();
  }

  /**
   * Handles the hover state of the scroll bar.
   * @param isHovered - Whether the scroll bar is hovered or not.
   */
  private _handleHover(isHovered: boolean) {
    const className = this.className('_is-hovered');
    this.outer.classList.toggle(className, isHovered);
  }

  /**
   * Handles the scroll event by updating the thumb position and auto-hide behavior.
   * @param param - The scroll position of the container.
   */
  private _handleScroll({ scrollLeft, scrollTop }: IOnScrollCallbackParameter) {
    let hasChanged = false;

    // Check if changes happened
    if (this.isHorizontal) {
      hasChanged = scrollLeft !== this._prevScrollValue;
      this._prevScrollValue = scrollLeft;
    } else {
      hasChanged = scrollTop !== this._prevScrollValue;
      this._prevScrollValue = scrollTop;
    }

    // If no changes, return early
    if (!hasChanged) {
      return;
    }

    // Handle auto-hide behavior
    if (this.props.canAutoHide && hasChanged) {
      const actionClassName = this.className('_in-action');
      this.outer.classList.add(actionClassName);

      if (this._actionTimeout) {
        clearTimeout(this._actionTimeout);
      }

      this._actionTimeout = setTimeout(
        () => this.outer.classList.remove(actionClassName),
        500,
      );
    }

    // Render the thumb
    this._renderThumb();
  }

  /**
   * Handles the thumb dragging event by calculating new scroll values based on the drag movement.
   * @param param - The drag event data.
   */
  private _handleThumbDrag({
    event,
    coords,
    start,
  }: NDraggerMove.ICallbacksTypes['move']) {
    event.preventDefault();

    const { scrollLine } = this;
    const { container } = this.props;

    // Calculate new scroll values based on the drag movement
    const leftIterator =
      ((coords.x - start.x) / (this._outerWidth - this._thumbWidth)) *
      scrollLine;
    const topIterator =
      ((coords.y - start.y) / (this._outerHeight - this._thumbHeight)) *
      scrollLine;

    let { scrollLeft, scrollTop } = this._coordsAtDragStart;
    if (this.isHorizontal) {
      scrollLeft += leftIterator;
    } else {
      scrollTop += topIterator;
    }

    // Apply new scroll values
    container.scrollTo({
      top: scrollTop,
      left: scrollLeft,
      behavior:
        'isCustomScroll' in this.props.container
          ? this.props.scrollBehavior
          : 'auto',
    });
  }

  /**
   * Renders the thumb position based on the current scroll position.
   */
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

  /**
   * Resizes the scroll bar by recalculating the thumb and outer container sizes.
   */
  public resize() {
    const {
      outer,
      thumb,
      scrollLine,
      scrollWidth,
      scrollHeight,
      isHorizontal,
    } = this;

    const { minSize, shouldAutoSize } = this.props;

    // Define if the scrollbar is empty
    outer.classList.toggle(this.className('_is-empty'), scrollLine === 0);

    // Get outer sizes
    this._outerHeight = outer.clientHeight;
    this._outerWidth = outer.clientWidth;

    // Calculate thumb sizes if auto-size is enabled
    if (shouldAutoSize) {
      if (isHorizontal) {
        const barSize = clamp(
          this._outerWidth / (scrollWidth / (scrollWidth - scrollLine)),
          [minSize, Infinity],
        );
        thumb.style.width = `${barSize}px`;
      } else {
        const barSize = clamp(
          this._outerHeight / (scrollHeight / (scrollHeight - scrollLine)),
          [minSize, Infinity],
        );
        thumb.style.height = `${barSize}px`;
      }
    }

    // Get thumb sizes
    this._thumbHeight = thumb.clientHeight;
    this._thumbWidth = thumb.clientWidth;

    // Render the thumb position
    this._renderThumb();
  }

  /**
   * Destroys the scroll bar by removing events and clearing timeouts.
   */
  public destroy() {
    this._removeEvents();

    if (this._actionTimeout) {
      clearTimeout(this._actionTimeout);
    }

    this._outer.remove();
  }
}
