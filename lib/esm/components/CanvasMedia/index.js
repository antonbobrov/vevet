import { getPos } from 'get-image-pos';
import { Canvas } from '../Canvas';
import { addEventListener } from '../../utils';
export * from './types';
/**
 * The `CanvasMedia` class allows pre-rendering of media (such as images or video) onto a canvas.
 * This can be useful for reducing payloads by preparing the media for further use in a more optimized form.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/CanvasMedia)
 *
 * @group Components
 */
export class CanvasMedia extends Canvas {
    /** Get default static properties */
    _getStatic() {
        return Object.assign(Object.assign({}, super._getStatic()), { autoRenderVideo: true });
    }
    /** Get default mutable properties */
    _getMutable() {
        return Object.assign(Object.assign({}, super._getMutable()), { rule: 'cover' });
    }
    constructor(props) {
        super(props);
        this._setMediaEvents();
    }
    /** Checks if the media element has the `requestVideoFrameCallback` method */
    get hasRequestVideoFrameCallback() {
        return 'requestVideoFrameCallback' in this.props.media;
    }
    /** Add media events */
    _setMediaEvents() {
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
    resize() {
        super.resize();
        this.render();
    }
    /** Auto rendering for videos */
    _requestVideoFrame() {
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
    render() {
        super.render((props) => this._prerender(props));
    }
    /**
     * Prerenders the media onto the canvas using the specified positioning rule.
     */
    _prerender({ width, height, ctx }) {
        const { media, rule } = this.props;
        // Determine the media source and its dimensions
        let source;
        let sourceWidth;
        let sourceHeight;
        if (media instanceof Canvas) {
            source = media.canvas;
            sourceWidth = media.width;
            sourceHeight = media.height;
        }
        else {
            source = media;
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
//# sourceMappingURL=index.js.map