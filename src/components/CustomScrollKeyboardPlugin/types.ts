import { NPlugin } from '@/base/Plugin/types';

export namespace NCustomScrollKeyboardPlugin {
  export interface IStaticProps extends NPlugin.IStaticProps {}

  export interface IChangeableProps extends NPlugin.IChangeableProps {
    /**
     * Defines the scroll step when using keyboard navigation (in pixels).
     * Controls the amount the scroll will move with each key press.
     * @default 40
     */
    iterator?: number;
  }

  export interface ICallbacksTypes extends NPlugin.ICallbacksTypes {}
}
