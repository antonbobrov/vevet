import { isFiniteNumber, ModulePart, SmoothNumber } from '@/internal';

import { Cursor } from '..';
import { LERP_APPROXIMATION } from '../constants';

import { ICursorPathPoint } from './types';
import { svgQuadraticCurvePath } from './utils';

/**
 * SVG path trail and length interpolation when `behavior` is `'path'`.
 *
 * The `<path>` is created for length sampling and exposed via {@link Cursor.path};
 * mounting it in the document is left to the consumer.
 *
 * @internal
 */
export class CursorPath extends ModulePart<Cursor> {
  private _line: SmoothNumber;

  private _points: ICursorPathPoint[] = [];

  private _path: SVGPathElement;

  constructor(parent: Cursor) {
    super(parent);

    this._line = new SmoothNumber(0);

    this._path = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path',
    )!;

    const path = this._path;

    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('fill', 'transparent');
    path.setAttribute('stroke', '#f00');
  }

  get path() {
    return this._path;
  }

  get has() {
    return this.props.behavior === 'path';
  }

  private get points() {
    return this._points;
  }

  private get line() {
    return this._line;
  }

  public addPoint(x: number, y: number, isInstant = false) {
    if (!this.has) {
      return;
    }

    const { points, path, line } = this;

    const newPoint = { x, y, length: 0 };
    points.push(newPoint);

    path.setAttribute('d', svgQuadraticCurvePath(points));

    const totalLength = path.getTotalLength();
    newPoint.length = totalLength;
    line.target = totalLength;

    if (isInstant) {
      line.syncWithTarget();
    }
  }

  /** Drops leading points that are already behind the interpolated line head. */
  public minimize() {
    if (!this.has) {
      return;
    }

    const { points, line } = this;

    if (points.length < 3) {
      return;
    }

    let accumulated = 0;
    let removeCount = 0;

    for (let i = 1; i < points.length; i += 1) {
      const dx = points[i].x - points[i - 1].x;
      const dy = points[i].y - points[i - 1].y;
      const segLength = Math.hypot(dx, dy);

      if (accumulated + segLength < line.current) {
        accumulated += segLength;
        removeCount += 1;
      } else {
        break;
      }
    }

    if (isFiniteNumber(removeCount) && removeCount > 0) {
      let removedLength = 0;

      for (let i = 1; i <= removeCount; i += 1) {
        const dx = points[i].x - points[i - 1].x;
        const dy = points[i].y - points[i - 1].y;
        removedLength += Math.hypot(dx, dy);
      }

      points.splice(0, removeCount);

      line.current = Math.max(0, line.current - removedLength);
      line.target = Math.max(0, line.target - removedLength);

      this._path.setAttribute('d', svgQuadraticCurvePath(points));
    }
  }

  get isInterpolated() {
    return this.line.interpolated;
  }

  public lerp(factor: number) {
    this.line.toTarget(factor, LERP_APPROXIMATION);
  }

  get coord() {
    return this.path.getPointAtLength(this._line.current);
  }
}
