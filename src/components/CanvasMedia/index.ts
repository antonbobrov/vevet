import { getPos } from 'get-image-pos';

import { TModuleOnCallbacksProps } from '@/base';
import { noopIfDestroyed } from '@/internal/noopIfDestroyed';
import { TRequiredProps } from '@/internal/requiredProps';
import { addEventListener } from '@/utils';

import { Canvas, ICanvasRenderArg } from '../Canvas';

import { MUTABLE_PROPS, STATIC_PROPS } from './props';
import {
  ICanvasMediaCallbacksMap,
  ICanvasMediaMutableProps,
  ICanvasMediaStaticProps,
} from './types';

export * from './types';

type TC = ICanvasMediaCallbacksMap;
type TS = ICanvasMediaStaticProps;
type TM = ICanvasMediaMutableProps;

/**
 * The `CanvasMedia` class allows pre-rendering of media (such as images or video) onto a canvas.
 * This can be useful for reducing payloads by preparing the media for further use in a more optimized form.
 *
 * [Documentation](https://vevetjs.com/docs/CanvasMedia)
 *
 * @group Components
 */
export class CanvasMedia extends Canvas<TC, TS, TM> {
  /** Get default static properties */
  public _getStatic(): TRequiredProps<TS> {
    return { ...super._getStatic(), ...STATIC_PROPS };
  }

  /** Get default mutable properties */
  public _getMutable(): TRequiredProps<TM> {
    return { ...super._getMutable(), ...MUTABLE_PROPS };
  }

  constructor(
    props?: TS & TM,
    onCallbacks?: TModuleOnCallbacksProps<TC, CanvasMedia>,
  ) {
    super(props, onCallbacks as any);

    this._setMediaEvents();
  }

  /** Checks if the media element has the `requestVideoFrameCallback` method */
  private get hasRequestVideoFrameCallback() {
    return 'requestVideoFrameCallback' in this.props.media;
  }

  /** Add media events */
  private _setMediaEvents() {
    const { autoRenderVideo: hasVideoAutoRender, media } = this.props;

    if (!hasVideoAutoRender || !(media instanceof HTMLVideoElement)) {
      return;
    }

    // use requestVideoFrameCallback
    if (this.hasRequestVideoFrameCallback) {
      this._requestVideoFrame();

      return;
    }

    // use timeupdate listener
    const timeupdate = addEventListener(media, 'timeupdate', () => {
      this.render();
    });

    this.onDestroy(() => timeupdate());
  }

  /** Resize the canvas */
  @noopIfDestroyed
  public resize() {
    super.resize();

    this.render();
  }

  /** Auto rendering for videos */
  private _requestVideoFrame() {
    if (this.isDestroyed) {
      return;
    }

    this.render();

    const { media } = this.props;

    if (media instanceof HTMLVideoElement) {
      media.requestVideoFrameCallback(() => this._requestVideoFrame());
    }
  }

  /** Pre-renders the media resource onto the canvas. */
  @noopIfDestroyed
  public render() {
    super.render((props) => this._prerender(props));
  }

  /**
   * Prerenders the media onto the canvas using the specified positioning rule.
   */
  private _prerender({ width, height, ctx }: ICanvasRenderArg) {
    const { media, rule } = this.props;

    // Determine the media source and its dimensions
    let source: Exclude<ICanvasMediaStaticProps['media'], Canvas>;
    let sourceWidth: number | undefined;
    let sourceHeight: number | undefined;

    if (media instanceof Canvas) {
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
      rule,
      scale: 1,
      width,
      height,
    });

    // Clear the canvas and draw the media with the calculated size
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(source, size.x, size.y, size.width, size.height);

    // Trigger prerender callback
    this.callbacks.emit('render', undefined);
  }
}
