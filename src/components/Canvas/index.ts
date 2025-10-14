import { TRequiredProps } from '@/internal/requiredProps';
import { onResize } from '@/utils/listeners/onResize';
import { Module } from '@/base/Module';
import {
  ICanvasCallbacksMap,
  ICanvasMutableProps,
  ICanvasStaticProps,
  TCanvasRender,
} from './types';
import { initVevet } from '@/global/initVevet';

export * from './types';

/**
 * A class for managing an HTML5 Canvas element and its 2D context.
 *
 * [Documentation](https://vevetjs.com/docs/Canvas)
 *
 * @group Components
 */
export class Canvas<
  CallbacksMap extends ICanvasCallbacksMap = ICanvasCallbacksMap,
  StaticProps extends ICanvasStaticProps = ICanvasStaticProps,
  MutableProps extends ICanvasMutableProps = ICanvasMutableProps,
> extends Module<CallbacksMap, StaticProps, MutableProps> {
  /** Get default static properties */
  public _getStatic(): TRequiredProps<StaticProps> {
    return {
      ...super._getStatic(),
      container: null,
      append: true,
      resizeOnInit: true,
      resizeOnRuntime: false,
      viewportTarget: 'any',
      resizeDebounce: 0,
    } as TRequiredProps<StaticProps>;
  }

  /** Get default mutable properties */
  public _getMutable(): TRequiredProps<MutableProps> {
    return {
      ...super._getMutable(),
      width: 'auto',
      height: 'auto',
      dpr: 'auto',
    } as TRequiredProps<MutableProps>;
  }

  /** The canvas element created for rendering */
  protected _canvas: HTMLCanvasElement;

  /** The canvas element instance. */
  get canvas() {
    return this._canvas;
  }

  /** The 2D rendering context. */
  protected _ctx: CanvasRenderingContext2D;

  /** Returns the 2D rendering context */
  get ctx() {
    return this._ctx;
  }

  /** The current width of the canvas, considering the device pixel ratio (DPR) */
  protected _width: number;

  /** Canvas width (DPR applied). */
  get width() {
    return this._width;
  }

  /** Width without DPR scaling. */
  get offsetWidth() {
    return this.width / this.dpr;
  }

  /** The current height of the canvas, considering the device pixel ratio (DPR) */
  protected _height: number;

  /** Canvas height (DPR applied). */
  get height() {
    return this._height;
  }

  /** Height without DPR scaling. */
  get offsetHeight() {
    return this.height / this.dpr;
  }

  /** The current device pixel ratio (DPR) */
  protected _dpr: number;

  /** Current device pixel ratio. */
  get dpr() {
    return this._dpr;
  }

  /** Checks if the canvas is ready to render. */
  get canRender() {
    return this.width > 0 && this.height > 0;
  }

  /**
   * Constructor for the Ctx2D class.
   */
  constructor(props?: StaticProps & MutableProps) {
    super(props);

    const {
      append: shouldAppend,
      container,
      resizeOnInit: hasResizeOnInit,
      resizeOnRuntime: hasRuntimeResize,
      viewportTarget,
      resizeDebounce,
    } = this.props;

    // Set default values
    this._width = 0;
    this._height = 0;
    this._dpr = 1;

    // Create canvas element
    this._canvas = document.createElement('canvas');

    // Add canvas styles
    const { style } = this._canvas;
    style.position = 'absolute';
    style.top = '0';
    style.left = '0';
    style.width = '100%';
    style.height = '100%';

    // Append canvas to container if required
    if (shouldAppend && container instanceof HTMLElement) {
      container.append(this._canvas);

      this.onDestroy(() => this.canvas.remove());
    }

    // Create 2D context
    this._ctx = this._canvas.getContext('2d')!;

    // Set resize events
    if (hasResizeOnInit) {
      this.resize();
    }

    if (hasRuntimeResize) {
      const resizeHandler = onResize({
        callback: () => this.resize(),
        element: this.props.container,
        viewportTarget,
        resizeDebounce,
        name: this.name,
      });

      this.onDestroy(() => resizeHandler.remove());
    }
  }

  /** Handle property mutations */
  protected _handleProps() {
    super._handleProps();

    this.resize();
  }

  /** Triggers a canvas resize based on container or viewport dimensions. */
  public resize() {
    const core = initVevet();
    const { props, canvas } = this;
    const { container } = this.props;

    // Calculate DPR
    this._dpr = typeof props.dpr === 'number' ? props.dpr : core.dpr;

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
}
