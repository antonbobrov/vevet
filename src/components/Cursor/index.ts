import { TRequiredProps } from '@/internal/requiredProps';
import {
  ICursorCallbacksMap,
  ICursorFullCoords,
  ICursorMutableProps,
  ICursorStaticProps,
  ICursorType,
} from './types';
import { Module, TModuleOnCallbacksProps } from '@/base/Module';
import { Raf } from '../Raf';
import { addEventListener } from '@/utils/listeners';
import { initVevet } from '@/global/initVevet';
import { clamp, lerp } from '@/utils/math';
import { createCursorStyles } from './styles';
import { noopIfDestroyed } from '@/internal/noopIfDestroyed';
import { getTextDirection } from '@/internal/textDirection';
import { cnAdd, cnRemove, cnToggle } from '@/internal/cn';
import { body, doc } from '@/internal/env';
import { CursorPath } from './Path';
import { CursorHoverElement } from './HoverElement';
import { ICursorHoverElementProps } from './HoverElement/types';
import { LERP_APPROXIMATION } from './constants';
import { isNumber } from '@/internal/isNumber';

export * from './types';
export type { ICursorHoverElementProps };

/**
 * A customizable custom cursor component with smooth animations and hover interactions.
 * Supports dynamic appearance changes and enhanced user interaction.
 *
 * [Documentation](https://vevetjs.com/docs/Cursor)
 *
 * @group Components
 */
export class Cursor<
  C extends ICursorCallbacksMap = ICursorCallbacksMap,
  S extends ICursorStaticProps = ICursorStaticProps,
  M extends ICursorMutableProps = ICursorMutableProps,
> extends Module<C, S, M> {
  /** Get default static properties */
  public _getStatic(): TRequiredProps<S> {
    return {
      ...super._getStatic(),
      container: window,
      hideNative: false,
      behavior: 'default',
    } as TRequiredProps<S>;
  }

  /** Get default mutable properties */
  public _getMutable(): TRequiredProps<M> {
    return {
      ...super._getMutable(),
      enabled: true,
      width: 50,
      height: 50,
      lerp: 0.2,
      autoStop: true,
    } as TRequiredProps<M>;
  }

  /** The outer element of the custom cursor */
  protected _outer!: HTMLElement;

  /** The inner element of the custom cursor. */
  protected _inner!: HTMLElement;

  /** Attached hover elements */
  protected _hoverElements: CursorHoverElement[] = [];

  /** Active hovered element */
  protected _activeHoverElements: CursorHoverElement[] = [];

  /** Request animation frame handler */
  protected _raf!: Raf;

  /** The current coordinates */
  protected _coords: ICursorFullCoords;

  /** Target coordinates of the cursor. Element dimensions are not considered here (in getter - yes). */
  protected _targetCoords: ICursorFullCoords;

  /** Defines if the cursor has been moved after initialization */
  protected _isFirstMove = true;

  /** Cursor types */
  protected _types: ICursorType[];

  /** Active cursor types */
  protected _activeTypes: string[];

  /** Cursor Path Instance */
  protected _path: CursorPath;

  constructor(
    props?: S & M,
    onCallbacks?: TModuleOnCallbacksProps<C, Cursor<C, S, M>>,
  ) {
    super(props, onCallbacks as any);

    // Set default variables
    const { width, height, enabled: isEnabled } = this.props;
    this._coords = { x: 0, y: 0, width, height };
    this._targetCoords = { x: 0, y: 0, width, height };
    this._types = [];
    this._activeTypes = [];

    // Create cursor path
    this._path = new CursorPath(this.hasPath);

    // No need to remove styles on destroy
    createCursorStyles(this.prefix);

    // Setup
    this._createElements();
    this._setEvents();

    // enable by default
    this._toggle(isEnabled);
  }

  /**
   * The current coordinates (x, y, width, height).
   * These are updated during cursor movement.
   */
  get coords() {
    return this._coords;
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
      return body;
    }

    return this.container as HTMLElement;
  }

  /**
   * The outer element of the custom cursor.
   * This is the visual element that represents the cursor on screen.
   */
  get outer() {
    return this._outer;
  }

  /**
   * The inner element of the custom cursor.
   * This element is nested inside the outer element and can provide additional styling.
   */
  get inner() {
    return this._inner;
  }

  /**
   * The currently hovered element.
   * Stores information about the element that the cursor is currently interacting with.
   */
  get hoveredElement(): CursorHoverElement | undefined {
    const activeElements = this._activeHoverElements;

    return activeElements[activeElements.length - 1];
  }

  /** Target coordinates of the cursor (without smooth interpolation). */
  get targetCoords() {
    const { hoveredElement, props } = this;

    let { x, y } = this._targetCoords;
    let { width, height } = props;
    let padding = 0;

    if (hoveredElement) {
      const dimensions = hoveredElement.getDimensions();

      width = dimensions.width ?? width;
      height = dimensions.height ?? height;
      x = dimensions.x ?? x;
      y = dimensions.y ?? y;
      padding = dimensions.padding;
    }

    width += padding * 2;
    height += padding * 2;

    return { x, y, width, height };
  }

  /** Returns an SVG path element which represents the cursor movement */
  get path() {
    return this._path.path;
  }

  /** Check if the cursor has a path */
  protected get hasPath() {
    return this.props.behavior === 'path';
  }

  /** Creates the custom cursor and appends it to the DOM. */
  protected _createElements() {
    const { container, domContainer } = this;
    const cn = this._cn.bind(this);
    const { style } = domContainer;

    // Hide native cursor
    if (this.props.hideNative) {
      style.cursor = 'none';

      this._addTempClassName(domContainer, cn('-hide-default'));
    }

    // Set class names
    this._addTempClassName(domContainer, cn('-container'));

    // Set container position
    if (domContainer !== body) {
      style.position = 'relative';
    }

    // Create outer element
    const outer = doc.createElement('div');
    domContainer.append(outer);
    cnAdd(outer, cn(''));
    cnAdd(
      outer,
      cn(container instanceof Window ? '-in-window' : '-in-element'),
    );
    cnAdd(outer, cn('-disabled'));

    // set direction
    const direction = getTextDirection(outer);
    cnAdd(outer, cn(`_${direction}`));

    // Create inner element
    const inner = doc.createElement('div');
    outer.append(inner);
    cnAdd(inner, cn('__inner'));
    cnAdd(inner, cn('-disabled'));
    outer.append(inner);

    // assign
    this._outer = outer;
    this._inner = inner;

    // Destroy the cursor
    this.onDestroy(() => {
      style.cursor = '';

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

    cnToggle(this.outer, className, !enabled);
    cnToggle(this.inner, className, !enabled);

    this._raf.updateProps({ enabled });
  }

  /** Handles mouse enter events. */
  protected _handleMouseEnter(evt: MouseEvent) {
    if (!this.props.enabled) {
      return;
    }

    const { clientX: x, clientY: y } = evt;
    const target = this._targetCoords;

    this._coords.x = x;
    this._coords.y = y;
    target.x = x;
    target.y = y;

    this._path.addPoint(target, true);

    cnAdd(this.outer, this._cn('-visible'));
  }

  /** Handles mouse leave events. */
  protected _handleMouseLeave() {
    cnRemove(this.outer, this._cn('-visible'));
  }

  /** Handles mouse move events. */
  protected _handleMouseMove(evt: MouseEvent) {
    if (!this.props.enabled) {
      return;
    }

    const { clientX: x, clientY: y } = evt;
    const target = this._targetCoords;

    target.x = x;
    target.y = y;

    if (this._isFirstMove) {
      this._coords.x = x;
      this._coords.y = y;

      this._isFirstMove = false;
    }

    this._path.addPoint(target);

    cnAdd(this.outer, this._cn('-visible'));

    if (this.props.enabled) {
      this._raf.play();
    }
  }

  /** Handles mouse down events. */
  protected _handleMouseDown(evt: MouseEvent) {
    const className = this._cn('-click');

    if (evt.which === 1) {
      cnAdd(this.outer, className);
      cnAdd(this.inner, className);
    }
  }

  /** Handles mouse up events. */
  protected _handleMouseUp() {
    const className = this._cn('-click');

    cnRemove(this.outer, className);
    cnRemove(this.inner, className);
  }

  /** Handles window blur events. */
  protected _handleWindowBlur() {
    this._handleMouseUp();
  }

  /**
   * Registers an element to interact with the cursor, enabling dynamic size and position changes based on hover effects.
   * @returns Returns a destructor
   */
  @noopIfDestroyed
  public attachElement(settings: ICursorHoverElementProps) {
    const element = new CursorHoverElement(
      settings,
      (data) => this._handleElementEnter(data),
      (data) => this._handleElementLeave(data),
    );

    this._hoverElements.push(element);

    const destroy = () => {
      this._hoverElements = this._hoverElements.filter((i) => i !== element);
      element.destroy();
    };

    this.onDestroy(() => destroy());

    return () => destroy();
  }

  /** Handle element mouse enter event */
  protected _handleElementEnter(data: CursorHoverElement) {
    this._activeHoverElements.push(data);

    if (data.type) {
      this._toggleType(data.type, true);
    }

    if (this.props.enabled) {
      this._raf.play();
    }
  }

  /** Handle element mouse leave event */
  protected _handleElementLeave(data: CursorHoverElement) {
    this._activeHoverElements = this._activeHoverElements.filter(
      (i) => i !== data,
    );

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

    const activeTypes = this._activeTypes;

    const activeType =
      activeTypes.length > 0 ? activeTypes[activeTypes.length - 1] : null;

    this._types.forEach((item) => {
      cnToggle(item.element, 'active', item.type === activeType);
    });
  }

  /**
   * Checks if all coordinates are interpolated.
   * @returns {boolean} True if all coordinates are interpolated, false otherwise.
   */
  protected get isInterpolated() {
    const { coords, targetCoords, props } = this;

    const isPathInterpolated = this._path.isInterpolated;
    const isCoordsInterpolated =
      coords.x === targetCoords.x && coords.y === targetCoords.y;
    const isWidthInterpolated = coords.width === targetCoords.width;
    const isHeightInterpolated = coords.height === targetCoords.height;

    const isElementsInterpolated = !this._hoverElements.find(
      (element) => !element.isInterpolated,
    );

    return (
      isElementsInterpolated &&
      isWidthInterpolated &&
      isHeightInterpolated &&
      (props.behavior === 'path' ? isPathInterpolated : isCoordsInterpolated)
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
    const lerpFactor = this._getLerpFactor();

    this._path.lerp(lerpFactor);
    this._path.minimize();

    try {
      if (this.hasPath) {
        const pathCoord = this._path.coord;
        coords.x = pathCoord.x;
        coords.y = pathCoord.y;
      } else {
        throw new Error('No path');
      }
    } catch {
      coords.x = this._lerp(coords.x, targetCoords.x);
      coords.y = this._lerp(coords.y, targetCoords.y);
    }

    coords.width = this._lerp(coords.width, targetCoords.width);
    coords.height = this._lerp(coords.height, targetCoords.height);
  }

  /** Gets the interpolation factor. */
  protected _getLerpFactor(input = this.props.lerp) {
    if (!isNumber(input)) {
      return 1;
    }

    const lerpFactor = clamp(input, 0, 1);

    return this._raf.lerpFactor(lerpFactor);
  }

  /** Performs linear interpolation. */
  protected _lerp(current: number, target: number) {
    const lerpFactor = this._getLerpFactor();
    const value = lerp(current, target, lerpFactor, LERP_APPROXIMATION);

    return value;
  }

  /** Renders the cursor elements. */
  protected _renderElements() {
    const { container, domContainer, outer } = this;
    const { width, height } = this.coords;
    let { x, y } = this.coords;

    if (!(container instanceof Window)) {
      const bounding = domContainer.getBoundingClientRect();
      x -= bounding.left;
      y -= bounding.top;
    }

    // Update DOM coordinates
    const { style } = outer;
    style.transform = `translate(${x}px, ${y}px)`;
    style.setProperty('--cursor-w', `${width}px`);
    style.setProperty('--cursor-h', `${height}px`);

    // Render element
    this._hoverElements.forEach((element) =>
      element.render(this._getLerpFactor(element.stickyLerp)),
    );
  }
}
