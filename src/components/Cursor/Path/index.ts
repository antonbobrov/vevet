import { lerp } from '@/utils';
import { ICursorPathVec2 } from './types';
import { LERP_APPROXIMATION } from '../constants';
import {
  catmullRomSplinePointAtLength,
  catmullRomSplineTotalLength,
} from './utils/catmullRom';
import { svgQuadraticCurvePath } from './utils/svgQuadraticCurvePath';

export class CursorPath {
  /** Cursor SVG Path Points */
  protected _points: ICursorPathVec2[] = [];

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

    // Add the final point
    points.push({ x: coords.x, y: coords.y });

    // Update path
    path.setAttribute('d', svgQuadraticCurvePath(points));

    // Update total length
    const totalLength = catmullRomSplineTotalLength(points);
    line.target = totalLength;

    // Instant update of line
    if (isInstant) {
      line.current = line.target;
    }
  }

  /** Minimize SVG Path */
  public minimize() {
    if (!this._isEnabled || this._points.length < 3) {
      return;
    }

    const points = this._points;
    const line = this._line;
    const currentPosition = line.current;

    // Find how many points we can remove
    // We need to keep at least 2 points for Catmull-Rom spline
    let removeCount = 0;

    // Check each point to see if the path length to it is less than current position
    for (let i = 1; i < points.length - 1; i += 1) {
      const subsetPoints = points.slice(0, i + 2);
      const lengthToPoint = catmullRomSplineTotalLength(subsetPoints);

      if (lengthToPoint < currentPosition) {
        removeCount = i + 1;
      } else {
        break;
      }
    }

    if (removeCount === 0) {
      return;
    }

    // Save total length before removal
    const totalLengthBefore = catmullRomSplineTotalLength(points);

    // Remove points
    points.splice(0, removeCount);

    // Calculate total length after removal and adjust line positions
    const totalLengthAfter = catmullRomSplineTotalLength(points);
    const removedLength = totalLengthBefore - totalLengthAfter;

    line.current = Math.max(0, line.current - removedLength);
    line.target = Math.max(0, line.target - removedLength);

    // Update path
    this._path.setAttribute('d', svgQuadraticCurvePath(points));
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
    if (this._points.length === 0) {
      return { x: 0, y: 0 };
    }

    if (this._points.length === 1) {
      return { x: this._points[0].x, y: this._points[0].y };
    }

    const point = catmullRomSplinePointAtLength(
      this._points,
      this._line.current,
    );

    return point;
  }
}
