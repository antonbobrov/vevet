import { isString } from '@/internal/isString';
import { ModulePart } from '@/shared/ModulePart';
import { closest, loop } from '@/utils';

import { Snap } from '../..';
import { ISnapMagnet, ISnapNexPrevArg, ISnapToSlideArg } from '../../global';

/**
 * Magnet lookup and slide navigation (`stick`, `toSlide`, `next`, `prev`).
 *
 * @internal
 */
export class SnapNavigator extends ModulePart<Snap> {
  private _targetIndex?: number;

  constructor(parent: Snap) {
    super(parent);
  }

  private get slides() {
    return this.parent.slides;
  }

  private get length() {
    return this.slides.length;
  }

  get targetIndex() {
    return this._targetIndex;
  }

  get magnet(): ISnapMagnet | undefined {
    const current = this.parent.loopedCurrent;

    return this.getNearestMagnet(current);
  }

  public resetTargetIndex() {
    this.setTargetIndex(undefined);
  }

  public setTargetIndex(value: number | undefined) {
    this._targetIndex = value;
  }

  public getNearestMagnet(coord: number): ISnapMagnet | undefined {
    const withMagnets = this.slides.map((slide) =>
      slide.magnets.map((magnet) => ({
        slide,
        magnet,
        index: slide.index,
      })),
    );

    const magnets = withMagnets.flat();

    if (magnets.length === 0) {
      return undefined;
    }

    const closestMagnet = magnets.reduce((p, c) =>
      Math.abs(c.magnet - coord) < Math.abs(p.magnet - coord) ? c : p,
    );

    return { ...closestMagnet, diff: closestMagnet.magnet - coord };
  }

  public stick() {
    const { magnet } = this;

    if (this.parent.isSlideScrolling || !magnet) {
      return false;
    }

    return this.parent.toCoord(this.parent.current + magnet.diff);
  }

  public toSlide(
    targetIndex: number,
    { direction = null, ...options }: ISnapToSlideArg = {},
  ) {
    const { activeIndex, origin, canLoop, current, max, loopCount } =
      this.parent;

    if (this.isDestroyed) {
      return false;
    }

    const index = loop(targetIndex, 0, this.length);

    // Return if the same slide
    if (index === activeIndex) {
      return false;
    }

    // Update target index
    this.setTargetIndex(index);

    const slideMagnets = this.slides.at(index)!.magnets;
    let targetStaticMagnet = slideMagnets[0];

    // Pick magnet point based on origin and navigation direction
    if (origin === 'center') {
      if (direction === 'prev') {
        targetStaticMagnet = slideMagnets[2] ?? slideMagnets[0];
      } else if (direction === 'next') {
        targetStaticMagnet = slideMagnets[1] ?? slideMagnets[0];
      }
    } else if (origin === 'end') {
      targetStaticMagnet =
        direction === 'next'
          ? slideMagnets[slideMagnets.length - 1]
          : targetStaticMagnet;
    } else {
      targetStaticMagnet =
        direction === 'prev'
          ? slideMagnets[slideMagnets.length - 1]
          : targetStaticMagnet;
    }

    if (!canLoop) {
      return this.parent.toCoord(targetStaticMagnet, options);
    }

    const targetMagnet = targetStaticMagnet + loopCount * max;
    const targetMagnetMin = targetMagnet - max;
    const targetMagnetMax = targetMagnet + max;
    const allMagnets = [targetMagnetMin, targetMagnet, targetMagnetMax];

    if (isString(direction)) {
      const magnets = allMagnets.filter((magnet) =>
        direction === 'next' ? magnet >= current : magnet <= current,
      );
      const magnet = closest(current, magnets);

      return this.parent.toCoord(magnet, options);
    }

    const magnet = closest(current, allMagnets);

    return this.parent.toCoord(magnet, options);
  }

  public next({
    skip = this.props.slidesToScroll,
    ...options
  }: ISnapNexPrevArg = {}) {
    const { props, activeIndex, canLoop } = this.parent;
    const { length } = this;

    let index = loop(activeIndex + skip, 0, length);

    if (!canLoop) {
      index = props.rewind
        ? loop(activeIndex + skip, 0, length)
        : Math.min(activeIndex + skip, length - 1);
    }

    return this.toSlide(index, { ...options, direction: 'next' });
  }

  public prev({
    skip = this.props.slidesToScroll,
    ...options
  }: ISnapNexPrevArg = {}) {
    const { props, activeIndex, canLoop } = this.parent;
    const { length } = this;

    let index = loop(activeIndex - skip, 0, length);

    if (!canLoop) {
      index = props.rewind
        ? loop(activeIndex - skip, 0, length)
        : Math.max(activeIndex - skip, 0);
    }

    return this.toSlide(index, { ...options, direction: 'prev' });
  }
}
