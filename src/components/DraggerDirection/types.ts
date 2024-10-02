import { NDraggerBase } from '../DraggerBase';

export namespace NDraggerDirection {
  export interface IStaticProps extends NDraggerBase.IStaticProps {
    /**
     * The minimum length (in pixels) required for a swipe to be considered valid and trigger direction events.
     * If the drag distance is less than this value, no directional callback will be triggered.
     *
     * @default 75
     */
    minLength?: number;
  }

  export interface IChangeableProps extends NDraggerBase.IChangeableProps {}

  export interface ICallbacksTypes extends NDraggerBase.ICallbacksTypes {
    /**
     * Callback triggered when a swipe up is detected.
     */
    up: undefined;

    /**
     * Callback triggered when a swipe down is detected.
     */
    down: undefined;

    /**
     * Callback triggered when a swipe left is detected.
     */
    left: undefined;

    /**
     * Callback triggered when a swipe right is detected.
     */
    right: undefined;
  }
}
