import { lerp } from '@/utils';
import { svgQuadraticCurvePath } from './svgQuadraticCurvePath';
import { ICursorPathPoint, ICursorPathVec2 } from './types';
import { LERP_APPROXIMATION } from '../constants';
import { isFiniteNumber } from '@/internal/isFiniteNumber';

export class CursorPath {
  /** Cursor SVG Path Points */
  protected _points: ICursorPathPoint[] = [];

  /** Cursor SVG Path */
  protected _path: SVGPathElement;

  /** Cursor SVG Path Line */
  protected _line = { current: 0, target: 0 };

  get path() {
    return this._path;
  }

  constructor(protected _isEnabled: boolean) {
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

  /** Update SVG Path */
  public addPoint(coords: ICursorPathVec2, isInstant = false) {
    if (!this._isEnabled) {
      return;
    }

    const points = this._points;
    const path = this._path;
    const line = this._line;

    // Add point
    const newPoint = { x: coords.x, y: coords.y, length: 0 };
    points.push(newPoint);

    // Update path
    path.setAttribute('d', svgQuadraticCurvePath(points));

    // Update total length
    const totalLength = path.getTotalLength();
    newPoint.length = totalLength;
    line.target = totalLength;

    // Instant update of line
    if (isInstant) {
      line.current = line.target;
    }
  }

  /** Minimize SVG Path */
  public minimize() {
    if (!this._isEnabled) {
      return;
    }

    const points = this._points;
    const line = this._line;

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

      // Fix line after points removed
      line.current = Math.max(0, line.current - removedLength);
      line.target = Math.max(0, line.target - removedLength);

      // Update path
      this._path.setAttribute('d', svgQuadraticCurvePath(points));
    }
  }

  /** Check if the path is interpolated */
  public get isInterpolated() {
    return this._line.current === this._line.target;
  }

  /** Interpolate line */
  public lerp(factor: number) {
    const line = this._line;

    line.current = lerp(line.current, line.target, factor, LERP_APPROXIMATION);
  }

  /** Get current coordinate */
  get coord() {
    return this._path.getPointAtLength(this._line.current);
  }
}
