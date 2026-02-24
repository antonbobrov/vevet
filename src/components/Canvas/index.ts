import { Module, TModuleOnCallbacksProps } from '@/base/Module';
import { initVevet } from '@/global/initVevet';
import { doc } from '@/internal/env';
import { isNumber } from '@/internal/isNumber';
import { noopIfDestroyed } from '@/internal/noopIfDestroyed';
import { TRequiredProps } from '@/internal/requiredProps';
import { onResize } from '@/utils/listeners/onResize';

import { MUTABLE_PROPS, STATIC_PROPS } from './props';
import {
  ICanvasCallbacksMap,
  ICanvasMutableProps,
  ICanvasStaticProps,
  TCanvasRender,
} from './types';

export * from './types';

/**
 * A class for managing an HTML5 Canvas element and its 2D context.
 *
 * [Documentation](https://vevetjs.com/docs/Canvas)
 *
 * @group Components
 */
export class Canvas<
  C extends ICanvasCallbacksMap = ICanvasCallbacksMap,
  S extends ICanvasStaticProps = ICanvasStaticProps,
  M extends ICanvasMutableProps = ICanvasMutableProps,
> extends Module<C, S, M> {
  /** Get default static properties */
  public _getStatic(): TRequiredProps<S> {
    return { ...super._getStatic(), ...STATIC_PROPS };
  }

  /** Get default mutable properties */
  public _getMutable(): TRequiredProps<M> {
    return { ...super._getMutable(), ...MUTABLE_PROPS };
  }

  /** The canvas element created for rendering */
  private _canvas: HTMLCanvasElement;

  /** The 2D rendering context. */
  private _ctx: CanvasRenderingContext2D;

  /** The current width of the canvas, considering the device pixel ratio (DPR) */
  private _width = 0;

  /** The current height of the canvas, considering the device pixel ratio (DPR) */
  private _height = 0;

  /** The current device pixel ratio (DPR) */
  private _dpr = 1;

  /**
   * Constructor for the Ctx2D class.
   */
  constructor(
    props?: S & M & TModuleOnCallbacksProps<C, Canvas<C, S, M>>,
    onCallbacks?: TModuleOnCallbacksProps<C, Canvas<C, S, M>>,
  ) {
    super(props, onCallbacks as any);

    const { container } = this.props;

    // Create canvas element
    this._canvas = doc.createElement('canvas');

    // Add canvas styles
    const { style } = this._canvas;
    style.position = 'absolute';
    style.top = '0';
    style.left = '0';
    style.width = '100%';
    style.height = '100%';

    // Append canvas to container if required
    if (this.props.append && container instanceof HTMLElement) {
      container.append(this._canvas);
    }

    // Create 2D context
    this._ctx = this._canvas.getContext('2d')!;

    // Set events
    this._setEvents();
  }

  /** The canvas element instance. */
  get canvas() {
    return this._canvas;
  }

  /** Returns the 2D rendering context */
  get ctx() {
    return this._ctx;
  }

  /** Canvas width (DPR applied). */
  get width() {
    return this._width;
  }

  /** Width without DPR scaling. */
  get offsetWidth() {
    return this.width / this.dpr;
  }

  /** Canvas height (DPR applied). */
  get height() {
    return this._height;
  }

  /** Height without DPR scaling. */
  get offsetHeight() {
    return this.height / this.dpr;
  }

  /** Current device pixel ratio. */
  get dpr() {
    return this._dpr;
  }

  /** Checks if the canvas is ready to render. */
  get canRender() {
    return this.width > 0 && this.height > 0;
  }

  /** Handle property mutations */
  protected _handleProps() {
    super._handleProps();

    this.resize();
  }

  /** Set events */
  protected _setEvents() {
    const { props } = this;
    const { viewportTarget, resizeDebounce } = props;

    // Set resize events
    if (props.resizeOnInit) {
      this.resize();
    }

    // Runtime resize

    if (!props.resizeOnRuntime) {
      return;
    }

    const resizeHandler = onResize({
      callback: () => this.resize(),
      element: this.props.container,
      viewportTarget,
      resizeDebounce,
      name: this.name,
    });

    this.onDestroy(() => resizeHandler.remove());
  }

  /** Triggers a canvas resize based on container or viewport dimensions. */
  @noopIfDestroyed
  public resize() {
    const core = initVevet();
    const { props, canvas } = this;
    const { container } = this.props;

    // Calculate DPR
    this._dpr = isNumber(props.dpr) ? props.dpr : core.dpr;

    // Calculate new width and height
    let newWidth = 0;
    let newHeight = 0;

    if (props.width === 'auto') {
      newWidth = container?.offsetWidth || core.width;
    } else {
      newWidth = props.width;
    }

    if (props.height === 'auto') {
      newHeight = container?.offsetHeight || core.height;
    } else {
      newHeight = props.height;
    }

    // Apply DPR
    newWidth *= this._dpr;
    newHeight *= this._dpr;

    // Update canvas size
    this._width = newWidth;
    this._height = newHeight;
    canvas.width = newWidth;
    canvas.height = newHeight;

    // Callbacks
    this.callbacks.emit('resize', undefined);
  }

  /**
   * Renders content on the canvas if it's ready.
   *
   * @param render - A function that performs the actual rendering on the canvas.
   */
  @noopIfDestroyed
  public render(render: TCanvasRender) {
    if (!this.canRender) {
      return;
    }

    render({
      ctx: this.ctx,
      width: this.width,
      height: this.height,
      dpr: this.dpr,
      offsetWidth: this.offsetWidth,
      offsetHeight: this.offsetHeight,
      canvas: this.canvas,
    });
  }

  /** Destroys the canvas. */
  protected _destroy() {
    super._destroy();

    this.canvas.remove();
  }
}
