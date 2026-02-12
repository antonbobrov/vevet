import { clamp, IOnResize, loop, onResize, scoped, toPixels } from '@/utils';

import { Snap } from '../..';
import { SnapSlideParallax } from '../SlideParallax';
import { parallaxAttributes } from '../SlideParallax/constants';

import { ISnapSlideProps } from './types';

export class SnapSlide {
  /** Snap component */
  private _snap?: Snap;

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

  /** Static coordinate (as if the slide was never moved) */
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
    };

    this._props = {
      ...defaultProps,
      ...initProps,
    } as Required<ISnapSlideProps>;

    if (this.props.virtual && (!initProps.size || initProps.size === 'auto')) {
      throw new Error('Virtual slide must have a defined size');
    }
  }

  /** Snap component */
  private get snap() {
    return this._snap;
  }

  /** Slide properties */
  private get props() {
    return this._props;
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

  /** Static coordinate (as if the slide was never moved) */
  get staticCoord() {
    return this._staticCoord;
  }

  /** Current progress of slide movement: from -1 to 1 */
  get progress() {
    return this._progress;
  }

  /** Size property */
  private get sizeProp() {
    return this.props.size ?? this.snap?.props.slideSize ?? 'auto';
  }

  /** Slide size in pixels */
  get size() {
    const { snap, sizeProp } = this;

    if (!snap) {
      return 0;
    }

    if (sizeProp === 'stretch') {
      return snap.containerSize;
    }

    if (sizeProp === 'auto') {
      return this._domSize ?? snap.containerSize;
    }

    return toPixels(sizeProp);
  }

  /** Check if the slide is visible */
  get isVisible() {
    return this._isVisible;
  }

  /** Resize the slide & trigger snap reflow */
  public resize(isManual = true) {
    const { element, snap } = this;

    if (!snap) {
      return;
    }

    // Update DOM size
    if (element) {
      this._domSize =
        snap.axis === 'x' ? element.offsetWidth : element.offsetHeight;
    }

    // Re-flow
    snap.resize(isManual);
  }

  /**
   * Attach the slide to the Snap class.
   * For internal use only
   */
  public $_attach(snap: Snap, index: number) {
    this.$_detach();

    this._snap = snap;
    this._index = index;

    this._parallax = this._getParallaxNodes().map(
      (node) => new SnapSlideParallax(snap, this, node),
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
    this._snap = undefined;
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

    const selector = parallaxAttributes.map((attr) => `[${attr}]`).join(',');
    const nodeList = element.querySelectorAll(selector);

    return Array.from(nodeList) as HTMLElement[];
  }

  /** Toggle slide append/remove */
  private _toggleAppend() {
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
  public get magnets() {
    if (!this.snap) {
      return [];
    }

    const { snap, staticCoord, size, index } = this;
    const { containerSize } = snap;

    let points: number[] = [];

    if (index === 0 && snap.props.loop) {
      points.push(snap.max);
    }

    if (snap.props.centered) {
      const point = staticCoord + size / 2 - snap.firstSlideSize / 2;

      if (size > containerSize) {
        points.push(point);
        points.push(point + (containerSize - size) / 2);
        points.push(point - (containerSize - size) / 2);
      } else {
        points.push(point);
      }
    } else {
      points.push(staticCoord);

      if (size > containerSize) {
        points.push(staticCoord + (size - containerSize));
      }
    }

    if (!snap.canLoop && !snap.props.centered) {
      points = points.map((point) => clamp(point, 0, snap.max));
    }

    return points;
  }

  /**
   * Update slide progress.
   * For internal use only
   */
  public $_updateProgress() {
    const { snap } = this;

    if (!snap) {
      return;
    }

    const { coord, size } = this;
    const { props, containerSize } = snap;

    if (props.centered) {
      const center = containerSize / 2 - size / 2;
      this._progress = scoped(coord, center, center - size);

      return;
    }

    this._progress = scoped(coord, 0, -size);
  }

  /**
   * Update slide values.
   * For internal use only
   */
  public $_updateCoords(offset: number) {
    const { snap } = this;
    if (!snap) {
      return;
    }

    const { staticCoord, size } = this;
    const { centered: isCentered } = snap.props;

    if (!snap.canLoop) {
      this._setCoord(staticCoord + offset - snap.current);

      return;
    }

    if (isCentered) {
      this._setCoord(
        loop(
          staticCoord + offset - snap.current,
          -snap.max / 2 + offset,
          snap.max / 2 + offset,
        ),
      );

      return;
    }

    this._setCoord(loop(staticCoord - snap.current, -size, snap.max - size));
  }

  /** Set slide coordinate */
  private _setCoord(value: number) {
    this._coord = value;

    this._isVisible =
      this.size > 0 &&
      this.coord > -this.size &&
      this.coord < (this.snap?.containerSize ?? 0);
  }
}
