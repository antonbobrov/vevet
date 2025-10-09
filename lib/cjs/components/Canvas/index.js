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
exports.Canvas = void 0;
var onResize_1 = require("../../utils/listeners/onResize");
var Module_1 = require("../../base/Module");
var initVevet_1 = require("../../global/initVevet");
__exportStar(require("./types"), exports);
/**
 * A class for managing an HTML5 Canvas element and its 2D context.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/Canvas)
 *
 * @group Components
 */
var Canvas = /** @class */ (function (_super) {
    __extends(Canvas, _super);
    /**
     * Constructor for the Ctx2D class.
     */
    function Canvas(props) {
        var _this = _super.call(this, props) || this;
        var _a = _this.props, shouldAppend = _a.append, container = _a.container, hasResizeOnInit = _a.resizeOnInit, hasRuntimeResize = _a.resizeOnRuntime, viewportTarget = _a.viewportTarget, resizeDebounce = _a.resizeDebounce;
        // Set default values
        _this._width = 0;
        _this._height = 0;
        _this._dpr = 1;
        // Create canvas element
        _this._canvas = document.createElement('canvas');
        // Add canvas styles
        var style = _this._canvas.style;
        style.position = 'absolute';
        style.top = '0';
        style.left = '0';
        style.width = '100%';
        style.height = '100%';
        // Append canvas to container if required
        if (shouldAppend && container instanceof HTMLElement) {
            container.append(_this._canvas);
            _this.onDestroy(function () { return _this.canvas.remove(); });
        }
        // Create 2D context
        _this._ctx = _this._canvas.getContext('2d');
        // Set resize events
        if (hasResizeOnInit) {
            _this.resize();
        }
        if (hasRuntimeResize) {
            var resizeHandler_1 = (0, onResize_1.onResize)({
                callback: function () { return _this.resize(); },
                element: _this.props.container,
                viewportTarget: viewportTarget,
                resizeDebounce: resizeDebounce,
                name: _this.name,
            });
            _this.onDestroy(function () { return resizeHandler_1.remove(); });
        }
        return _this;
    }
    /** Get default static properties */
    Canvas.prototype._getStatic = function () {
        return __assign(__assign({}, _super.prototype._getStatic.call(this)), { container: null, append: true, resizeOnInit: true, resizeOnRuntime: false, viewportTarget: 'any', resizeDebounce: 0 });
    };
    /** Get default mutable properties */
    Canvas.prototype._getMutable = function () {
        return __assign(__assign({}, _super.prototype._getMutable.call(this)), { width: 'auto', height: 'auto', dpr: 'auto' });
    };
    Object.defineProperty(Canvas.prototype, "canvas", {
        /** The canvas element instance. */
        get: function () {
            return this._canvas;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "ctx", {
        /** Returns the 2D rendering context */
        get: function () {
            return this._ctx;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "width", {
        /** Canvas width (DPR applied). */
        get: function () {
            return this._width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "offsetWidth", {
        /** Width without DPR scaling. */
        get: function () {
            return this.width / this.dpr;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "height", {
        /** Canvas height (DPR applied). */
        get: function () {
            return this._height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "offsetHeight", {
        /** Height without DPR scaling. */
        get: function () {
            return this.height / this.dpr;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "dpr", {
        /** Current device pixel ratio. */
        get: function () {
            return this._dpr;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "canRender", {
        /** Checks if the canvas is ready to render. */
        get: function () {
            return this.width > 0 && this.height > 0;
        },
        enumerable: false,
        configurable: true
    });
    /** Handle property mutations */
    Canvas.prototype._handleProps = function () {
        _super.prototype._handleProps.call(this);
        this.resize();
    };
    /** Triggers a canvas resize based on container or viewport dimensions. */
    Canvas.prototype.resize = function () {
        var core = (0, initVevet_1.initVevet)();
        var _a = this, props = _a.props, canvas = _a.canvas;
        var container = this.props.container;
        // Calculate DPR
        this._dpr = typeof props.dpr === 'number' ? props.dpr : core.dpr;
        // Calculate new width and height
        var newWidth = 0;
        var newHeight = 0;
        if (props.width === 'auto') {
            newWidth = (container === null || container === void 0 ? void 0 : container.offsetWidth) || core.width;
        }
        else {
            newWidth = props.width;
        }
        if (props.height === 'auto') {
            newHeight = (container === null || container === void 0 ? void 0 : container.offsetHeight) || core.height;
        }
        else {
            newHeight = props.height;
        }
        // Apply DPR
        newWidth *= this._dpr;
        newHeight *= this._dpr;
        // Update canvas size
        this._width = newWidth;
        this._height = newHeight;
        canvas.width = newWidth;
        canvas.height = newHeight;
        // Callbacks
        this.callbacks.emit('resize', undefined);
    };
    /**
     * Renders content on the canvas if it's ready.
     *
     * @param render - A function that performs the actual rendering on the canvas.
     */
    Canvas.prototype.render = function (render) {
        if (!this.canRender) {
            return;
        }
        render({
            ctx: this.ctx,
            width: this.width,
            height: this.height,
            dpr: this.dpr,
            offsetWidth: this.offsetWidth,
            offsetHeight: this.offsetHeight,
            canvas: this.canvas,
        });
    };
    return Canvas;
}(Module_1.Module));
exports.Canvas = Canvas;
//# sourceMappingURL=index.js.map