import { Canvas } from '../Canvas';
import {
  ICanvasCallbacksMap,
  ICanvasMutableProps,
  ICanvasStaticProps,
} from '../Canvas/types';

/**
 * Static properties for the CanvasMedia class.
 */
export interface ICanvasMediaStaticProps extends ICanvasStaticProps {
  /**
   * The media element to be rendered.
   * Accepts a Canvas instance or common media elements like images and videos.
   */
  media:
    | Canvas
    | HTMLImageElement
    | SVGImageElement
    | HTMLVideoElement
    | HTMLCanvasElement;

  /**
   * If `true`, video elements will automatically render on each frame update.
   * @default true
   */
  autoRenderVideo?: boolean;
}

/**
 * How media is positioned within the canvas.
 */
export type TCanvasMediaRule =
  | 'cover'
  | 'contain'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'center';

/**
 * Extended mutable properties for the CanvasMedia class.
 */
export interface ICanvasMediaMutableProps extends ICanvasMutableProps {
  /**
   * Defines how the media element is positioned within the canvas.
   * @default 'cover'
   */
  rule?: TCanvasMediaRule;
}
/**
 * Extended callbacks map for the CanvasMedia class.
 */
export interface ICanvasMediaCallbacksMap extends ICanvasCallbacksMap<ICanvasMediaMutableProps> {
  /**
   * Fires after the media element has been rendered onto the canvas.
   */
  render: undefined;
}
