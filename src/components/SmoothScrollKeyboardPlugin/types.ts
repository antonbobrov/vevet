import { NPlugin } from '@/base/Plugin/types';

export namespace NSmoothScrollKeyboardPlugin {
  export interface IStaticProps extends NPlugin.IStaticProps {}

  export interface IChangeableProps extends NPlugin.IChangeableProps {
    /** @default 40 */
    iterator?: number;
  }

  export interface ICallbacksTypes extends NPlugin.ICallbacksTypes {}
}
