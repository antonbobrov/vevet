import { ModulePart } from '@/shared/ModulePart';

import { Swipe } from '..';

/**
 * Directional callbacks from swipe displacement on gesture end.
 *
 * Compares `|diff.x|` vs `|diff.y|` and emits one axis when above
 * `directionThreshold`.
 *
 * @internal
 */
export class SwipeDirection extends ModulePart<Swipe> {
  /** Emits `toLeft` / `toRight` / `toTop` / `toBottom` from displacement. */
  public emit() {
    const { x: diffX, y: diffY } = this.parent.diff;
    const absDiffX = Math.abs(diffX);
    const absDiffY = Math.abs(diffY);

    const { directionThreshold } = this.props;
    const endAxis = absDiffX > absDiffY ? 'x' : 'y';

    if (endAxis === 'x' && absDiffX > directionThreshold) {
      if (diffX > 0) {
        this.callbacks.emit('toRight', undefined);
      } else if (diffX < 0) {
        this.callbacks.emit('toLeft', undefined);
      }
    }

    if (endAxis === 'y' && absDiffY > directionThreshold) {
      if (diffY > 0) {
        this.callbacks.emit('toBottom', undefined);
      } else if (diffY < 0) {
        this.callbacks.emit('toTop', undefined);
      }
    }
  }
}
