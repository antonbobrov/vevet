import { BaseProp, getPos } from 'get-image-pos';
import { Ctx2D, NCtx2D } from '../Ctx2D';
import { NCtx2DPrerender } from './types';

export type { NCtx2DPrerender } from './types';

/**
 * The class allows you to prerender media for further use with reduced payloads.
 */
export class Ctx2DPrerender<
  StaticProps extends NCtx2DPrerender.IStaticProps = NCtx2DPrerender.IStaticProps,
  ChangeableProps extends NCtx2DPrerender.IChangeableProps = NCtx2DPrerender.IChangeableProps,
  CallbacksTypes extends NCtx2DPrerender.ICallbacksTypes = NCtx2DPrerender.ICallbacksTypes
> extends Ctx2D<StaticProps, ChangeableProps, CallbacksTypes> {
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      media: false,
      posRule: 'cover',
    };
  }

  /** Method called on resize */
  protected _handleResize() {
    super._handleResize();

    this.render((props) => this._prerender(props));
  }

  /** Prerender the scene */
  protected _prerender({ width, height, ctx }: NCtx2D.IRenderProps) {
    const { media, posRule } = this.props;

    // get source info
    let source: BaseProp['source'];
    let sourceWidth: number | undefined;
    let sourceHeight: number | undefined;
    if (media instanceof Ctx2D) {
      source = media.canvas;
      sourceWidth = media.width;
      sourceHeight = media.height;
    } else {
      source = media as any;
    }

    // get media sizes
    const size = getPos({
      source,
      sourceWidth,
      sourceHeight,
      rule: posRule,
      scale: 1,
      width,
      height,
    });

    // render media
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(source, size.x, size.y, size.width, size.height);

    // launch callbacks on prerender
    this.callbacks.tbt('prerender', undefined);
  }
}
