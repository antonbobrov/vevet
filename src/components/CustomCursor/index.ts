import { AnimationFrame } from '../AnimationFrame';
import { NCustomCursor } from './types';
import { Component as ComponentClass } from '@/base/Component';
import { lerp } from '@/utils/math';
import { getApp } from '@/utils/internal/getApp';
import { selectOne } from '@/utils/dom/selectOne';
import { addEventListener } from '@/utils/dom/addEventListener';

export type { NCustomCursor };

/**
 * Creates a smooth custom cursor that replaces the native cursor and follows mouse movements with smoothing and animations.
 * The cursor's appearance and behavior can be customized, and it supports interacting with hoverable elements.
 *
 * @requires Requires styles: `@import '~vevet/lib/styles/components/CustomCursor';`
 *
 * @link See examples https://antonbobrov.github.io/vevet-demo/custom-cursor/
 *
 * @link See docs https://antonbobrov.github.io/vevet/classes/CustomCursor.html
 */
export class CustomCursor<
  StaticProps extends NCustomCursor.IStaticProps = NCustomCursor.IStaticProps,
  ChangeableProps extends
    NCustomCursor.IChangeableProps = NCustomCursor.IChangeableProps,
  CallbacksTypes extends
    NCustomCursor.ICallbacksTypes = NCustomCursor.ICallbacksTypes,
> extends ComponentClass<StaticProps, ChangeableProps, CallbacksTypes> {
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      container: window,
      isEnabled: true,
      isNativeHidden: false,
      width: 36,
      height: 36,
      lerp: 0.2,
      isFpsNormalized: true,
      shouldAutoStop: true,
    };
  }

  get prefix() {
    return `${getApp().prefix}custom-cursor`;
  }

  /** The cursor container. */
  get container() {
    return this._container;
  }

  /** The cursor container. */
  protected _container: Element | Window;

  /** Boolean flag to indicate whether the cursor container is the window. */
  protected _isWindow: boolean;

  /** Returns the DOM parent for the cursor element. */
  get domContainer(): HTMLElement {
    if (this.container instanceof Window) {
      return getApp().body;
    }

    return this.container as HTMLElement;
  }

  /**
   * The outer element of the custom cursor.
   * This is the visual element that represents the cursor on screen.
   */
  get outerElement() {
    return this._outerElement;
  }

  /** The outer element of the custom cursor */
  protected _outerElement!: HTMLElement;

  /**
   * The inner element of the custom cursor.
   * This element is nested inside the outer element and can provide additional styling.
   */
  get innerElement() {
    return this._innerElement;
  }

  /** The inner element of the custom cursor. */
  protected _innerElement!: HTMLElement;

  /** The currently hovered elementю */
  protected _hoveredElement?: NCustomCursor.IHoveredElement | undefined;

  /**
   * The currently hovered element.
   * Stores information about the element that the cursor is currently interacting with.
   */
  get hoveredElement(): NCustomCursor.IHoveredElement | undefined {
    return this._hoveredElement;
  }

  set hoveredElement(value: NCustomCursor.IHoveredElement | undefined) {
    this._hoveredElement = value;
  }

  /** Handler for managing animation frames of the cursor movement. */
  protected _raf!: AnimationFrame;

  /** The current coordinates */
  protected _coords: NCustomCursor.ICoords;

  /**
   * The current coordinates (x, y, width, height).
   * These are updated during cursor movement.
   */
  get coords() {
    return this._coords;
  }

  /** Target coordinates of the cursor for interpolation. */
  protected _targetCoords: NCustomCursor.ICoords;

  /** Target coordinates of the cursor for interpolation. */
  get targetCoords() {
    const { hoveredElement, props } = this;

    let { x, y } = this._targetCoords;
    let { width, height } = props;
    let padding = 0;

    if (hoveredElement) {
      const bounding = hoveredElement.element.getBoundingClientRect();

      if (hoveredElement.isSticky) {
        x = bounding.left + bounding.width / 2;
        y = bounding.top + bounding.height / 2;
      }

      if (hoveredElement.width === 'auto') {
        width = bounding.width;
      } else if (typeof hoveredElement.width === 'number') {
        width = hoveredElement.width;
      }

      if (hoveredElement.height === 'auto') {
        height = bounding.height;
      } else if (typeof hoveredElement.height === 'number') {
        height = hoveredElement.height;
      }

      padding = hoveredElement.padding ?? 0;
    }

    width += padding * 2;
    height += padding * 2;

    return { x, y, width, height };
  }

  constructor(initialProps?: StaticProps & ChangeableProps, canInit = true) {
    super(initialProps, false);

    // Get cursor container
    const container = selectOne(this.props.container);
    if (container) {
      this._container = container;
    } else {
      throw new Error(`No cursor container found for ${this.props.container}`);
    }
    this._isWindow = container instanceof Window;

    // Set default variables
    const { width, height } = this.props;
    this._coords = { x: 0, y: 0, width, height };
    this._targetCoords = { x: 0, y: 0, width, height };

    // Initialize the class
    if (canInit) {
      this.init();
    }
  }

  protected _init() {
    super._init();

    // Create cursor
    this._createCursor();

    // Set events
    this._setEvents();

    // Enable by default
    if (this.props.isEnabled) {
      this._enable();
    }
  }

  protected _onPropsMutate() {
    super._onPropsMutate();

    if (this.props.isEnabled) {
      this._enable();
    } else {
      this._disable();
    }
  }

  /** Creates the custom cursor and appends it to the DOM. */
  protected _createCursor() {
    const { container, domContainer } = this;

    // Hide native cursor
    if (this.props.isNativeHidden) {
      domContainer.style.cursor = 'none';
      domContainer.classList.add(this.className('-hide-default-cursor'));
    }

    // Set class names
    domContainer.classList.add(this.className('-container'));

    // Create outer element
    const outer = document.createElement('div');
    this._outerElement = outer;
    domContainer.append(outer);
    outer.classList.add(this.className(''));
    outer.classList.add(
      this.className(
        container instanceof Window ? '-in-window' : '-in-element',
      ),
    );
    outer.classList.add(this.className('-disabled'));

    // Create inner element
    const inner = document.createElement('div');
    this._innerElement = inner;
    outer.append(inner);
    inner.classList.add(this.className('__inner'));
    inner.classList.add(this.className('-disabled'));
    outer.append(inner);

    // Call events
    this.callbacks.tbt('create', {
      outerElement: this.outerElement,
      innerElement: this.innerElement,
    });

    // Destroy the cursor
    this.addDestroyable(() => {
      domContainer.style.cursor = '';
      domContainer.classList.remove(this.className('-hide-default-cursor'));
      domContainer.classList.remove(this.className('-container'));

      this._outerElement.remove();
      this._innerElement.remove();
    });
  }

  /** Sets up the various event listeners for the cursor, such as mouse movements and clicks. */
  protected _setEvents() {
    const { domContainer } = this;

    this._raf = new AnimationFrame();
    this._raf.on('frame', () => this.render());
    this.addDestroyable(() => this._raf.destroy());

    this.addEventListener(
      domContainer,
      'mouseenter',
      this._handleMouseEnter.bind(this),
    );

    this.addEventListener(
      domContainer,
      'mouseleave',
      this._handleMouseLeave.bind(this),
    );

    this.addEventListener(
      domContainer,
      'mousemove',
      this._handleMouseMove.bind(this),
    );

    this.addEventListener(
      domContainer,
      'mousedown',
      this._handleMouseDown.bind(this),
    );

    this.addEventListener(
      domContainer,
      'mouseup',
      this._handleMouseUp.bind(this),
    );

    this.addEventListener(window, 'blur', this._handleWindowBlur.bind(this));
  }

  /** Handles mouse enter events. */
  protected _handleMouseEnter(evt: MouseEvent) {
    this._coords.x = evt.clientX;
    this._coords.y = evt.clientY;
    this._targetCoords.x = evt.clientX;
    this._targetCoords.y = evt.clientY;

    this.outerElement.classList.add(this.className('-in-action'));
  }

  /** Handles mouse leave events. */
  protected _handleMouseLeave() {
    this.outerElement.classList.remove(this.className('-in-action'));
  }

  /** Handles mouse move events. */
  protected _handleMouseMove(evt: MouseEvent) {
    this._targetCoords.x = evt.clientX;
    this._targetCoords.y = evt.clientY;

    this.outerElement.classList.add(this.className('-in-action'));

    if (this.props.isEnabled) {
      this._raf.play();
    }
  }

  /** Handles mouse down events. */
  protected _handleMouseDown(evt: MouseEvent) {
    if (evt.which === 1) {
      this.outerElement.classList.add(this.className('-click'));
      this.innerElement.classList.add(this.className('-click'));
    }
  }

  /** Handles mouse up events. */
  protected _handleMouseUp() {
    this.outerElement.classList.remove(this.className('-click'));
    this.innerElement.classList.remove(this.className('-click'));
  }

  /** Handles window blur events. */
  protected _handleWindowBlur() {
    this._handleMouseUp();
  }

  /**
   * Sets hover events on an element.
   * @param settingsProp The settings for the hovered element.
   * @param {number} [enterTimeout=100] The timeout before the hover effect is applied.
   * @returns {Object} An object containing a remove method to unregister the hover events.
   */
  public addHoverElement(
    settingsProp: NCustomCursor.IHoveredElement,
    enterTimeout = 100,
  ) {
    const settings: NCustomCursor.IHoveredElement = {
      width: 'auto',
      height: 'auto',
      ...settingsProp,
    };
    const { element } = settings;

    let timeout: NodeJS.Timeout | undefined;

    const mouseEnter = addEventListener(element, 'mouseenter', () => {
      timeout = setTimeout(() => {
        this.hoveredElement = { ...settings };
      }, enterTimeout);
    });

    const mouseLeave = addEventListener(element, 'mouseleave', () => {
      if (timeout) {
        clearTimeout(timeout);
      }

      this.hoveredElement = undefined;
    });

    const remove = () => {
      if (this.hoveredElement?.element === element) {
        this.hoveredElement = undefined;
      }

      mouseEnter();
      mouseLeave();

      if (timeout) {
        clearTimeout(timeout);
      }
    };

    this.addDestroyable(() => remove());

    return () => remove();
  }

  /**
   * Checks if all coordinates are interpolated.
   * @returns {boolean} True if all coordinates are interpolated, false otherwise.
   */
  public get isCoordsInterpolated() {
    const { coords, targetCoords } = this;

    return (
      coords.x === targetCoords.x &&
      coords.y === targetCoords.y &&
      coords.width === targetCoords.width &&
      coords.height === targetCoords.height
    );
  }

  /** Renders the scene. */
  public render() {
    const { props } = this;

    this._calculateCoords();
    const realCoords = this._renderElements();

    if (props.shouldAutoStop && this.isCoordsInterpolated) {
      this._raf.pause();
    }

    // Launch render events
    this.callbacks.tbt('render', realCoords);
  }

  /** Recalculates current coordinates. */
  protected _calculateCoords() {
    const { targetCoords, _coords: coords } = this;

    coords.x = this._lerp(coords.x, targetCoords.x);
    coords.y = this._lerp(coords.y, targetCoords.y);
    coords.width = this._lerp(coords.width, targetCoords.width);
    coords.height = this._lerp(coords.height, targetCoords.height);
  }

  /**
   * Performs linear interpolation.
   * @param {number} current The current value.
   * @param {number} target The target value.
   * @returns {number} The interpolated value.
   */
  protected _lerp(current: number, target: number) {
    const { isFpsNormalized, lerp: ease } = this.props;

    const fpsMultiplier = isFpsNormalized ? this._raf.fpsMultiplier : 1;

    const value = lerp(current, target, ease * fpsMultiplier, 0.02);

    return value;
  }

  /** Renders the cursor elements. */
  protected _renderElements(): NCustomCursor.ICoords {
    const { domContainer, outerElement } = this;
    let { x, y } = this.coords;
    const { width, height } = this.coords;

    if (!this._isWindow) {
      const bounding = domContainer.getBoundingClientRect();
      x -= bounding.left;
      y -= bounding.top;
    }

    // Update DOM coordinates
    outerElement.style.transform = `translate(${x}px, ${y}px)`;
    outerElement.style.setProperty('--cursor-w', `${width}px`);
    outerElement.style.setProperty('--cursor-h', `${height}px`);

    return { x, y, width, height };
  }

  /** Enables cursor animation. */
  protected _enable() {
    this.outerElement.classList.remove(this.className('-disabled'));
    this.innerElement.classList.remove(this.className('-disabled'));

    this._raf.play();
  }

  /** Disables cursor animation. */
  protected _disable() {
    this.outerElement.classList.add(this.className('-disabled'));
    this.innerElement.classList.add(this.className('-disabled'));

    this._raf.pause();
  }
}
