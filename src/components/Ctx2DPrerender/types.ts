import { BaseProp, PosRule } from 'get-image-pos';
import { NCtx2D } from '../Ctx2D/types';
import { Ctx2D } from '../Ctx2D';

export namespace NCtx2DPrerender {
  export interface IStaticProps extends NCtx2D.IStaticProps {
    /**
     * The media element to be rendered.
     * It can be an instance of `Ctx2D` or a source object like an `HTMLImageElement` or `HTMLVideoElement`.
     */
    media: Ctx2D | BaseProp['source'];
  }

  export interface IChangeableProps extends NCtx2D.IChangeableProps {
    /**
     * The positioning rule for the media element.
     * This defines how the media should be positioned within the canvas.     *
     * @default 'cover'
     */
    posRule?: PosRule;
  }

  export interface ICallbacksTypes extends NCtx2D.ICallbacksTypes {
    /**
     * Callback triggered before rendering starts.
     * Use this to prepare or modify the media before it gets rendered.
     */
    prerender: undefined;
  }
}
