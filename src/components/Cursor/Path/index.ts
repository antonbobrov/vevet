import { Raf } from '@/components/Raf';
import { isFiniteNumber, isNumber, ModulePart } from '@/internal';

import { Cursor } from '..';
import { APPX } from '../constants';

import { ICursorPathPoint } from './types';
import { svgQuadraticCurvePath } from './utils';

/**
 * SVG path trail and length interpolation when `behavior` is `'path'`.
 *
 * The `<path>` is created for length sampling and exposed via {@link Cursor.path};
 * mounting it in the document is left to the consumer.
 *
 * Uses numeric {@link Cursor} `easeCoords`; non-number falls back to `0.1` with a warning.
 *
 * @internal
 */
export class CursorPath extends ModulePart<Cursor> {
  private _points: ICursorPathPoint[] = [];

  private _path: SVGPathElement;

  private key: string;

  private _warnedEaseCoords = false;

  constructor(
    parent: Cursor,
    private raf: Raf,
  ) {
    super(parent);

    this.key = 'path';

    raf.add(this.key, {
      value: 0,
      ease: () => this.easeCoords,
      target: 0,
      appx: APPX,
    });

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

  private get easeCoords() {
    const ease =
      this.props.easeCoords === 'auto'
        ? this.parent.ease
        : this.props.easeCoords;

    if (!isNumber(ease)) {
      if (!this._warnedEaseCoords) {
        this._warnedEaseCoords = true;
        // eslint-disable-next-line no-console
        console.warn(
          'CursorPath requires a numeric `easeCoords`, falling back to 0.1',
        );
      }

      return 0.1;
    }

    return ease;
  }

  private get points() {
    return this._points;
  }

  public addPoint(x: number, y: number, immediate = false) {
    if (!this.has) {
      return;
    }

    const { points, path } = this;

    const newPoint = { x, y, length: 0 };
    points.push(newPoint);

    path.setAttribute('d', svgQuadraticCurvePath(points));

    const totalLength = path.getTotalLength();
    newPoint.length = totalLength;

    this.raf.target(this.key, totalLength, immediate);
  }

  /** Drops leading points that are already behind the interpolated line head. */
  public minimize() {
    if (!this.has) {
      return;
    }

    const { points, raf, key } = this;

    if (points.length < 3) {
      return;
    }

    let accumulated = 0;
    let removeCount = 0;

    for (let i = 1; i < points.length; i += 1) {
      const dx = points[i].x - points[i - 1].x;
      const dy = points[i].y - points[i - 1].y;
      const segLength = Math.hypot(dx, dy);

      if (accumulated + segLength < raf.value(key)) {
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

      raf.value(key, Math.max(0, raf.value(key) - removedLength));
      raf.target(key, Math.max(0, raf.target(key) - removedLength));

      this._path.setAttribute('d', svgQuadraticCurvePath(points));
    }
  }
  get coord() {
    return this.path.getPointAtLength(this.raf.value(this.key));
  }
}
