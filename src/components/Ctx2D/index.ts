import { Component as ComponentClass } from '@/base/Component';
import { NCtx2D } from './types';
import { onResize } from '@/utils/listeners/onResize';

export type { NCtx2D };

/**
 * Makes working with canvas easier.
 * It creates an HTML5 Canvas element and its 2d context and can
 * implement automatic resize.
 */
export class Ctx2D<
  StaticProps extends NCtx2D.IStaticProps = NCtx2D.IStaticProps,
  ChangeableProps extends NCtx2D.IChangeableProps = NCtx2D.IChangeableProps,
  CallbacksTypes extends NCtx2D.ICallbacksTypes = NCtx2D.ICallbacksTypes
> extends ComponentClass<StaticProps, ChangeableProps, CallbacksTypes> {
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

  /** The parent element of the canvas */
  get container() {
    return this.props.container;
  }

  /** The Canvas element itself */
  protected _canvas: HTMLCanvasElement;

  /** The Canvas element itself */
  get canvas() {
    return this._canvas;
  }

  /** 2D Context */
  protected _ctx: CanvasRenderingContext2D;

  /** 2D Context */
  get ctx() {
    return this._ctx;
  }

  /* Canvas width (with DPR) */
  protected _width: number;

  /* Canvas width (with DPR) */
  get width() {
    return this._width;
  }

  /* Canvas width (without DPR) */
  get clientWidth() {
    return this.width / this.dpr;
  }

  /* Canvas height (with DPR) */
  protected _height: number;

  /* Canvas height (with DPR) */
  get height() {
    return this._height;
  }

  /* Canvas height (without DPR) */
  get clientHeight() {
    return this.height / this.dpr;
  }

  /** Device pixel ratio */
  protected _dpr: number;

  /** Device pixel ratio */
  get dpr() {
    return this._dpr;
  }

  /** If content may be successfully rendered */
  get canRender() {
    return this.width > 0 && this.height > 0;
  }

  constructor(initialProps?: StaticProps & ChangeableProps, canInit = true) {
    super(initialProps, false);

    const { shouldAppend, container } = this.props;

    // set default values
    this._width = 0;
    this._height = 0;
    this._dpr = 1;

    // create canvas
    this._canvas = document.createElement('canvas');
    this._canvas.style.position = 'absolute';
    this._canvas.style.top = '0';
    this._canvas.style.left = '0';
    this._canvas.style.width = '100%';
    this._canvas.style.height = '100%';

    // append canvas
    if (shouldAppend && container instanceof Element) {
      container.append(this._canvas);

      this.addDestroyableAction(() => this.canvas.remove());
    }

    // create context
    this._ctx = this._canvas.getContext('2d')!;

    if (canInit) {
      this.init();
    }
  }

  protected _onPropsMutate() {
    super._onPropsMutate();

    this.resize();
  }

  protected _init() {
    super._init();

    this._setResize();
  }

  /** Set resize events */
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

  /** Resize the canvas */
  public resize() {
    const { props, canvas } = this;

    if (!canvas) {
      return;
    }

    const { app } = this;
    const { viewport } = app;

    // calculate dpr
    if (typeof props.dpr === 'number') {
      this._dpr = props.dpr;
    } else {
      this._dpr = viewport.dpr;
    }

    // calculate new width & height
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

    // apply dpr
    newWidth *= this._dpr;
    newHeight *= this._dpr;

    // update sizes
    this._width = newWidth;
    this._height = newHeight;

    // apply sizes
    canvas.width = newWidth;
    canvas.height = newHeight;

    // launch callbacks
    this._handleResize();
    this.callbacks.tbt('resize', undefined);
  }

  /** Method called on resize */
  protected _handleResize() {}

  /** Render the scene if possible */
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
