import { TRequiredProps } from '@/internal/requiredProps';
import {
  ICursorCallbacksMap,
  ICursorFullCoords,
  ICursorHoveredElement,
  ICursorMutableProps,
  ICursorStaticProps,
  ICursorType,
} from './types';
import { Module } from '@/base/Module';
import { Raf } from '../Raf';
import { addEventListener } from '@/utils/listeners';
import { initVevet } from '@/global/initVevet';
import { lerp } from '@/utils/math';
import { createCursorStyles } from './styles';
import { noopIfDestroyed } from '@/internal/noopIfDestroyed';

export * from './types';

/**
 * A customizable custom cursor component with smooth animations and hover interactions.
 * Supports dynamic appearance changes and enhanced user interaction.
 *
 * [Documentation](https://vevetjs.com/docs/Cursor)
 *
 * @group Components
 */
export class Cursor<
  CallbacksMap extends ICursorCallbacksMap = ICursorCallbacksMap,
  StaticProps extends ICursorStaticProps = ICursorStaticProps,
  MutableProps extends ICursorMutableProps = ICursorMutableProps,
> extends Module<CallbacksMap, StaticProps, MutableProps> {
  /** Get default static properties */
  public _getStatic(): TRequiredProps<StaticProps> {
    return {
      ...super._getStatic(),
      container: window,
      hideNative: false,
    } as TRequiredProps<StaticProps>;
  }

  /** Get default mutable properties */
  public _getMutable(): TRequiredProps<MutableProps> {
    return {
      ...super._getMutable(),
      enabled: true,
      width: 50,
      height: 50,
      lerp: 0.2,
      autoStop: true,
    } as TRequiredProps<MutableProps>;
  }

  /**
   * Classname prefix for styling elements.
   */
  get prefix() {
    return `${initVevet().prefix}cursor`;
  }

  /** The cursor container */
  get container() {
    return this.props.container;
  }

  /** Returns the DOM parent for the cursor element. */
  get domContainer() {
    if (this.container instanceof Window) {
      return initVevet().body;
    }

    return this.container as HTMLElement;
  }

  /** The outer element of the custom cursor */
  protected _outer!: HTMLElement;

  /**
   * The outer element of the custom cursor.
   * This is the visual element that represents the cursor on screen.
   */
  get outer() {
    return this._outer;
  }

  /** The inner element of the custom cursor. */
  protected _inner!: HTMLElement;

  /**
   * The inner element of the custom cursor.
   * This element is nested inside the outer element and can provide additional styling.
   */
  get inner() {
    return this._inner;
  }

  /** The currently hovered element */
  protected _hoveredElement?: ICursorHoveredElement;

  /**
   * The currently hovered element.
   * Stores information about the element that the cursor is currently interacting with.
   */
  get hoveredElement() {
    return this._hoveredElement;
  }

  set hoveredElement(value) {
    this._hoveredElement = value;
  }

  /** Request animation frame handler */
  protected _raf!: Raf;

  /** The current coordinates */
  protected _coords: ICursorFullCoords;

  /**
   * The current coordinates (x, y, width, height).
   * These are updated during cursor movement.
   */
  get coords() {
    return this._coords;
  }

  /** Target coordinates of the cursor (without smooth interpolation). */
  protected _targetCoords: ICursorFullCoords;

  /** Target coordinates of the cursor (without smooth interpolation). */
  get targetCoords() {
    const { hoveredElement, props } = this;

    let { x, y } = this._targetCoords;
    let { width, height } = props;
    let padding = 0;

    if (hoveredElement) {
      const bounding = hoveredElement.element.getBoundingClientRect();

      if (hoveredElement.sticky) {
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

  /** Defines if the cursor has been moved after initialization */
  protected _isFirstMove = true;

  /** Cursor types */
  protected _types: ICursorType[];

  /** Active cursor types */
  protected _activeTypes: string[];

  constructor(props?: StaticProps & MutableProps) {
    super(props);

    // Set default variables
    const { width, height, enabled: isEnabled } = this.props;
    this._coords = { x: 0, y: 0, width, height };
    this._targetCoords = { x: 0, y: 0, width, height };
    this._types = [];
    this._activeTypes = [];

    // No need to remove styles on destroy
    createCursorStyles(this.prefix);

    // Setup
    this._createElements();
    this._setEvents();

    // enable by default
    this._toggle(isEnabled);
  }

  /** Creates the custom cursor and appends it to the DOM. */
  protected _createElements() {
    const { container, domContainer } = this;
    const cn = this._cn.bind(this);

    // Hide native cursor
    if (this.props.hideNative) {
      domContainer.style.cursor = 'none';

      this._addTempClassName(domContainer, cn('-hide-default'));
    }

    // Set class names
    this._addTempClassName(domContainer, cn('-container'));

    // Set container position
    if (domContainer !== initVevet().body) {
      domContainer.style.position = 'relative';
    }

    // Create outer element
    const outer = document.createElement('div');
    domContainer.append(outer);
    outer.classList.add(cn(''));
    outer.classList.add(
      cn(container instanceof Window ? '-in-window' : '-in-element'),
    );
    outer.classList.add(cn('-disabled'));

    // Create inner element
    const inner = document.createElement('div');
    outer.append(inner);
    inner.classList.add(cn('__inner'));
    inner.classList.add(cn('-disabled'));
    outer.append(inner);

    // assign
    this._outer = outer;
    this._inner = inner;

    // Destroy the cursor
    this.onDestroy(() => {
      domContainer.style.cursor = '';

      inner.remove();
      outer.remove();
    });
  }

  /** Sets up the various event listeners for the cursor, such as mouse movements and clicks. */
  protected _setEvents() {
    const { domContainer } = this;

    this._raf = new Raf({ enabled: false });
    this._raf.on('frame', () => this.render());

    const mouseenter = addEventListener(
      domContainer,
      'mouseenter',
      this._handleMouseEnter.bind(this),
    );

    const mouseleave = addEventListener(
      domContainer,
      'mouseleave',
      this._handleMouseLeave.bind(this),
    );

    const mousemove = addEventListener(
      domContainer,
      'mousemove',
      this._handleMouseMove.bind(this),
    );

    const mousedown = addEventListener(
      domContainer,
      'mousedown',
      this._handleMouseDown.bind(this),
    );

    const mouseup = addEventListener(
      domContainer,
      'mouseup',
      this._handleMouseUp.bind(this),
    );

    const blur = addEventListener(
      window,
      'blur',
      this._handleWindowBlur.bind(this),
    );

    this.onDestroy(() => {
      this._raf.destroy();

      mouseenter();
      mouseleave();
      mousemove();
      mousedown();
      mouseup();
      blur();
    });
  }

  /** Handles property mutations */
  protected _handleProps() {
    super._handleProps();

    this._toggle(this.props.enabled);
  }

  /** Enables cursor animation. */
  protected _toggle(enabled: boolean) {
    const className = this._cn('-disabled');

    this.outer.classList.toggle(className, !enabled);
    this.inner.classList.toggle(className, !enabled);

    this._raf.updateProps({ enabled });
  }

  /** Handles mouse enter events. */
  protected _handleMouseEnter(evt: MouseEvent) {
    this._coords.x = evt.clientX;
    this._coords.y = evt.clientY;
    this._targetCoords.x = evt.clientX;
    this._targetCoords.y = evt.clientY;

    this.outer.classList.add(this._cn('-visible'));
  }

  /** Handles mouse leave events. */
  protected _handleMouseLeave() {
    this.outer.classList.remove(this._cn('-visible'));
  }

  /** Handles mouse move events. */
  protected _handleMouseMove(evt: MouseEvent) {
    this._targetCoords.x = evt.clientX;
    this._targetCoords.y = evt.clientY;

    if (this._isFirstMove) {
      this._coords.x = evt.clientX;
      this._coords.y = evt.clientY;

      this._isFirstMove = false;
    }

    this.outer.classList.add(this._cn('-visible'));

    if (this.props.enabled) {
      this._raf.play();
    }
  }

  /** Handles mouse down events. */
  protected _handleMouseDown(evt: MouseEvent) {
    const className = this._cn('-click');

    if (evt.which === 1) {
      this.outer.classList.add(className);
      this.inner.classList.add(className);
    }
  }

  /** Handles mouse up events. */
  protected _handleMouseUp() {
    const className = this._cn('-click');

    this.outer.classList.remove(className);
    this.inner.classList.remove(className);
  }

  /** Handles window blur events. */
  protected _handleWindowBlur() {
    this._handleMouseUp();
  }

  /**
   * Registers an element to interact with the cursor, enabling dynamic size and position changes based on hover effects.
   * @param settings The settings for the hovered element.
   * @param {number} [enterTimeout=100] The timeout before the hover effect is applied.
   * @returns Returns a destructor
   */
  @noopIfDestroyed
  public attachElement(settings: ICursorHoveredElement, enterTimeout = 100) {
    const data: ICursorHoveredElement = {
      width: null,
      height: null,
      ...settings,
    };

    const { element } = data;

    let timeout: NodeJS.Timeout | undefined;

    if (element.matches(':hover')) {
      this._handleElementEnter(data);
    }

    const mouseEnter = addEventListener(element, 'mouseenter', () => {
      timeout = setTimeout(() => this._handleElementEnter(data), enterTimeout);
    });

    const mouseLeave = addEventListener(element, 'mouseleave', () => {
      if (timeout) {
        clearTimeout(timeout);
      }

      this._handleElementLeave(data);
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

    this.onDestroy(() => remove());

    return () => remove();
  }

  /** Handle element enter */
  protected _handleElementEnter(data: ICursorHoveredElement) {
    this.hoveredElement = { ...data };

    if (data.type) {
      this._toggleType(data.type, true);
    }

    if (this.props.enabled) {
      this._raf.play();
    }
  }

  /** Handle element leave */
  protected _handleElementLeave(data: ICursorHoveredElement) {
    this.hoveredElement = undefined;

    if (data.type) {
      this._toggleType(data.type, false);
    }

    if (this.props.enabled) {
      this._raf.play();
    }
  }

  /**
   * Registers a cursor type.
   */
  @noopIfDestroyed
  public attachCursor({ element, type }: ICursorType) {
    this._types.push({ element, type });

    this._inner.append(element);
  }

  /** Enable or disable a cursor type */
  protected _toggleType(type: string, isEnabled: boolean) {
    if (isEnabled) {
      this._activeTypes.push(type);
    } else {
      this._activeTypes = this._activeTypes.filter((item) => type !== item);
    }

    const activeType =
      this._activeTypes.length > 0
        ? this._activeTypes[this._activeTypes.length - 1]
        : null;

    this._types.forEach((item) => {
      item.element.classList.toggle('active', item.type === activeType);
    });
  }

  /**
   * Checks if all coordinates are interpolated.
   * @returns {boolean} True if all coordinates are interpolated, false otherwise.
   */
  protected get isInterpolated() {
    const { coords, targetCoords } = this;

    return (
      coords.x === targetCoords.x &&
      coords.y === targetCoords.y &&
      coords.width === targetCoords.width &&
      coords.height === targetCoords.height
    );
  }

  /** Renders the cursor. */
  @noopIfDestroyed
  public render() {
    this._calculate();
    this._renderElements();

    if (this.props.autoStop && this.isInterpolated) {
      this._raf.pause();
    }

    // Launch render events
    this.callbacks.emit('render', undefined);
  }

  /** Recalculates current coordinates. */
  protected _calculate() {
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
    const value = lerp(
      current,
      target,
      this._raf.lerpFactor(this.props.lerp),
      0.0001,
    );

    return value;
  }

  /** Renders the cursor elements. */
  protected _renderElements() {
    const { container, domContainer, outer } = this;
    let { x, y } = this.coords;
    const { width, height } = this.coords;

    if (!(container instanceof Window)) {
      const bounding = domContainer.getBoundingClientRect();
      x -= bounding.left;
      y -= bounding.top;
    }

    // Update DOM coordinates
    outer.style.transform = `translate(${x}px, ${y}px)`;
    outer.style.setProperty('--cursor-w', `${width}px`);
    outer.style.setProperty('--cursor-h', `${height}px`);
  }
}
