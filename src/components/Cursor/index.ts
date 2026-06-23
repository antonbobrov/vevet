import { Module, TModuleOnCallbacksProps } from '@/base/Module';
import { initVevet } from '@/global/initVevet';
import { cnAdd, cnRemove, cnToggle } from '@/internal/cn';
import { body, doc } from '@/internal/env';
import { isEqual } from '@/internal/isEqual';
import { isFiniteNumber } from '@/internal/isFiniteNumber';
import { noopIfDestroyed } from '@/internal/noopIfDestroyed';
import { TRequiredProps } from '@/internal/requiredProps';
import { getTextDirection } from '@/internal/textDirection';
import { toPixels } from '@/utils';
import { addEventListener } from '@/utils/listeners';
import { clamp, lerp } from '@/utils/math';

import { Raf } from '../Raf';

import { LERP_APPROXIMATION } from './constants';
import { CursorHoverElement } from './HoverElement';
import { ICursorHoverElementProps } from './HoverElement/types';
import { CursorPath } from './Path';
import { MUTABLE_PROPS, STATIC_PROPS } from './props';
import { createCursorStyles } from './styles';
import {
  ICursorCallbacksMap,
  ICursorFullCoords,
  ICursorMutableProps,
  ICursorStaticProps,
  ICursorTargetCoords,
  ICursorType,
} from './types';

export * from './types';
export type { ICursorHoverElementProps };

type TC = ICursorCallbacksMap;
type TS = ICursorStaticProps;
type TM = ICursorMutableProps;

/**
 * A customizable custom cursor component with smooth animations and hover interactions.
 * Supports dynamic appearance changes and enhanced user interaction.
 *
 * [Documentation](https://vevetjs.com/docs/Cursor)
 *
 * @group Components
 */
export class Cursor extends Module<TC, TS, TM> {
  /** Get default static properties */
  public _getStatic(): TRequiredProps<TS> {
    return { ...super._getStatic(), ...STATIC_PROPS };
  }

  /** Get default mutable properties */
  public _getMutable(): TRequiredProps<TM> {
    return { ...super._getMutable(), ...MUTABLE_PROPS };
  }

  /** The outer element of the custom cursor */
  private _outer?: HTMLElement;

  /** The inner element of the custom cursor. */
  private _inner?: HTMLElement;

  /** Attached hover elements */
  private _elements: CursorHoverElement[] = [];

  /** Active hovered element */
  private _activeElements: CursorHoverElement[] = [];

  /** Request animation frame handler */
  private _raf?: Raf;

  /** The current coordinates */
  private _coords: ICursorFullCoords;

  /** Target coordinates of the cursor. Element dimensions are not considered here (in getter - yes). */
  private _target: ICursorTargetCoords;

  /** Defines if the cursor has been moved after initialization */
  private _isFirstMove = true;

  /** Cursor types */
  private _types: ICursorType[];

  /** Active cursor types */
  private _activeTypes: string[];

  /** Cursor Path Instance */
  private _path: CursorPath;

  constructor(
    props?: TS & TM & TModuleOnCallbacksProps<TC, Cursor>,
    onCallbacks?: TModuleOnCallbacksProps<TC, Cursor>,
  ) {
    super(props, onCallbacks as any);

    const { enabled: isEnabled } = this.props;
    const { initialWidth: width, initialHeight: height } = this;

    // Set default coords
    this._coords = {
      x: 0,
      y: 0,
      width,
      height,
      angle: 0,
      velocity: 0,
      impulseX: 0,
      impulseY: 0,
    };

    // Set default values
    this._target = { ...this._coords };
    this._types = [];
    this._activeTypes = [];

    // Create cursor path
    this._path = new CursorPath(this.hasPath);

    // No need to remove styles on destroy
    createCursorStyles(this.prefix);

    // Setup
    this._setClassNames();
    this._createElements();
    this._setEvents();

    // enable by default
    this._toggle(isEnabled);
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
    return this._outer!;
  }

  /**
   * The inner element of the custom cursor.
   * This element is nested inside the outer element and can provide additional styling.
   */
  get inner() {
    return this._inner!;
  }

  /** Cursor initial width */
  get initialWidth() {
    return toPixels(this.props.width);
  }

  /** Cursor initial width */
  get initialHeight() {
    return toPixels(this.props.height);
  }

  /**
   * The current coordinates (x, y, width, height).
   * These are updated during cursor movement.
   * The coordinates are calculated relatively to the window.
   */
  get coords() {
    return this._coords;
  }

  /**
   * The currently hovered element.
   * Stores information about the element that the cursor is currently interacting with.
   */
  get hoveredElement(): CursorHoverElement | undefined {
    const activeElements = this._activeElements;

    return activeElements[activeElements.length - 1];
  }

  /** Target coordinates of the cursor (without smooth interpolation). */
  get targetCoords(): ICursorFullCoords {
    const { hoveredElement, initialWidth, initialHeight } = this;

    let { x, y } = this._target;

    let width = initialWidth;
    let height = initialHeight;
    let padding = 0;

    if (hoveredElement) {
      const dimensions = hoveredElement.$getDimensions();

      width = dimensions.width ?? initialWidth;
      height = dimensions.height ?? initialHeight;
      x = dimensions.x ?? x;
      y = dimensions.y ?? y;
      padding = dimensions.padding;
    }

    width += padding * 2;
    height += padding * 2;

    return { ...this._target, x, y, width, height };
  }

  /** Returns an SVG path element which represents the cursor movement */
  get path() {
    return this._path.path;
  }

  /** Check if the cursor has a path */
  private get hasPath() {
    return this.props.behavior === 'path';
  }

  /** Handles property mutations */
  protected _handleProps(props: Partial<TM>) {
    super._handleProps(props);

    this._toggle(this.props.enabled);
  }

  /** Sets class names */
  private _setClassNames() {
    const { domContainer } = this;

    // Hide native cursor
    if (this.props.hideNative) {
      domContainer.style.cursor = 'none';

      this._addTempClassName(domContainer, this._cn('-hide-default'));
    }

    // Set class names
    this._addTempClassName(domContainer, this._cn('-container'));

    // Set container position
    if (domContainer !== body) {
      domContainer.style.position = 'relative';
    }

    // Reset styles
    this.onDestroy(() => {
      domContainer.style.cursor = '';
    });
  }

  /** Creates the custom cursor and appends it to the DOM. */
  private _createElements() {
    const { container, domContainer, props } = this;
    const isWindow = container instanceof Window;

    const cn = this._cn.bind(this);

    // Create outer element
    const outer = doc.createElement('div');
    cnAdd(outer, cn(''));
    cnAdd(outer, cn(isWindow ? '-in-window' : '-in-element'));
    cnAdd(outer, cn('-disabled'));

    // Append the outer element to the DOM container
    if (props.append) {
      domContainer.append(outer);
    }

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
      inner.remove();
      outer.remove();
    });
  }

  /** Sets up the various event listeners for the cursor, such as mouse movements and clicks. */
  private _setEvents() {
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
      this._raf?.destroy();

      mouseenter();
      mouseleave();
      mousemove();
      mousedown();
      mouseup();
      blur();
    });
  }

  /** Enables cursor animation. */
  private _toggle(enabled: boolean) {
    const className = this._cn('-disabled');

    cnToggle(this.outer, className, !enabled);
    cnToggle(this.inner, className, !enabled);

    this._raf?.updateProps({ enabled });
  }

  /** Handles mouse enter events. */
  private _handleMouseEnter(evt: MouseEvent) {
    if (!this.props.enabled) {
      return;
    }

    const { clientX: x, clientY: y } = evt;
    const { _target: target, _coords: coords } = this;

    coords.x = x;
    coords.y = y;

    target.x = x;
    target.y = y;

    this._path.addPoint(target, true);

    cnAdd(this.outer, this._cn('-visible'));
  }

  /** Handles mouse leave events. */
  private _handleMouseLeave() {
    cnRemove(this.outer, this._cn('-visible'));
  }

  /** Handles mouse move events. */
  private _handleMouseMove(evt: MouseEvent) {
    if (!this.props.enabled) {
      return;
    }

    const { clientX: x, clientY: y } = evt;
    const { _target: target, _coords: coords, props } = this;

    // Calculate angle
    const deltaX = x - target.x;
    const deltaY = y - target.y;

    // Velocity threshold
    const vThreshold = props.velocityThreshold;

    // Calculate velocity delta
    const velocityDelta =
      (Math.sqrt(deltaX ** 2 + deltaY ** 2) * 2) / vThreshold;
    const impulseX = clamp(deltaX / vThreshold, -1, 1);
    const impulseY = clamp(deltaY / vThreshold, -1, 1);

    // Update target coordinates
    target.x = x;
    target.y = y;
    target.velocity = clamp(target.velocity + velocityDelta);
    target.impulseX = clamp(target.impulseX + impulseX, -1, 1);
    target.impulseY = clamp(target.impulseY + impulseY, -1, 1);

    // Update interpolated coords if first move
    if (this._isFirstMove) {
      coords.x = x;
      coords.y = y;
      coords.velocity = target.velocity;
      coords.impulseX = target.impulseX;
      coords.impulseY = target.impulseY;

      this._isFirstMove = false;
    }

    // Add path point
    this._path.addPoint(target);

    // Handle classnames
    cnAdd(this.outer, this._cn('-visible'));

    // Enable animation
    this._raf?.play();
  }

  /** Handles mouse down events. */
  private _handleMouseDown(evt: MouseEvent) {
    const className = this._cn('-click');

    if (evt.which === 1) {
      cnAdd(this.outer, className);
      cnAdd(this.inner, className);
    }
  }

  /** Handles mouse up events. */
  private _handleMouseUp() {
    const className = this._cn('-click');

    cnRemove(this.outer, className);
    cnRemove(this.inner, className);
  }

  /** Handles window blur events. */
  private _handleWindowBlur() {
    const className = this._cn('-click');

    cnRemove(this.outer, className);
    cnRemove(this.inner, className);
  }

  /**
   * Registers an element to interact with the cursor, enabling dynamic size and position changes based on hover effects.
   * @returns Returns a destructor
   */
  @noopIfDestroyed
  public attachHover(settings: ICursorHoverElementProps) {
    const element = new CursorHoverElement(
      settings,
      (data) => this._handleElementEnter(data),
      (data) => this._handleElementLeave(data),
    );

    this._elements.push(element);

    const destroy = () => {
      this._elements = this._elements.filter((i) => i !== element);
      element.$destroy();
    };

    this.onDestroy(() => destroy());

    return () => destroy();
  }

  /** Handle element mouse enter event */
  private _handleElementEnter(data: CursorHoverElement) {
    if (!this.props.enabled) {
      return;
    }

    this._activeElements.push(data);

    if (data.type) {
      this._toggleType(data.type, true);
    }

    this.callbacks.emit('hoverEnter', data);

    this._raf?.play();
  }

  /** Handle element mouse leave event */
  private _handleElementLeave(data: CursorHoverElement) {
    this._activeElements = this._activeElements.filter((i) => i !== data);

    if (data.type) {
      this._toggleType(data.type, false);
    }

    this.callbacks.emit('hoverLeave', data);

    if (this.props.enabled) {
      this._raf?.play();
    }
  }

  /**
   * Registers a cursor type.
   */
  @noopIfDestroyed
  public attachCursor({ element, type }: ICursorType) {
    this._types.push({ element, type });
    this._inner?.append(element);
  }

  /** Enable or disable a cursor type */
  private _toggleType(type: string, isEnabled: boolean) {
    const targetType = this._types.find((item) => item.type === type);

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

    if (targetType) {
      this.callbacks.emit(isEnabled ? 'typeShow' : 'typeHide', targetType);
    }

    if (!activeType) {
      this.callbacks.emit('noType', undefined);
    }
  }

  /**
   * Checks if all coordinates are interpolated.
   * @returns {boolean} True if all coordinates are interpolated, false otherwise.
   */
  private get isInterpolated() {
    const { coords, targetCoords, props } = this;

    const isInterpolated = isEqual([
      [coords.width, targetCoords.width],
      [coords.height, targetCoords.height],
      [coords.angle, targetCoords.angle],
      [coords.velocity, targetCoords.velocity],
      [coords.impulseX, targetCoords.impulseX],
      [coords.impulseY, targetCoords.impulseY],
    ]);

    const isElementsDone = !this._elements.find(
      (element) => !element.isInterpolated,
    );

    const isPathDone = this._path.isInterpolated;
    const isCoordsDone =
      coords.x === targetCoords.x && coords.y === targetCoords.y;

    return (
      isInterpolated &&
      isElementsDone &&
      (props.behavior === 'path' ? isPathDone : isCoordsDone)
    );
  }

  /** Renders the cursor. */
  @noopIfDestroyed
  public render() {
    this._calculate();
    this._renderElements();

    if (this.props.autoStop && this.isInterpolated) {
      this._raf?.pause();
    }

    // Launch render events
    this.callbacks.emit('render', undefined);
  }

  /** Recalculates current coordinates. */
  private _calculate() {
    const { targetCoords, _coords: current, _target: raw, props } = this;

    const lerpFactor = this._getLerpFactor(props.lerp);

    this._path.lerp(lerpFactor);
    this._path.minimize();

    const prevX = current.x;
    const prevY = current.y;
    const prevAngle = current.angle;

    try {
      if (this.hasPath) {
        const pathCoord = this._path.coord;
        current.x = pathCoord.x;
        current.y = pathCoord.y;
      } else {
        throw new Error('No path');
      }
    } catch {
      current.x = this._lerp(current.x, targetCoords.x);
      current.y = this._lerp(current.y, targetCoords.y);
    }

    current.width = this._lerp(current.width, targetCoords.width);
    current.height = this._lerp(current.height, targetCoords.height);

    raw.velocity = this._lerp(raw.velocity, 0);
    current.velocity = this._lerp(current.velocity, raw.velocity);

    raw.impulseX = this._lerp(raw.impulseX, 0);
    current.impulseX = this._lerp(current.impulseX, raw.impulseX);

    raw.impulseY = this._lerp(raw.impulseY, 0);
    current.impulseY = this._lerp(current.impulseY, raw.impulseY);

    const deltaX = current.x - prevX;
    const deltaY = current.y - prevY;

    let targetAngle = prevAngle;

    if (deltaX * deltaX + deltaY * deltaY > 0.001) {
      const rawAngle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
      targetAngle =
        prevAngle + ((((rawAngle - prevAngle) % 360) + 540) % 360) - 180;
    }

    raw.angle = targetAngle;

    const angleLerp = props.lerp * props.angleLerpMultiplier;
    current.angle = this._lerp(prevAngle, targetAngle, angleLerp);
  }

  /** Gets the interpolation factor. */
  private _getLerpFactor(input: number) {
    if (!isFiniteNumber(input)) {
      return 1;
    }

    const lerpFactor = clamp(input, 0, 1);

    return this._raf!.lerpFactor(lerpFactor);
  }

  /** Performs linear interpolation. */
  private _lerp(current: number, target: number, rawFactor = this.props.lerp) {
    const factor = this._getLerpFactor(rawFactor);
    const value = lerp(current, target, factor, LERP_APPROXIMATION);

    return value;
  }

  /** Renders the cursor elements. */
  private _renderElements() {
    const { container, domContainer, outer, props, coords } = this;
    const { width, height } = coords;
    let { x, y } = coords;

    if (!(container instanceof Window)) {
      const bounding = domContainer.getBoundingClientRect();
      x -= bounding.left;
      y -= bounding.top;
    }

    // Update DOM coordinates
    const { style } = outer;
    style.setProperty('--cursor-w', `${width}px`);
    style.setProperty('--cursor-h', `${height}px`);
    style.transform = props.transformModifier({ ...coords, x, y });

    // Render element
    this._elements.forEach((element) =>
      element.$render((factor) =>
        this._getLerpFactor(factor ?? this.props.lerp),
      ),
    );
  }
}
