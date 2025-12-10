import { clamp, IOnResize, onResize, toPixels, uid } from '@/utils';
import { ISnapSlideProps } from './types';
import { SnapSlideParallax } from '../SlideParallax';
import { parallaxAttributes } from '../SlideParallax/constants';
import { Snap } from '../..';

export class SnapSlide {
  constructor(
    protected _element: HTMLElement | null,
    initProps: ISnapSlideProps = {},
  ) {
    this._id = uid('snap-slide');
    this._index = 0;
    this._parallax = [];

    const defaultProps: ISnapSlideProps = {
      virtual: false,
    };

    this._props = {
      ...defaultProps,
      ...initProps,
    } as Required<ISnapSlideProps>;

    if (this.props.virtual && (!initProps.size || initProps.size === 'auto')) {
      throw new Error('Virtual slide must have a size');
    }
  }

  /** Slide element */
  get element() {
    return this._element;
  }

  /** Slide props */
  protected _props: Required<ISnapSlideProps>;

  /** Slide properties */
  get props() {
    return this._props;
  }

  /** Slide id */
  protected _id;

  /** Slide id */
  get id() {
    return this._id;
  }

  /** Slide index */
  protected _index: number;

  /** Slide index */
  get index() {
    return this._index;
  }

  /** Snap component */
  protected _snap?: Snap;

  /** Snap component */
  protected get snap() {
    return this._snap;
  }

  /** Slide parallax elements */
  protected _parallax?: SnapSlideParallax[];

  /** Events on slide resize */
  protected _onResize?: IOnResize;

  /** Size of the element */
  protected _domSize: undefined | number;

  /** Current coordinate */
  protected _coord = 0;

  /** If the slide is appended */
  protected _isAppended = false;

  /** If the slide is visible */
  protected _isVisible = false;

  /** Static coordinate (as if the slide was never moved) */
  protected _staticCoord = 0;

  /** Current progress of slide movement: from -1 to 1 */
  protected _progress = 0;

  /** Current coordinate */
  get coord() {
    return this._coord;
  }

  /** Current coordinate. Do not update it manually! */
  public $_setCoord(value: number) {
    this._coord = value;

    this._isVisible =
      this.size > 0 &&
      this.coord > -this.size &&
      this.coord < (this.snap?.domSize ?? 0);
  }

  /** Static coordinate (as if the slide was never moved) */
  get staticCoord() {
    return this._staticCoord;
  }

  /** Static coordinate (as if the slide was never moved). Do not update it manually! Alignment: start */
  public $_setStaticCoord(value: number) {
    this._staticCoord = value;
  }

  /** Current progress of slide movement: from -1 to 1 */
  get progress() {
    return this._progress;
  }

  /** Current progress of slide movement: from -1 to 1. Do not update it manually! */
  public $_setProgress(value: number) {
    this._progress = value;
  }

  /** Size property */
  get sizeProp() {
    return this.props.size ?? this.snap?.props.slideSize ?? 'auto';
  }

  /** Slide size in pixels */
  get size() {
    const { snap, sizeProp } = this;

    if (!snap) {
      return 0;
    }

    if (sizeProp === 'stretch') {
      return snap.domSize;
    }

    if (sizeProp === 'auto') {
      return this._domSize ?? snap.domSize;
    }

    return toPixels(sizeProp);
  }

  /** Check if the slide is visible */
  get isVisible() {
    return this._isVisible;
  }

  /** Resize the slide & trigger snap reflow */
  public resize(isManual = false) {
    const { element, snap } = this;

    if (!snap) {
      return;
    }

    // Update DOM size
    if (element) {
      const { direction } = snap.props;

      this._domSize =
        direction === 'horizontal' ? element.offsetWidth : element.offsetHeight;
    }

    // Re-flow
    snap.resize(isManual);
  }

  /** Attach the slide to the Snap class */
  public attach(snap: Snap, index: number) {
    this.detach();

    this._snap = snap;
    this._index = index;

    this._parallax = this._getParallaxNodes().map(
      (node) => new SnapSlideParallax(snap, this, node),
    );

    if (this.element && this.sizeProp === 'auto') {
      this._onResize = onResize({
        element: this.element,
        viewportTarget: 'width',
        callback: () => this.resize(),
        name: 'Snap Slide',
      });
    }

    this.resize();
  }

  /** Detach the slide from the Snap class */
  public detach() {
    this._snap = undefined;
    this._onResize?.remove();
    this._parallax?.forEach((parallax) => parallax.destroy());
  }

  /** Render the slide */
  public $_render() {
    this._toggleAppend();

    this._parallax?.forEach((parallax) => parallax.render());
  }

  /** Get list of parallax nodes */
  protected _getParallaxNodes() {
    const { element } = this;
    if (!element) {
      return [];
    }

    const selector = parallaxAttributes.map((attr) => `[${attr}]`).join(',');
    const nodeList = element.querySelectorAll(selector);

    return Array.from(nodeList) as HTMLElement[];
  }

  /** Toggle slide append/remove */
  protected _toggleAppend() {
    if (!this.props.virtual || !this.element || !this.snap) {
      return;
    }

    const { element } = this;
    const { container } = this.snap;

    if (this.isVisible && !this._isAppended) {
      this._isAppended = true;
      container.appendChild(element);
    } else if (!this.isVisible && this._isAppended) {
      this._isAppended = false;
      container.removeChild(element);
    }
  }

  /** Get magnets with static coordinates but dynamic alignment */
  get magnets() {
    if (!this.snap) {
      return [];
    }

    const { snap, staticCoord, size, index } = this;
    const { domSize, track, firstSlideSize } = snap;
    let points: number[] = [];

    if (index === 0 && snap.props.loop) {
      points.push(track.max);
    }

    if (snap.props.centered) {
      const point = staticCoord + size / 2 - firstSlideSize / 2;

      if (size > domSize) {
        points.push(point);
        points.push(point + (domSize - size) / 2);
        points.push(point - (domSize - size) / 2);
      } else {
        points.push(point);
      }
    } else {
      points.push(staticCoord);

      if (size > domSize) {
        points.push(staticCoord + (size - domSize));
      }
    }

    if (!track.canLoop && !snap.props.centered) {
      points = points.map((point) => clamp(point, 0, track.max));
    }

    return points;
  }
}
