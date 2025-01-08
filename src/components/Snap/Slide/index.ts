import { IOnResize, onResize, toPixels, uid } from '@/utils';
import { Snap } from '..';
import { ISnapSlideProps } from './types';

export class SnapSlide {
  constructor(
    protected _element: HTMLElement | null,
    initProps: ISnapSlideProps = {},
  ) {
    this._id = uid('snap-slide');
    this._index = 0;

    const defaultProps: ISnapSlideProps = {
      size: 'auto',
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

  /** If the slide is appended */
  protected _isAppended = false;

  /** Snap component */
  protected _snap?: Snap;

  /** Snap component */
  protected get snap() {
    return this._snap;
  }

  /** Events on slide resize */
  protected _onResize?: IOnResize;

  /** Size of the element */
  protected _domSize: undefined | number;

  /** Current coordinate */
  protected _coord = 0;

  /** Current coordinate */
  get coord() {
    return this._coord;
  }

  /** Current coordinate. Do not update it manually! */
  public setCoord(value: number) {
    this._coord = value;
  }

  /** Static coordinate (as if the slide was never moved) */
  protected _staticCoord = 0;

  /** Static coordinate (as if the slide was never moved) */
  get staticCoord() {
    return this._staticCoord;
  }

  /** Static coordinate (as if the slide was never moved). Do not update it manually! */
  public setStaticCoord(value: number) {
    this._staticCoord = value;
  }

  /** Current progress of slide movement: from -1 to 1 */
  protected _progress = 0;

  /** Current progress of slide movement: from -1 to 1 */
  get progress() {
    return this._progress;
  }

  /** Current progress of slide movement: from -1 to 1. Do not update it manually! */
  public setProgress(value: number) {
    this._progress = value;
  }

  /** Slide size in pixels */
  get size() {
    if (this.props.size === 'auto') {
      return this._domSize ?? this.snap?.domSize ?? 0;
    }

    return toPixels(this.props.size);
  }

  /** Check if the slide is visible */
  get isVisible() {
    return (
      this.size > 0 &&
      this.coord > -this.size &&
      this.coord < (this.snap?.domSize ?? 0)
    );
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

    if (this.element && this.props.size === 'auto') {
      this._onResize = onResize({
        element: this.element,
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
  }

  /** Render the slide */
  public render() {
    this._toggleAppend();
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
}
