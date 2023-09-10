import { NDraggerBase } from '../DraggerBase';

export namespace NDraggerDirection {
  export interface IStaticProps extends NDraggerBase.IStaticProps {
    /**
     * The minimum swipe length (px) to launch events
     * @default 75
     */
    minLength?: number;
  }

  export interface IChangeableProps extends NDraggerBase.IChangeableProps {}

  export interface ICallbacksTypes extends NDraggerBase.ICallbacksTypes {
    up: undefined;
    down: undefined;
    left: undefined;
    right: undefined;
  }
}
