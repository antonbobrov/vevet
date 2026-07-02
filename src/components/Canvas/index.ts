import { Module, TModuleProps } from '@/base/Module';
import { initVevet } from '@/global/initVevet';
import { doc } from '@/internal/env';
import { isHTMLElement } from '@/internal/isHTLMElement';
import { isNumber } from '@/internal/isNumber';
import { noopIfDestroyed } from '@/internal/noopIfDestroyed';
import { onResize } from '@/utils/listeners/onResize';

import { MUTABLE_PROPS, STATIC_PROPS } from './props';
import {
  ICanvasCallbacksMap,
  ICanvasMutableProps,
  ICanvasStaticProps,
  TCanvasRender,
} from './types';
import { applyCanvasStyles } from './utils/canvasStyles';

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
  public _getStatic() {
    return { ...super._getStatic(), ...STATIC_PROPS };
  }

  public _getMutable() {
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
  constructor(props?: TModuleProps<C, S, M, Canvas<C, S, M>>) {
    super(props);

    const { container } = this.props;

    // Create canvas element
    this._canvas = doc.createElement('canvas');
    applyCanvasStyles(this._canvas);

    // Append canvas to container if required
    if (this.props.append && isHTMLElement(container)) {
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
  protected _handleProps(props: Partial<M>) {
    super._handleProps(props);

    this.resize();
  }

  /** Set events */
  private _setEvents() {
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

  /** Get DPR */
  private _updateDPR() {
    const core = initVevet();
    const { props } = this;

    this._dpr = isNumber(props.dpr) ? props.dpr : core.dpr;
  }

  /** Get DPR */
  private _updateSizes() {
    const core = initVevet();
    const { props } = this;

    let newWidth = 0;
    let newHeight = 0;

    if (props.width === 'auto') {
      newWidth = props.container?.offsetWidth || core.width;
    } else {
      newWidth = props.width;
    }

    if (props.height === 'auto') {
      newHeight = props.container?.offsetHeight || core.height;
    } else {
      newHeight = props.height;
    }

    newWidth *= this._dpr;
    newHeight *= this._dpr;

    this._width = newWidth;
    this._height = newHeight;
  }

  /** Triggers a canvas resize based on container or viewport dimensions. */
  @noopIfDestroyed
  public resize() {
    const { canvas } = this;

    this._updateDPR();
    this._updateSizes();

    canvas.width = this._width;
    canvas.height = this._height;

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
