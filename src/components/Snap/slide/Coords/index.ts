import { clamp, loop, scoped } from '@/utils';

import { ISnapSlideCoordsCtx } from './types';

/**
 * Per-slide coordinate, visibility, progress, and magnet points.
 *
 * @internal
 */
export class SnapSlideCoords {
  private _coord = 0;

  private _staticCoord = 0;

  private _progress = 0;

  private _isVisible = false;

  constructor(private _ctx: ISnapSlideCoordsCtx) {}

  get coord() {
    return this._coord;
  }

  get staticCoord() {
    return this._staticCoord;
  }

  get progress() {
    return this._progress;
  }

  get isVisible() {
    return this._isVisible;
  }

  /** @internal */
  public $_setStaticCoord(value: number) {
    this._staticCoord = value;
  }

  private _setCoord(value: number) {
    this._coord = value;

    const containerSize = this._ctx.getContainerSize() ?? 0;
    const slideSize = this._ctx.getSlideSize() ?? 0;

    this._isVisible =
      slideSize > 0 && this._coord > -slideSize && this._coord < containerSize;
  }

  private _updateProgress() {
    const { coord } = this;

    const origin = this._ctx.getOrigin();
    const containerSize = this._ctx.getContainerSize();
    const slideSize = this._ctx.getSlideSize();

    if (origin === 'center') {
      const center = containerSize / 2 - slideSize / 2;
      this._progress = scoped(coord, center, center - slideSize);

      return;
    }

    if (origin === 'end') {
      const end = containerSize - slideSize;
      this._progress = scoped(coord, end, end - slideSize);

      return;
    }

    this._progress = scoped(coord, 0, -slideSize);
  }

  private _updateCoords(current: number, offset: number) {
    const { staticCoord } = this;

    const origin = this._ctx.getOrigin();
    const slideSize = this._ctx.getSlideSize();
    const canLoop = this._ctx.getCanLoop();
    const max = this._ctx.getMax();

    if (!canLoop) {
      this._setCoord(staticCoord + offset - current);

      return;
    }

    if (origin === 'center') {
      this._setCoord(
        loop(
          staticCoord + offset - current,
          -max / 2 + offset,
          max / 2 + offset,
        ),
      );

      return;
    }

    if (origin === 'end') {
      this._setCoord(
        loop(staticCoord + offset - current, -slideSize, max - slideSize),
      );

      return;
    }

    this._setCoord(loop(staticCoord - current, -slideSize, max - slideSize));
  }

  /** @internal */
  public $_update(current: number, offset: number) {
    this._updateCoords(current, offset);
    this._updateProgress();
  }

  /** Snap points for this slide (depends on `origin` and oversized slides). */
  public get magnets() {
    const { staticCoord } = this;
    const origin = this._ctx.getOrigin();
    const size = this._ctx.getSlideSize();
    const canLoop = this._ctx.getCanLoop();
    const loop = this._ctx.getLoop();
    const max = this._ctx.getMax();
    const firstSlideSize = this._ctx.getFirstSlideSize();
    const containerSize = this._ctx.getContainerSize();

    let points: number[] = [];

    if (this._ctx.index === 0 && loop) {
      points.push(max);
    }

    if (origin === 'center') {
      const point = staticCoord + size / 2 - firstSlideSize / 2;

      if (size > containerSize) {
        points.push(point);
        points.push(point + (containerSize - size) / 2);
        points.push(point - (containerSize - size) / 2);
      } else {
        points.push(point);
      }
    } else if (origin === 'end') {
      const point = staticCoord + size - firstSlideSize;

      points.push(point);

      if (size > containerSize) {
        points.push(point + (containerSize - size));
      }
    } else {
      points.push(staticCoord);

      if (size > containerSize) {
        points.push(staticCoord + (size - containerSize));
      }

      if (!canLoop) {
        points = points.map((point) => clamp(point, 0, max));
      }
    }

    return points;
  }
}
