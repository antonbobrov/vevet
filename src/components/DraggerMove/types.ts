import { NDraggerBase } from '../DraggerBase';

export namespace NDraggerMove {
  export interface IStaticProps extends NDraggerBase.IStaticProps {}

  export interface IChangeableProps extends NDraggerBase.IChangeableProps {
    /**
     * Threshold value in px. If "touch distance" will be lower than this value then dragger move events will not trigger
     * @default 5
     */
    threshold?: number;
  }

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
     * Total movement
     */
    total: NDraggerBase.IVector2;
  }
}
