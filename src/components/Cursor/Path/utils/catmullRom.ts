import { ICursorPathVec2 } from '../types';

function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number) {
  const t2 = t * t;
  const t3 = t2 * t;

  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
  );
}

function catmullRom2D(
  p0: ICursorPathVec2,
  p1: ICursorPathVec2,
  p2: ICursorPathVec2,
  p3: ICursorPathVec2,
  t: number,
) {
  return {
    x: catmullRom(p0.x, p1.x, p2.x, p3.x, t),
    y: catmullRom(p0.y, p1.y, p2.y, p3.y, t),
  };
}

function catmullRomSpline(points: ICursorPathVec2[], segments = 20) {
  const res = [];

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    for (let j = 0; j < segments; j += 1) {
      const t = j / segments;
      res.push(catmullRom2D(p0, p1, p2, p3, t));
    }
  }

  const lastPoint = points.at(-1);
  if (lastPoint) {
    res.push(lastPoint);
  }

  return res;
}

export function catmullRomSplineTotalLength(
  points: ICursorPathVec2[],
  segments = 20,
): number {
  if (points.length === 0) {
    return 0;
  }

  if (points.length === 1) {
    return 0;
  }

  // Generate spline points
  const splinePoints = catmullRomSpline(points, segments);

  // Calculate total length
  let totalLength = 0;

  for (let i = 1; i < splinePoints.length; i += 1) {
    const p1 = splinePoints[i - 1];
    const p2 = splinePoints[i];

    if (p1 && p2) {
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const segmentLength = Math.hypot(dx, dy);
      totalLength += segmentLength;
    }
  }

  return totalLength;
}

export function catmullRomSplinePointAtLength(
  points: ICursorPathVec2[],
  targetLength: number,
  segments = 20,
): { x: number; y: number } {
  if (points.length === 0) {
    return { x: 0, y: 0 };
  }

  if (points.length === 1) {
    return { x: points[0].x, y: points[0].y };
  }

  if (targetLength <= 0) {
    return { x: points[0].x, y: points[0].y };
  }

  // Generate spline points
  const splinePoints = catmullRomSpline(points, segments);

  // Calculate cumulative lengths
  const lengths: number[] = [0];
  let totalLength = 0;

  for (let i = 1; i < splinePoints.length; i += 1) {
    const dx = splinePoints[i].x - splinePoints[i - 1].x;
    const dy = splinePoints[i].y - splinePoints[i - 1].y;
    const segmentLength = Math.hypot(dx, dy);
    totalLength += segmentLength;
    lengths.push(totalLength);
  }

  // Clamp targetLength to total length
  const clampedLength = Math.min(targetLength, totalLength);

  if (clampedLength >= totalLength) {
    const lastPoint = splinePoints[splinePoints.length - 1];

    if (!lastPoint) {
      return {
        x: points[points.length - 1]?.x ?? 0,
        y: points[points.length - 1]?.y ?? 0,
      };
    }

    return { x: lastPoint.x, y: lastPoint.y };
  }

  // Find the segment containing the target length
  let segmentIndex = 0;
  for (let i = 1; i < lengths.length; i += 1) {
    if (lengths[i] >= clampedLength) {
      segmentIndex = i - 1;
      break;
    }
  }

  // Interpolate within the segment
  const segmentStartLength = lengths[segmentIndex] ?? 0;
  const segmentEndLength = lengths[segmentIndex + 1] ?? 0;
  const segmentLength = segmentEndLength - segmentStartLength;
  const t =
    segmentLength > 0
      ? (clampedLength - segmentStartLength) / segmentLength
      : 0;

  const p1 = splinePoints[segmentIndex];
  const p2 = splinePoints[segmentIndex + 1];

  if (!p1 || !p2) {
    return { x: 0, y: 0 };
  }

  return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t,
  };
}
