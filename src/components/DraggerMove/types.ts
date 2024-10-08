import { NDraggerBase } from '../DraggerBase';

export namespace NDraggerMove {
  export interface IStaticProps extends NDraggerBase.IStaticProps {
    /**
     * Disables pointer events when the difference in coordinates exceeds the specified value (in pixels).
     * Set this value to a number to define the threshold after which pointer events are disabled.
     * Set to `false` to leave pointer events unaffected.
     *
     * @default false
     */
    disablePointerEventsAt?: number | false;
  }

  export interface IChangeableProps extends NDraggerBase.IChangeableProps {}

  export interface ICallbacksTypes extends NDraggerBase.ICallbacksTypes {
    /**
     * Callback triggered during the drag movement, providing details about the current, step, and difference coordinates.
     */
    move: IMoveParameter;
  }

  export interface IMoveParameter extends NDraggerBase.IStartParameter {
    /**
     * The step difference in coordinates between the current and previous position during dragging.
     */
    step: NDraggerBase.IVector2;

    /**
     * The difference in coordinates between the start position and the current position during dragging.
     */
    diff: NDraggerBase.IVector2;

    /**
     * The absolute difference in coordinates between the start position and the current position, accumulating all movement.
     */
    absDiff: NDraggerBase.IVector2;
  }
}
