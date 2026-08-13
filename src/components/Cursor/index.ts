import { TModuleProps } from '@/base';
import { Module } from '@/base/Module';
import { initVevet } from '@/global/initVevet';
import { body, noopIfDestroyed, TRequiredProps } from '@/internal';
import { toPixels } from '@/utils';
import { addEventListener } from '@/utils/listeners';
import { clamp } from '@/utils/math';

import { Raf } from '../Raf';

import { LERP_APPROXIMATION } from './constants';
import { CursorCoords } from './Coords';
import { CursorDom } from './Dom';
import { CursorHoverElement } from './HoverElement';
import { ICursorHoverElementProps } from './HoverElement/types';
import { CursorPath } from './Path';
import { MUTABLE_PROPS, STATIC_PROPS } from './props';
import { SmoothNumber } from './SmoothNumber';
import { createCursorStyles } from './styles';
import { CursorType } from './Type';
import { ICursorType } from './Type/types';
import {
  ICursorCallbacksMap,
  ICursorFullCoords,
  ICursorMutableProps,
  ICursorStaticProps,
} from './types';

type TC = ICursorCallbacksMap;
type TS = ICursorStaticProps;
type TM = ICursorMutableProps;

/**
 * Custom cursor with smooth motion, hover sizing, sticky elements, and typed variants.
 *
 * - Builds outer/inner DOM (optional) and hides the native cursor when configured
 * - Interpolates position/size via {@link Raf}; optional SVG path trailing (`behavior: 'path'`)
 * - Hover targets via {@link attachHover}; alternate visuals via {@link attachCursor}
 *
 * [Documentation](https://vevetjs.com/docs/Cursor)
 *
 * @group Components
 */
export class Cursor extends Module<TC, TS, TM> {
  public _getStatic(): TRequiredProps<TS> {
    return { ...super._getStatic(), ...STATIC_PROPS };
  }

  public _getMutable(): TRequiredProps<TM> {
    return { ...super._getMutable(), ...MUTABLE_PROPS };
  }

  /** Outer/inner nodes, visibility, click, and native-cursor styles. */
  private _dom: CursorDom;

  /** Registered cursor type elements and active type stack. */
  private _type: CursorType;

  /** SVG path trail used when `behavior` is `'path'`. */
  private _path: CursorPath;

  /** Pointer coordinates, angle, and velocity. */
  private _coords: CursorCoords;

  private _width = new SmoothNumber(0);
  private _height = new SmoothNumber(0);

  private _raf: Raf;

  private _elements: CursorHoverElement[] = [];

  private _activeElements: CursorHoverElement[] = [];

  private _isFirstMove = true;

  constructor(props?: TModuleProps<TC, TS, TM, Cursor>) {
    super(props);

    const { enabled: isEnabled } = this.props;
    const { initialWidth, initialHeight, container, domContainer } = this;

    // Injected once; shared stylesheet is not removed on destroy
    createCursorStyles(this.prefix);

    this._dom = new CursorDom(this, { container, domContainer });
    this._type = new CursorType(this);
    this._path = new CursorPath(this);

    this._coords = new CursorCoords(this);
    this._width.syncWith(initialWidth);
    this._height.syncWith(initialHeight);

    this._raf = new Raf({ enabled: false });
    this._raf.on('frame', this.render.bind(this));
    this.onDestroy(() => this._raf.destroy());

    this.onDestroy(() => {
      this._elements.forEach((element) => element.destroy());
      this._elements = [];
      this._activeElements = [];
    });

    this._setEvents();

    this._toggle(isEnabled);
  }

  get prefix() {
    return `${initVevet().prefix}cursor`;
  }

  get container() {
    return this.props.container;
  }

  /** DOM parent for the cursor node (`body` when `container` is `window`). */
  get domContainer() {
    if (this.container instanceof Window) {
      return body;
    }

    return this.container as HTMLElement;
  }

  get outer() {
    return this._dom.outer;
  }

  get inner() {
    return this._dom.inner;
  }

  /** SVG path element for path behavior (not necessarily mounted). */
  get path() {
    return this._path.path;
  }

  get initialWidth() {
    return toPixels(this.props.width);
  }

  get initialHeight() {
    return toPixels(this.props.height);
  }

  /** Smoothed coordinates including width/height. */
  get coords() {
    return {
      ...this._coords.current,
      width: this._width.current,
      height: this._height.current,
    };
  }

  /** Target coordinates (hover dimensions applied, no smoothing). */
  get targetCoords(): ICursorFullCoords {
    const { hoveredElement, initialWidth, initialHeight } = this;
    const { angle, velocity } = this._coords.target;
    let { x, y } = this._coords.target;

    let width = initialWidth;
    let height = initialHeight;
    let padding = 0;

    if (hoveredElement) {
      const dimensions = hoveredElement.getDimensions();

      width = dimensions.width ?? initialWidth;
      height = dimensions.height ?? initialHeight;
      padding = dimensions.padding;
      x = dimensions.x ?? x;
      y = dimensions.y ?? y;
    }

    width += padding * 2;
    height += padding * 2;

    return { x, y, width, height, angle, velocity };
  }

  /** Topmost active hover target, if any. */
  get hoveredElement(): CursorHoverElement | undefined {
    const activeElements = this._activeElements;

    return activeElements[activeElements.length - 1];
  }

  protected _handleProps(props: Partial<TM>) {
    super._handleProps(props);

    this._toggle(this.props.enabled);
  }

  private _toggle(enabled: boolean) {
    this._dom.toggleEnabled(enabled);
    this._raf.updateProps({ enabled });
  }

  private _setEvents() {
    const { domContainer } = this;

    this.onDestroy(
      addEventListener(
        domContainer,
        'mouseenter',
        this._handleMouseEnter.bind(this),
      ),
    );

    this.onDestroy(
      addEventListener(
        domContainer,
        'mouseleave',
        this._handleMouseLeave.bind(this),
      ),
    );

    this.onDestroy(
      addEventListener(
        domContainer,
        'mousemove',
        this._handleMouseMove.bind(this),
      ),
    );
  }

  private _handleMouseEnter(evt: MouseEvent) {
    if (!this.props.enabled) {
      return;
    }

    this._coords.syncXY(evt.clientX, evt.clientY);
    this._path.addPoint(evt.clientX, evt.clientY, true);

    this._dom.toggleVisibility(true);
  }

  private _handleMouseLeave() {
    this._dom.toggleVisibility(false);
  }

  private _handleMouseMove(evt: MouseEvent) {
    if (!this.props.enabled) {
      return;
    }

    this._coords.move(evt.clientX, evt.clientY);

    if (this._isFirstMove) {
      this._coords.syncWithTarget();
      this._isFirstMove = false;
    }

    this._path.addPoint(evt.clientX, evt.clientY);

    this._dom.toggleVisibility(true);

    this._raf.play();
  }

  /**
   * Registers a hover target that can resize, snap, or sticky-move the cursor.
   *
   * @returns Destructor that detaches listeners for this target
   */
  @noopIfDestroyed
  public attachHover(settings: ICursorHoverElementProps) {
    const element = new CursorHoverElement(
      settings,
      (data) => this._handleElementEnter(data),
      (data) => this._handleElementLeave(data),
    );

    this._elements.push(element);

    return () => {
      this._elements = this._elements.filter((item) => item !== element);
      this._activeElements = this._activeElements.filter(
        (item) => item !== element,
      );
      element.destroy();
    };
  }

  private _handleElementEnter(data: CursorHoverElement) {
    if (!this.props.enabled) {
      return;
    }

    this._activeElements.push(data);

    if (data.type) {
      this._type.toggle(data.type, true);
    }

    this._emit('hoverEnter', data);

    this._raf.play();
  }

  private _handleElementLeave(data: CursorHoverElement) {
    this._activeElements = this._activeElements.filter((i) => i !== data);

    if (data.type) {
      this._type.toggle(data.type, false);
    }

    this._emit('hoverLeave', data);

    if (this.props.enabled) {
      this._raf.play();
    }
  }

  /** Registers a typed cursor element and appends it to {@link inner}. */
  @noopIfDestroyed
  public attachCursor({ element, type }: ICursorType) {
    this._dom.inner?.append(element);
    this._type.add(element, type);
  }

  private get isInterpolated() {
    const { props, targetCoords, coords } = this;

    const elements = !this._elements.find((element) => !element.isInterpolated);

    const width = this._width.current === targetCoords.width;
    const height = this._height.current === targetCoords.height;
    const x = coords.x === targetCoords.x;
    const y = coords.y === targetCoords.y;
    const angle = coords.angle === targetCoords.angle;
    const velocity = coords.velocity === targetCoords.velocity;

    const behavior =
      props.behavior === 'path' ? this._path.isInterpolated : x && y;

    return width && height && elements && behavior && angle && velocity;
  }

  /** Advances interpolation and writes transforms. */
  @noopIfDestroyed
  public render() {
    this._calculate();
    this._renderElements();

    if (this.props.autoStop && this.isInterpolated) {
      this._raf.pause();
    }

    this._emit('render', undefined);
  }

  private _calculate() {
    const { targetCoords: target } = this;

    const ease = this._getLerpFactor();

    this._path.lerp(ease);
    this._path.minimize();

    try {
      if (this._path.has) {
        const pathCoord = this._path.coord;
        this._coords.setXYCurrent(pathCoord.x, pathCoord.y);
      } else {
        throw new Error('No path');
      }
    } catch {
      this._coords.xTo(target.x, ease);
      this._coords.yTo(target.y, ease);
    }

    this._width.to(target.width, ease, LERP_APPROXIMATION);
    this._height.to(target.height, ease, LERP_APPROXIMATION);

    this._coords.lerpVelocityAndAngle(ease);
  }

  private _getLerpFactor(input = this.props.lerp) {
    return this._raf.lerpFactor(clamp(input, 0, 1));
  }

  private _renderElements() {
    const { container, domContainer, outer, props, coords } = this;
    const { width, height } = coords;
    let { x, y } = coords;

    if (!(container instanceof Window)) {
      const bounding = domContainer.getBoundingClientRect();
      x -= bounding.left;
      y -= bounding.top;
    }

    const { style } = outer;
    style.setProperty('--cursor-w', `${width}px`);
    style.setProperty('--cursor-h', `${height}px`);
    style.transform = props.transformModifier({ ...coords, x, y });

    this._elements.forEach((element) =>
      element.render(this._getLerpFactor.bind(this)),
    );
  }
}
