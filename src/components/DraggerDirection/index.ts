import { DraggerBase, NDraggerBase } from '../DraggerBase';
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
  protected _handleEnd(event: NDraggerBase.TEvent) {
    const { x, y } = this._getEventCoords(event);
    const { startCoords } = this;
    const min = Math.abs(this.props.minLength);

    // Detect swipe direction
    // Swipe up
    if (startCoords.y > y && Math.abs(y - startCoords.y) >= min) {
      this.callbacks.tbt('up', undefined);
    }

    // Swipe down
    if (startCoords.y < y && Math.abs(y - startCoords.y) >= min) {
      this.callbacks.tbt('down', undefined);
    }

    // Swipe left
    if (startCoords.x > x && Math.abs(x - startCoords.x) >= min) {
      this.callbacks.tbt('left', undefined);
    }

    // Swipe right
    if (startCoords.x < x && Math.abs(x - startCoords.x) >= min) {
      this.callbacks.tbt('right', undefined);
    }

    // Call the parent class's `_handleEnd` method for further cleanup
    super._handleEnd(event);
  }
}
