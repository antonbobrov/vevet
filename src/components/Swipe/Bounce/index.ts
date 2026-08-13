import { ModulePart, now } from '@/internal';
import { EaseOutCubic } from '@/utils';

import { Swipe } from '..';
import { Timeline } from '../../Timeline';
import { SwipeCoords } from '../Coords';
import { ISwipeState } from '../global';

/**
 * Overflow bounce-back animation via {@link Timeline}.
 *
 * Animates pointer position to cancel `exceeds` overflow when `canBounce` allows.
 *
 * @internal
 */
export class SwipeBounce extends ModulePart<Swipe> {
  private _tm?: Timeline;

  constructor(
    parent: Swipe,
    private _coords: SwipeCoords,
    private _onMove: (state: ISwipeState) => void,
  ) {
    super(parent);
  }

  /** Whether bounce-back animation is running. */
  get has() {
    return !!this._tm;
  }

  /** Animates movement back inside bounds after overflow. */
  public release(targetDuration?: number) {
    this.cancel();

    const { exceeds } = this._coords;

    if (!this.props.canBounce()) {
      return;
    }

    if (!exceeds || (!exceeds.x && !exceeds.y && !exceeds.angle)) {
      return;
    }

    const start = { ...this.parent.current };

    const duration = targetDuration ?? this.props.bounceDuration;
    const tm = new Timeline({ duration, easing: EaseOutCubic });
    this._tm = tm;

    this._coords.syncTempAngle();

    tm.on('update', ({ eased }) => {
      this._onMove({
        x: start.x - exceeds.x * eased,
        y: start.y - exceeds.y * eased,
        angle: start.angle - exceeds.angle * eased,
        time: now(),
      });
    });

    tm.on('end', () => this.cancel());

    tm.play();
  }

  /** Stops overflow bounce animation. */
  public cancel() {
    this._tm?.destroy();
    this._tm = undefined;
  }
}
