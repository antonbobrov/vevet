import { initVevet } from '@/global/initVevet';
import { now } from '@/internal/now';
import { unwrapAngleDelta } from '@/internal/unwrapAngle';
import { ModulePart } from '@/shared/ModulePart';

import { Swipe } from '../..';
import { ISwipeState, ISwipeVec2 } from '../../global';

/** Unwrapped angle state for cumulative rotation. */
export interface ISwipeDecodeAngle {
  raw: number;
  unwrapped: number;
}

/**
 * Parses pointer events into swipe coordinate space.
 *
 * @internal
 */
export class SwipeDecode extends ModulePart<Swipe> {
  /** Parses pointer coordinates relative to the container. */
  public decode(event: MouseEvent | TouchEvent | ISwipeVec2): ISwipeState {
    const vevet = initVevet();
    const { container, props } = this.parent;

    let clientX = 0;
    let clientY = 0;

    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if ('type' in event) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      clientX = event.x;
      clientY = event.y;
    }

    let x = clientX;
    let y = clientY;

    let centerX = vevet.width / 2;
    let centerY = vevet.height / 2;

    if (props.relative) {
      const bounding = container.getBoundingClientRect();

      x = clientX - bounding.left;
      y = clientY - bounding.top;
      centerX = bounding.left + bounding.width / 2;
      centerY = bounding.top + bounding.height / 2;
    }

    const angleRad = Math.atan2(clientY - centerY, clientX - centerX);
    const angle = (angleRad * 180) / Math.PI;

    return { x, y, angle, time: now() };
  }

  /** Unwraps raw atan2 angle and accumulates into `angle.unwrapped`. */
  public updateAngle(angle: ISwipeDecodeAngle, rawAngle: number) {
    angle.unwrapped += unwrapAngleDelta(rawAngle, angle.raw);
    angle.raw = rawAngle;
  }
}
