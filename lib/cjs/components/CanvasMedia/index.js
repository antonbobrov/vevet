"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasMedia = void 0;
var get_image_pos_1 = require("get-image-pos");
var Canvas_1 = require("../Canvas");
var utils_1 = require("../../utils");
__exportStar(require("./types"), exports);
/**
 * The `CanvasMedia` class allows pre-rendering of media (such as images or video) onto a canvas.
 * This can be useful for reducing payloads by preparing the media for further use in a more optimized form.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/CanvasMedia)
 *
 * @group Components
 */
var CanvasMedia = /** @class */ (function (_super) {
    __extends(CanvasMedia, _super);
    function CanvasMedia(props) {
        var _this = _super.call(this, props) || this;
        _this._setMediaEvents();
        return _this;
    }
    /** Get default static properties */
    CanvasMedia.prototype._getStatic = function () {
        return __assign(__assign({}, _super.prototype._getStatic.call(this)), { autoRenderVideo: true });
    };
    /** Get default mutable properties */
    CanvasMedia.prototype._getMutable = function () {
        return __assign(__assign({}, _super.prototype._getMutable.call(this)), { rule: 'cover' });
    };
    Object.defineProperty(CanvasMedia.prototype, "hasRequestVideoFrameCallback", {
        /** Checks if the media element has the `requestVideoFrameCallback` method */
        get: function () {
            return 'requestVideoFrameCallback' in this.props.media;
        },
        enumerable: false,
        configurable: true
    });
    /** Add media events */
    CanvasMedia.prototype._setMediaEvents = function () {
        var _this = this;
        var _a = this.props, hasVideoAutoRender = _a.autoRenderVideo, media = _a.media;
        if (!hasVideoAutoRender || !(media instanceof HTMLVideoElement)) {
            return;
        }
        // use requestVideoFrameCallback
        if (this.hasRequestVideoFrameCallback) {
            this._requestVideoFrame();
            return;
        }
        // use timeupdate listener
        var timeupdate = (0, utils_1.addEventListener)(media, 'timeupdate', function () {
            _this.render();
        });
        this.onDestroy(function () { return timeupdate(); });
    };
    /** Resize the canvas */
    CanvasMedia.prototype.resize = function () {
        _super.prototype.resize.call(this);
        this.render();
    };
    /** Auto rendering for videos */
    CanvasMedia.prototype._requestVideoFrame = function () {
        var _this = this;
        if (this.isDestroyed) {
            return;
        }
        this.render();
        var media = this.props.media;
        if (media instanceof HTMLVideoElement) {
            media.requestVideoFrameCallback(function () { return _this._requestVideoFrame(); });
        }
    };
    /** Pre-renders the media resource onto the canvas. */
    CanvasMedia.prototype.render = function () {
        var _this = this;
        _super.prototype.render.call(this, function (props) { return _this._prerender(props); });
    };
    /**
     * Prerenders the media onto the canvas using the specified positioning rule.
     */
    CanvasMedia.prototype._prerender = function (_a) {
        var width = _a.width, height = _a.height, ctx = _a.ctx;
        var _b = this.props, media = _b.media, rule = _b.rule;
        // Determine the media source and its dimensions
        var source;
        var sourceWidth;
        var sourceHeight;
        if (media instanceof Canvas_1.Canvas) {
            source = media.canvas;
            sourceWidth = media.width;
            sourceHeight = media.height;
        }
        else {
            source = media;
        }
        // Calculate media position and size based on the posRule
        var size = (0, get_image_pos_1.getPos)({
            source: source,
            sourceWidth: sourceWidth,
            sourceHeight: sourceHeight,
            rule: rule,
            scale: 1,
            width: width,
            height: height,
        });
        // Clear the canvas and draw the media with the calculated size
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(source, size.x, size.y, size.width, size.height);
        // Trigger prerender callback
        this.callbacks.emit('render', undefined);
    };
    return CanvasMedia;
}(Canvas_1.Canvas));
exports.CanvasMedia = CanvasMedia;
//# sourceMappingURL=index.js.map