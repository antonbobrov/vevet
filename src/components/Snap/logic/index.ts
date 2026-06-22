import { Snap } from '..';

export class SnapLogic {
  /** Listeners to destruct */
  private _destructors: (() => void)[] = [];

  constructor(private _snap: Snap) {
    _snap.on('destroy', () => this._destroy(), { protected: true });
  }

  /** Snap component */
  protected get props() {
    return this._snap.props;
  }

  protected get container() {
    return this._snap.container;
  }

  /** Snap component */
  protected get callbacks() {
    return this._snap.callbacks;
  }

  protected get isSwiping() {
    return this._snap.isSwiping;
  }

  protected get isWheeling() {
    return this._snap.isWheeling;
  }

  protected get hasInertia() {
    return this._snap.hasInertia;
  }

  protected get isInterpolating() {
    return this._snap.isInterpolating;
  }

  protected get isTransitioning() {
    return this._snap.isTransitioning;
  }

  protected get eventsEmitter() {
    return this._snap.eventsEmitter;
  }

  protected get snapAxis() {
    return this._snap.axis;
  }

  protected get track() {
    return this._snap.$_track;
  }

  protected get canLoop() {
    return this._snap.canLoop;
  }

  protected get isSlideScrolling() {
    return this._snap.isSlideScrolling;
  }

  protected get containerSize() {
    return this._snap.containerSize;
  }

  protected get activeSlide() {
    return this._snap.activeSlide;
  }

  protected get activeIndex() {
    return this._snap.activeIndex;
  }

  protected get slidesCount() {
    return this._snap.slides.length;
  }

  protected get isDestroyed() {
    return this._snap.isDestroyed;
  }

  protected get scrollableSlides() {
    return this._snap.scrollableSlides;
  }

  /** Snap component */
  protected addDestructor(callback: () => void) {
    this._destructors.push(callback);
  }

  /** Destroy wheel listeners */
  private _destroy() {
    this._destructors.forEach((destructor) => destructor());
  }

  protected next() {
    return this._snap.next();
  }

  protected prev() {
    return this._snap.prev();
  }

  protected stick() {
    return this._snap.stick();
  }

  protected getNearestMagnet(coord: number) {
    return this._snap.getNearestMagnet(coord);
  }
}
