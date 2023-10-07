import { NDraggerBase } from '../DraggerBase';

export namespace NDraggerMove {
  export interface IStaticProps extends NDraggerBase.IStaticProps {
    /**
     * Disable pointer events
     * when the difference in coordinates is more than the value (px).
     *
     * @default false
     */
    disablePointerEventsAt?: number | false;
  }

  export interface IChangeableProps extends NDraggerBase.IChangeableProps {}

  export interface ICallbacksTypes extends NDraggerBase.ICallbacksTypes {
    move: IMoveParameter;
  }

  export interface IMoveParameter extends NDraggerBase.IStartParameter {
    step: NDraggerBase.IVector2;
    diff: NDraggerBase.IVector2;
  }
}
