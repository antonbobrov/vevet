import { DraggerBase } from '../DraggerBase';
import { NDraggerDirection } from './types';

export type { NDraggerDirection };

/**
 * A draggable component that detects the swipe direction (up, down, left, or right) based on the drag event.
 * Extends the base dragger functionality to determine the direction of the drag after it ends.
 *
 * @link See examples https://antonbobrov.github.io/vevet-demo/dragger-direction/
 *
 * @link See docs https://antonbobrov.github.io/vevet/classes/DraggerDirection.html
 */
export class DraggerDirection<
  StaticProps extends
    NDraggerDirection.IStaticProps = NDraggerDirection.IStaticProps,
  ChangeableProps extends
    NDraggerDirection.IChangeableProps = NDraggerDirection.IChangeableProps,
  CallbacksTypes extends
    NDraggerDirection.ICallbacksTypes = NDraggerDirection.ICallbacksTypes,
> extends DraggerBase<StaticProps, ChangeableProps, CallbacksTypes> {
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      minLength: 75,
    };
  }

  /**
   * Handles the end of the drag event and detects the swipe direction by comparing the start and end coordinates.
   * If the drag distance is greater than or equal to `minLength`, the corresponding direction callback is triggered.
   */
  protected _handleEnd(event: PointerEvent | null) {
    super._handleEnd(event);

    const { start, coords } = this;
    const { x, y } = coords;

    const min = Math.abs(this.props.minLength);

    // Detect swipe direction

    // Swipe up
    if (start.y > y && Math.abs(y - start.y) >= min) {
      this.callbacks.tbt('up', undefined);
    }

    // Swipe down
    if (start.y < y && Math.abs(y - start.y) >= min) {
      this.callbacks.tbt('down', undefined);
    }

    // Swipe left
    if (start.x > x && Math.abs(x - start.x) >= min) {
      this.callbacks.tbt('left', undefined);
    }

    // Swipe right
    if (start.x < x && Math.abs(x - start.x) >= min) {
      this.callbacks.tbt('right', undefined);
    }
  }
}
