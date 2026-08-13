import { ICursorPathPoint } from './types';

export const svgQuadraticCurvePath = (points: ICursorPathPoint[]) => {
  let path = `M${points[0].x},${points[0].y}`;

  for (let i = 0; i < points.length - 1; i += 1) {
    const xMid = (points[i].x + points[i + 1].x) / 2;
    const yMid = (points[i].y + points[i + 1].y) / 2;

    path += `Q ${points[i].x}, ${points[i].y}, ${xMid}, ${yMid}`;
  }

  path += `L ${points[points.length - 1].x}, ${points[points.length - 1].y}`;

  return path;
};
