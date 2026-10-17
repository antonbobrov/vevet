import { TModuleProps } from '@/base';
import { Module } from '@/base/Module';
import { initVevet } from '@/global/initVevet';
import { body, noopIfDestroyed, TRequiredProps } from '@/internal';
import { addEventListener } from '@/utils/listeners';

import { Raf } from '../Raf';

import { CursorCoords } from './Coords';
import { CursorDom } from './Dom';
import { CursorHoverElement } from './HoverElement';
import { ICursorHoverElementProps } from './HoverElement/types';
import { CursorPath } from './Path';
import { MUTABLE_PROPS, STATIC_PROPS } from './props';
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
 * - Interpolates position, size, angle, and velocity via named {@link Raf} entries
 * - Per-channel ease: `ease` / `easeCoords` / `easeSize` / `easeAngle` / `easeVelocity`
 * - Optional SVG path trailing (`behavior: 'path'`)
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

  private _raf: Raf;

  private _coords: CursorCoords;

  private _dom: CursorDom;

  private _path: CursorPath;

  private _type: CursorType;

  private _elements: CursorHoverElement[] = [];

  private _activeElements: CursorHoverElement[] = [];

  private _isFirstMove = true;

  constructor(props?: TModuleProps<TC, TS, TM, Cursor>) {
    super(props);

    const { enabled: isEnabled } = this.props;
    const { container, domContainer } = this;

    // Injected once; shared stylesheet is not removed on destroy
    createCursorStyles(this.prefix);

    this._raf = new Raf({ enabled: false });
    this._raf.on('frame', this.render.bind(this));

    this._coords = new CursorCoords(this, this._raf);

    this._dom = new CursorDom(this, { container, domContainer });
    this._path = new CursorPath(this, this._raf);
    this._type = new CursorType(this);

    this.onDestroy(() => {
      this._elements.forEach((element) => element.destroy());
      this._elements = [];
      this._activeElements = [];
      this._raf.destroy();
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
    return this._coords.initialWidth;
  }

  get initialHeight() {
    return this._coords.initialHeight;
  }

  /**
   * Resolved base ease: {@link ICursorMutableProps.ease} ?? {@link ICursorMutableProps.lerp}.
   */
  get ease() {
    return this.props.ease ?? this.props.lerp;
  }

  /** Smoothed coordinates including width/height (path head when `behavior` is `'path'`). */
  get coords() {
    const current = this._coords.current;
    const xy = { x: current.x, y: current.y };

    try {
      if (this._path.has) {
        const pathCoords = this._path.coord;
        xy.x = pathCoords.x;
        xy.y = pathCoords.y;
      }
    } catch {
      xy.x = current.x;
      xy.y = current.y;
    }

    return {
      ...current,
      ...xy,
    };
  }

  /** Target coordinates (hover dimensions applied, no smoothing). */
  get targetCoords(): ICursorFullCoords {
    return this._coords.target;
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

    this._coords.updateTargets(evt.clientX, evt.clientY);
    this._path.addPoint(evt.clientX, evt.clientY, true);
    this._raf.sync('x', 'y');

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
      this._raf.sync('x', 'y', 'angle', 'velocity');
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
    const element = new CursorHoverElement(this, {
      settings,
      raf: this._raf,
      onEnter: (data) => this._handleElementEnter(data),
      onLeave: (data) => this._handleElementLeave(data),
    });

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

  /** Advances interpolation and writes transforms. */
  @noopIfDestroyed
  public render() {
    this._path.minimize();
    this._coords.updateTargets();

    this._draw();

    if (this.props.autoStop && this._raf.interpolated()) {
      this._raf.pause();
    }

    this._emit('render', undefined);
  }

  private _draw() {
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

    this._elements.forEach((element) => element.render());
  }
}
