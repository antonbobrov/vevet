import { DraggerBase, NDraggerBase } from '../DraggerBase';
import { NDraggerDirection } from './types';

export type { NDraggerDirection };

/**
 * `Dragger` that detects swipe direction
 */
export class DraggerDirection<
  StaticProps extends NDraggerDirection.IStaticProps = NDraggerDirection.IStaticProps,
  ChangeableProps extends NDraggerDirection.IChangeableProps = NDraggerDirection.IChangeableProps,
  CallbacksTypes extends NDraggerDirection.ICallbacksTypes = NDraggerDirection.ICallbacksTypes
> extends DraggerBase<StaticProps, ChangeableProps, CallbacksTypes> {
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      minLength: 75,
    };
  }

  /** Event on drag end */
  protected _handleEnd(event: NDraggerBase.TEvent) {
    const { x, y } = this._getEventCoords(event);
    const { startCoords } = this;
    const min = Math.abs(this.props.minLength);

    // up
    if (startCoords.y > y && Math.abs(y - startCoords.y) >= min) {
      this.callbacks.tbt('up', undefined);
    }

    // down
    if (startCoords.y < y && Math.abs(y - startCoords.y) >= min) {
      this.callbacks.tbt('down', undefined);
    }

    // left
    if (startCoords.x > x && Math.abs(x - startCoords.x) >= min) {
      this.callbacks.tbt('left', undefined);
    }

    // right
    if (startCoords.x < x && Math.abs(x - startCoords.x) >= min) {
      this.callbacks.tbt('right', undefined);
    }

    super._handleEnd(event);
  }
}
