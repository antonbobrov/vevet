import { NModule } from '../Module/types';

export namespace NComponent {
  /** Static properties */
  export interface IStaticProps extends NModule.IStaticProps {}

  /** Changeable Properties */
  export interface IChangeableProps extends NModule.IChangeableProps {}

  /** Available callbacks */
  export interface ICallbacksTypes extends NModule.ICallbacksTypes {}
}
