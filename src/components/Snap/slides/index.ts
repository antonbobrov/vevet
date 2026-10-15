import { Snap } from '..';
import { SnapSlide } from '../slide';
import { ISnapSlideCtx } from '../slide/ctx';

/**
 * Collects, attaches, reflows, and renders {@link SnapSlide} instances.
 *
 * @internal
 */
export class SnapSlides {
  private _slides: SnapSlide[] = [];

  private _length = 0;

  constructor() {}

  get length() {
    return this._length;
  }

  get isEmpty() {
    return this._length === 0;
  }

  get all() {
    return this._slides;
  }

  public getFirstSlide() {
    return this._slides[0];
  }

  public getLastSlide() {
    return this._slides[this._length - 1];
  }

  public at(index: number) {
    return this._slides[index];
  }

  public detachAll() {
    this._slides.forEach((slide) => slide.$_detach());
  }

  private _fetch(
    selector: (HTMLElement | SnapSlide)[] | false,
    container: HTMLElement,
  ) {
    const rawChildren = selector ? selector : Array.from(container.children);

    // Ignore scrollbar track elements inside the container
    const children = rawChildren.filter((slide) => {
      if (
        slide instanceof HTMLElement &&
        slide.hasAttribute('data-scrollbar')
      ) {
        return false;
      }

      return true;
    });

    if (!children.length) {
      throw new Error('No slides found');
    }

    this._slides = children.map((item) => {
      if (item instanceof SnapSlide) {
        return item;
      }

      return new SnapSlide(item as any);
    });

    this._length = this._slides.length;
  }

  private _attachAll(ctx: ISnapSlideCtx) {
    this._slides.forEach((slide, index) => slide.$_attach(ctx, index));
  }

  public collect(snap: Snap) {
    this.detachAll();

    this._fetch(snap.props.slides as any, snap.container);

    this._attachAll({
      getGlobalSlideSize: () => snap.props.slideSize,
      getContainerSize: () => snap.containerSize,
      getContainer: () => snap.container,
      getAxis: () => snap.axis,
      getOrigin: () => snap.origin,
      getCanLoop: () => snap.canLoop,
      getLoop: () => snap.props.loop,
      requestGlobalResize: (isManual) => snap.resize(isManual),
      getMax: () => snap.max,
      getFirstSlideSize: () => this.getFirstSlide().size,
      getImpulse: () => snap.impulse,
    });
  }

  public reflow(gap: number) {
    this._slides.reduce((prev, slide) => {
      slide.$_setStaticCoord(prev);

      return prev + slide.size + gap;
    }, 0);
  }

  public render() {
    this._slides.forEach((slide) => slide.$_render());
  }
}
