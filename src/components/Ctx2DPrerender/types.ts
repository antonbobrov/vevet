import { BaseProp, PosRule } from 'get-image-pos';
import { NCtx2D } from '../Ctx2D/types';
import { Ctx2D } from '../Ctx2D';

export namespace NCtx2DPrerender {
  export interface IStaticProps extends NCtx2D.IStaticProps {
    /** Media element */
    media: Ctx2D | BaseProp['source'];
  }

  export interface IChangeableProps extends NCtx2D.IChangeableProps {
    /** Position rule */
    posRule?: PosRule;
  }

  export interface ICallbacksTypes extends NCtx2D.ICallbacksTypes {
    prerender: undefined;
  }
}
