import { BaseProp, getPos } from 'get-image-pos';
import { Ctx2D, NCtx2D } from '../Ctx2D';
import { NCtx2DPrerender } from './types';

export type { NCtx2DPrerender } from './types';

/**
 * The `Ctx2DPrerender` class allows pre-rendering of media (such as images or video) onto a canvas.
 * This can be useful for reducing payloads by preparing the media for further use in a more optimized form.
 *
 * @link See examples https://antonbobrov.github.io/vevet-demo/ctx2d-prerender/
 *
 * @link See docs https://antonbobrov.github.io/vevet/classes/Ctx2DPrerender.html
 */
export class Ctx2DPrerender<
  StaticProps extends
    NCtx2DPrerender.IStaticProps = NCtx2DPrerender.IStaticProps,
  ChangeableProps extends
    NCtx2DPrerender.IChangeableProps = NCtx2DPrerender.IChangeableProps,
  CallbacksTypes extends
    NCtx2DPrerender.ICallbacksTypes = NCtx2DPrerender.ICallbacksTypes,
> extends Ctx2D<StaticProps, ChangeableProps, CallbacksTypes> {
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      media: false,
      posRule: 'cover',
    };
  }

  /**
   * Handles the canvas resize event and triggers the prerender process.
   * This method is called when the canvas size changes and recalculates the
   * rendering dimensions.
   */
  protected _handleResize() {
    super._handleResize();

    // Trigger rendering after resize
    this.render((props) => this._prerender(props));
  }

  /**
   * Prerenders the media onto the canvas using the specified positioning rule.
   * Clears the canvas, calculates the position and dimensions for the media,
   * and then draws it on the canvas.
   */
  protected _prerender({ width, height, ctx }: NCtx2D.IRenderProps) {
    const { media, posRule } = this.props;

    // Determine the media source and its dimensions
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

    // Calculate media position and size based on the posRule
    const size = getPos({
      source,
      sourceWidth,
      sourceHeight,
      rule: posRule,
      scale: 1,
      width,
      height,
    });

    // Clear the canvas and draw the media with the calculated size
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(source, size.x, size.y, size.width, size.height);

    // Trigger prerender callback
    this.callbacks.tbt('prerender', undefined);
  }
}
