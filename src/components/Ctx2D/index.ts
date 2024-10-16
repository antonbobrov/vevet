import { Component as ComponentClass } from '@/base/Component';
import { NCtx2D } from './types';
import { onResize } from '@/utils/listeners/onResize';
import { getApp } from '@/utils/internal/getApp';

export type { NCtx2D };

/**
 * A class that simplifies working with an HTML5 Canvas element and its 2D context.
 * It can handle automatic resizing and provides helper methods for rendering and managing canvas properties.
 *
 * @link See examples https://antonbobrov.github.io/vevet-demo/ctx2d/
 *
 * @link See docs https://antonbobrov.github.io/vevet/classes/Ctx2D.html
 */
export class Ctx2D<
  StaticProps extends NCtx2D.IStaticProps = NCtx2D.IStaticProps,
  ChangeableProps extends NCtx2D.IChangeableProps = NCtx2D.IChangeableProps,
  CallbacksTypes extends NCtx2D.ICallbacksTypes = NCtx2D.ICallbacksTypes,
> extends ComponentClass<StaticProps, ChangeableProps, CallbacksTypes> {
  /** @inheritDoc */
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      container: false,
      shouldAppend: true,
      hasInitialResize: true,
      hasResize: false,
      viewportTarget: 'any',
      resizeDebounce: 0,
      width: 'auto',
      height: 'auto',
      dpr: 'auto',
    };
  }

  /** The parent element of the canvas used to calculate size */
  get container() {
    return this.props.container;
  }

  /** The canvas element created for rendering */
  protected _canvas: HTMLCanvasElement;

  /** Returns the current canvas element */
  get canvas() {
    return this._canvas;
  }

  /** The 2D rendering context for the canvas */
  protected _ctx: CanvasRenderingContext2D;

  /** Returns the 2D rendering context */
  get ctx() {
    return this._ctx;
  }

  /** The current width of the canvas, considering the device pixel ratio (DPR) */
  protected _width: number;

  /** Returns the current width of the canvas (with DPR applied) */
  get width() {
    return this._width;
  }

  /** Returns the width of the canvas without the device pixel ratio (DPR) */
  get clientWidth() {
    return this.width / this.dpr;
  }

  /** The current height of the canvas, considering the device pixel ratio (DPR) */
  protected _height: number;

  /** Returns the current height of the canvas (with DPR applied) */
  get height() {
    return this._height;
  }

  /** Returns the height of the canvas without the device pixel ratio (DPR) */
  get clientHeight() {
    return this.height / this.dpr;
  }

  /** The current device pixel ratio (DPR) */
  protected _dpr: number;

  /** Returns the current device pixel ratio (DPR) */
  get dpr() {
    return this._dpr;
  }

  /** Checks if the canvas is ready to be rendered */
  get canRender() {
    return this.width > 0 && this.height > 0;
  }

  /**
   * Constructor for the Ctx2D class.
   */
  constructor(initialProps?: StaticProps & ChangeableProps, canInit = true) {
    super(initialProps, false);

    const { shouldAppend, container } = this.props;

    // set default values
    this._width = 0;
    this._height = 0;
    this._dpr = 1;

    // create canvas element
    this._canvas = document.createElement('canvas');
    this._canvas.style.position = 'absolute';
    this._canvas.style.top = '0';
    this._canvas.style.left = '0';
    this._canvas.style.width = '100%';
    this._canvas.style.height = '100%';

    // append canvas to container if required
    if (shouldAppend && container instanceof Element) {
      container.append(this._canvas);
      this.addDestroyableAction(() => this.canvas.remove());
    }

    // create 2D context
    this._ctx = this._canvas.getContext('2d')!;

    if (canInit) {
      this.init();
    }
  }

  /** @inheritDoc */
  protected _onPropsMutate() {
    super._onPropsMutate();
    this.resize();
  }

  /** @inheritDoc */
  protected _init() {
    super._init();
    this._setResize();
  }

  /**
   * Sets up the resize event listener for the canvas, if enabled.
   */
  protected _setResize() {
    const { hasInitialResize, hasResize, viewportTarget, resizeDebounce } =
      this.props;

    if (!hasResize) {
      return;
    }

    const resizeHandler = onResize({
      onResize: () => this.resize(),
      element: this.container,
      viewportTarget,
      resizeDebounce,
    });

    this.addDestroyableAction(() => resizeHandler.remove());

    if (hasInitialResize) {
      resizeHandler.resize();
    }
  }

  /**
   * Resizes the canvas based on the container or viewport size and applies the device pixel ratio (DPR).
   */
  public resize() {
    const { props, canvas } = this;

    if (!canvas) {
      return;
    }

    const { viewport } = getApp();

    // calculate DPR
    if (typeof props.dpr === 'number') {
      this._dpr = props.dpr;
    } else {
      this._dpr = viewport.dpr;
    }

    // calculate new width and height
    let newWidth = 0;
    let newHeight = 0;

    if (typeof props.width === 'number' && typeof props.height === 'number') {
      newWidth = props.width;
      newHeight = props.height;
    } else if (this.container) {
      newWidth = this.container.clientWidth;
      newHeight = this.container.clientHeight;
    } else {
      newWidth = viewport.width;
      newHeight = viewport.height;
    }

    // apply DPR
    newWidth *= this._dpr;
    newHeight *= this._dpr;

    // update canvas size
    this._width = newWidth;
    this._height = newHeight;
    canvas.width = newWidth;
    canvas.height = newHeight;

    // handle resize event and trigger callbacks
    this._handleResize();
    this.callbacks.tbt('resize', undefined);
  }

  /**
   * A method called after the canvas has been resized.
   * This can be extended or customized in subclasses.
   */
  protected _handleResize() {}

  /**
   * Renders content on the canvas if it is ready.
   *
   * @param renderProp - A function that performs the actual rendering on the canvas.
   */
  public render(renderProp: NCtx2D.TRender) {
    if (!this.canRender) {
      return;
    }

    renderProp({
      ctx: this.ctx,
      width: this.width,
      height: this.height,
      dpr: this.dpr,
      clientWidth: this.clientWidth,
      clientHeight: this.clientHeight,
      canvas: this.canvas,
    });
  }
}
