import { clamp, IOnResize, loop, onResize, scoped, toPixels } from '@/utils';

import { Snap } from '../..';

import { SnapSlideParallax } from './Parallax';
import { PARALLAX_ATTRIBUTES } from './Parallax/constants';
import { ISnapSlideProps } from './types';

export class SnapSlide {
  /** Snap component */
  private _ctx?: Snap;

  /** Slide props */
  private _props: Required<ISnapSlideProps>;

  /** Slide index */
  private _index: number;

  /** Slide parallax elements */
  private _parallax?: SnapSlideParallax[];

  /** Events on slide resize */
  private _resizer?: IOnResize;

  /** Size of the element */
  private _domSize: undefined | number;

  /** Current coordinate */
  private _coord = 0;

  /** If the slide is appended */
  private _isAppended = false;

  /** If the slide is visible */
  private _isVisible = false;

  /** Static coordinate without alignment (as if the slide was never moved) */
  private _staticCoord = 0;

  /** Current progress of slide movement: from -1 to 1 */
  private _progress = 0;

  constructor(
    private _element: HTMLElement | null,
    initProps: ISnapSlideProps = {},
  ) {
    this._index = 0;
    this._parallax = [];

    const defaultProps: ISnapSlideProps = {
      virtual: false,
      size: null,
    };

    this._props = {
      ...defaultProps,
      ...initProps,
    } as Required<ISnapSlideProps>;

    if (this._props.virtual && (!initProps.size || initProps.size === 'auto')) {
      throw new Error('Virtual slide must have a defined size');
    }
  }

  /** Snap component */
  private get ctx() {
    return this._ctx;
  }

  /** Slide properties */
  private get props() {
    return this._props;
  }

  /** Size property */
  private get sizeProp() {
    return this.props.size ?? this.ctx?.props.slideSize ?? 'auto';
  }

  /** Slide element */
  get element() {
    return this._element;
  }

  /** Slide index */
  get index() {
    return this._index;
  }

  /** Current coordinate */
  get coord() {
    return this._coord;
  }

  /** Static coordinate without alignment (as if the slide was never moved) */
  get staticCoord() {
    return this._staticCoord;
  }

  /** Current progress of slide movement: from -1 to 1 */
  get progress() {
    return this._progress;
  }

  /** Slide size in pixels */
  get size() {
    const { ctx, sizeProp } = this;

    if (!ctx) {
      return 0;
    }

    if (sizeProp === 'stretch') {
      return ctx.containerSize;
    }

    if (sizeProp === 'auto') {
      return this._domSize ?? ctx.containerSize;
    }

    return toPixels(sizeProp);
  }

  /** Check if the slide is visible relative to the container */
  get isVisible() {
    return this._isVisible;
  }

  /** Resize the slide & trigger snap reflow */
  public resize(isManual = true) {
    const { element, ctx } = this;

    if (!ctx) {
      return;
    }

    if (element) {
      this._domSize =
        ctx.axis === 'x' ? element.offsetWidth : element.offsetHeight;
    }

    // Re-flow
    ctx.resize(isManual);
  }

  /**
   * Attach the slide to the Snap class.
   * For internal use only
   */
  public $_attach(ctx: Snap, index: number) {
    this.$_detach();

    this._ctx = ctx;
    this._index = index;

    this._parallax = this._getParallaxNodes().map(
      (node) => new SnapSlideParallax(this, node, () => ctx.impulse),
    );

    if (this.element && this.sizeProp === 'auto') {
      this._resizer = onResize({
        element: this.element,
        viewportTarget: 'width',
        callback: () => this.resize(false),
        name: 'Snap Slide',
      });
    }
  }

  /**
   * Detach the slide from the Snap class.
   * For internal use only
   */
  public $_detach() {
    this._ctx = undefined;
    this._resizer?.remove();
    this._parallax?.forEach((parallax) => parallax.destroy());
  }

  /**
   * Static coordinate (as if the slide was never moved).
   * For internal use only
   */
  public $_setStaticCoord(value: number) {
    this._staticCoord = value;
  }

  /**
   * Render the slide.
   * For internal use only
   */
  public $_render() {
    this._toggleAppend();

    this._parallax?.forEach((parallax) => parallax.render());
  }

  /** Get list of parallax nodes */
  private _getParallaxNodes() {
    const { element } = this;
    if (!element) {
      return [];
    }

    const selector = PARALLAX_ATTRIBUTES.map((attr) => `[${attr}]`).join(',');
    const nodeList = element.querySelectorAll(selector);

    return Array.from(nodeList) as HTMLElement[];
  }

  /** Toggle slide append/remove */
  private _toggleAppend() {
    if (!this.props.virtual || !this.element || !this.ctx) {
      return;
    }

    const { element, ctx } = this;

    if (this.isVisible && !this._isAppended) {
      this._isAppended = true;
      ctx.container.appendChild(element);
    } else if (!this.isVisible && this._isAppended) {
      this._isAppended = false;
      ctx.container.removeChild(element);
    }
  }

  /** Get magnets with static coordinates but dynamic alignment */
  public get magnets() {
    if (!this.ctx) {
      return [];
    }

    const { ctx, staticCoord, size, index } = this;
    const { containerSize, origin } = ctx;

    let points: number[] = [];

    if (index === 0 && ctx.props.loop) {
      points.push(ctx.max);
    }

    if (origin === 'center') {
      const point = staticCoord + size / 2 - ctx.firstSlideSize / 2;

      if (size > containerSize) {
        points.push(point);
        points.push(point + (containerSize - size) / 2);
        points.push(point - (containerSize - size) / 2);
      } else {
        points.push(point);
      }
    } else if (origin === 'end') {
      const point = staticCoord + size - ctx.firstSlideSize;

      points.push(point);

      if (size > containerSize) {
        points.push(point + (containerSize - size));
      }
    } else {
      points.push(staticCoord);

      if (size > containerSize) {
        points.push(staticCoord + (size - containerSize));
      }

      if (!ctx.canLoop) {
        points = points.map((point) => clamp(point, 0, ctx.max));
      }
    }

    return points;
  }

  /**
   * Update slide progress.
   * For internal use only
   */
  public $_updateProgress() {
    const { ctx } = this;

    if (!ctx) {
      return;
    }

    const { coord, size } = this;
    const { containerSize, origin } = ctx;

    if (origin === 'center') {
      const center = containerSize / 2 - size / 2;
      this._progress = scoped(coord, center, center - size);

      return;
    }

    if (origin === 'end') {
      const end = containerSize - size;
      this._progress = scoped(coord, end, end - size);

      return;
    }

    this._progress = scoped(coord, 0, -size);
  }

  /**
   * Update slide values.
   * For internal use only
   */
  public $_updateCoords(offset: number) {
    const { ctx } = this;

    if (!ctx) {
      return;
    }

    const { staticCoord, size } = this;
    const { origin } = ctx;

    if (!ctx.canLoop) {
      this._setCoord(staticCoord + offset - ctx.current);

      return;
    }

    if (origin === 'center') {
      this._setCoord(
        loop(
          staticCoord + offset - ctx.current,
          -ctx.max / 2 + offset,
          ctx.max / 2 + offset,
        ),
      );

      return;
    }

    if (origin === 'end') {
      this._setCoord(
        loop(staticCoord + offset - ctx.current, -size, ctx.max - size),
      );

      return;
    }

    this._setCoord(loop(staticCoord - ctx.current, -size, ctx.max - size));
  }

  /** Set slide coordinate */
  private _setCoord(value: number) {
    this._coord = value;

    this._isVisible =
      this.size > 0 &&
      this._coord > -this.size &&
      this._coord < (this.ctx?.containerSize ?? 0);
  }
}
