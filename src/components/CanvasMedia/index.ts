import { getPos } from 'get-image-pos';

import { TModuleProps } from '@/base';
import { isHTMLVideo } from '@/internal/isHTMLVideo';
import { noopIfDestroyed } from '@/internal/noopIfDestroyed';
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
  public _getStatic() {
    return { ...super._getStatic(), ...STATIC_PROPS };
  }

  public _getMutable() {
    return { ...super._getMutable(), ...MUTABLE_PROPS };
  }

  constructor(props?: TModuleProps<TC, TS, TM, CanvasMedia>) {
    super(props as any);

    this._setMediaEvents();
  }

  /** Checks if the media element has the `requestVideoFrameCallback` method */
  private get hasRequestVideoFrameCallback() {
    return 'requestVideoFrameCallback' in this.props.media;
  }

  /** Add media events */
  private _setMediaEvents() {
    const { autoRenderVideo: hasVideoAutoRender, media } = this.props;

    if (!hasVideoAutoRender || !isHTMLVideo(media)) {
      return;
    }

    // use requestVideoFrameCallback
    if (this.hasRequestVideoFrameCallback) {
      this._videoFrame();

      return;
    }

    // use timeupdate listener
    const timeupdate = addEventListener(media, 'timeupdate', () =>
      this.render(),
    );

    this.onDestroy(() => timeupdate());
  }

  /** Resize the canvas */
  @noopIfDestroyed
  public resize() {
    super.resize();

    this.render();
  }

  /** Auto rendering for videos */
  @noopIfDestroyed
  private _videoFrame() {
    this.render();

    const { media } = this.props;

    if (media instanceof HTMLVideoElement) {
      media.requestVideoFrameCallback(() => this._videoFrame());
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

    const size = getPos({
      source,
      sourceWidth,
      sourceHeight,
      rule,
      scale: 1,
      width,
      height,
    });

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(source, size.x, size.y, size.width, size.height);

    // Trigger prerender callback
    this.callbacks.emit('render', undefined);
  }
}
