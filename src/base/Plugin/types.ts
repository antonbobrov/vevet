import { NModule } from '../Module/types';

export namespace NPlugin {
  export interface IStaticProps extends NModule.IStaticProps {}

  export interface IChangeableProps extends NModule.IChangeableProps {}

  export interface ICallbacksTypes extends NModule.ICallbacksTypes {}
}
