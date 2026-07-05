import { IOnResize, onResize, toPixels } from '@/utils';

import { SnapSlideCoords } from './Coords';
import { ISnapSlideCtx } from './ctx';
import { ISnapSlideProps } from './global';
import { SnapParallax } from './Parallax';
import { getParallaxElements } from './Parallax/shared';
import { DEFAULT_PROPS } from './props';

export type { ISnapSlideProps } from './global';

/**
 * Single carousel slide: size, coords, magnets, parallax, and optional virtual DOM.
 *
 * [Documentation](https://vevetjs.com/docs/Snap/slide)
 *
 * @group Components
 */
export class SnapSlide {
  private _props: Required<ISnapSlideProps>;

  private _ctx?: ISnapSlideCtx;

  private _resizer?: IOnResize;

  private _coords?: SnapSlideCoords;

  private _index = 0;

  private _parallaxes?: SnapParallax[] = [];

  /** Measured size when `size` is `'auto'`. */
  private _domSize: undefined | number;

  /** Virtual slides are appended to the container only while visible. */
  private _isAppended = false;

  constructor(
    private _element: HTMLElement | null,
    props: ISnapSlideProps = {},
  ) {
    this._props = { ...DEFAULT_PROPS, ...props };

    if (props.virtual && (!props.size || props.size === 'auto')) {
      throw new Error('Virtual slide must have a defined size');
    }
  }

  private get sizeTarget() {
    return this._props.size ?? this._ctx?.getGlobalSlideSize() ?? 'auto';
  }

  private get virtual() {
    return this._props.virtual;
  }

  private get resizable() {
    return Boolean(this.element && this.sizeTarget === 'auto');
  }

  get element() {
    return this._element;
  }

  get index() {
    return this._index;
  }

  get coord() {
    return this._coords?.coord ?? 0;
  }

  get staticCoord() {
    return this._coords?.staticCoord ?? 0;
  }

  get progress() {
    return this._coords?.progress ?? 0;
  }

  get isVisible() {
    return this._coords?.isVisible ?? false;
  }

  get size() {
    if (!this._ctx) {
      return 0;
    }

    const { sizeTarget } = this;

    if (sizeTarget === 'stretch') {
      return this._ctx.getContainerSize();
    }

    if (sizeTarget === 'auto') {
      return this._domSize ?? this._ctx.getContainerSize();
    }

    return toPixels(sizeTarget);
  }

  get magnets() {
    if (!this._ctx || !this._coords) {
      return [];
    }

    return this._coords.magnets;
  }

  /** @internal */
  public $_attach(ctx: ISnapSlideCtx, index: number) {
    this.$_detach();

    this._ctx = ctx;
    this._index = index;

    this._coords = new SnapSlideCoords({
      ...ctx,
      index: this._index,
      getSlideSize: () => this.size,
    });

    const elements = getParallaxElements(this.element);

    this._parallaxes = elements.map(
      (node) => new SnapParallax(this, node, () => ctx.getImpulse()),
    );

    if (this.resizable) {
      this._resizer = onResize({
        element: this.element,
        viewportTarget: 'width',
        callback: () => this.resize(false),
        name: 'Snap Slide',
      });
    }
  }

  /** @internal */
  public $_detach() {
    this._ctx = undefined;
    this._resizer?.remove();
    this._parallaxes?.forEach((parallax) => parallax.destroy());
    this._coords = undefined;
  }

  /** @internal */
  public $_setStaticCoord(value: number) {
    this._coords?.$_setStaticCoord(value);
  }

  /** @internal */
  public $_render() {
    this._toggleVirtual();
    this._parallaxes?.forEach((parallax) => parallax.render());
  }

  /** @internal */
  public $_update(current: number, offset: number) {
    this._coords?.$_update(current, offset);
  }

  /** Triggers a Snap reflow after measuring `auto` size. */
  public resize(isManual = true) {
    if (!this._ctx) {
      return;
    }

    if (this.element) {
      const { element } = this;
      const axis = this._ctx.getAxis();

      this._domSize = axis === 'x' ? element.offsetWidth : element.offsetHeight;
    }

    this._ctx.requestGlobalResize(isManual);
  }

  /** Toggle slide append/remove */
  private _toggleVirtual() {
    if (!this.virtual || !this.element || !this._ctx) {
      return;
    }

    const { element } = this;
    const container = this._ctx.getContainer();

    if (this.isVisible && !this._isAppended) {
      this._isAppended = true;
      container.appendChild(element);
    }

    if (!this.isVisible && this._isAppended) {
      this._isAppended = false;
      container.removeChild(element);
    }
  }
}
