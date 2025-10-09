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
exports.ProgressPreloader = void 0;
var Timeline_1 = require("../Timeline");
var math_1 = require("../../utils/math");
var preloadImage_1 = require("./utils/preloadImage");
var preloadVideo_1 = require("./utils/preloadVideo");
var preloadCustomElement_1 = require("./utils/preloadCustomElement");
var Preloader_1 = require("../Preloader");
var Raf_1 = require("../Raf");
var initVevet_1 = require("../../global/initVevet");
__exportStar(require("./types"), exports);
var PAGE_RESOURCE = "vevet-page-".concat(Math.random());
/**
 * Page preloader for calculating and displaying the loading progress of resources (images, videos, custom elements).
 * Provides smooth progress transitions.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/ProgressPreloader)
 *
 * @group Components
 */
var ProgressPreloader = /** @class */ (function (_super) {
    __extends(ProgressPreloader, _super);
    function ProgressPreloader(props) {
        var _this = _super.call(this, props) || this;
        /**
         * List of custom resources to preload based on selectors.
         */
        _this._resources = [
            { id: PAGE_RESOURCE, weight: 1, loaded: 0 },
        ];
        /**
         * Current interpolated progress value for smooth transitions.
         */
        _this._progress = 0;
        // Initialize animation frame if interpolation is enabled
        _this._raf = new Raf_1.Raf();
        _this._raf.on('frame', function (_a) {
            var lerpFactor = _a.lerpFactor;
            _this._handleUpdate((0, math_1.lerp)(_this._progress, _this.loadProgress, lerpFactor(_this.props.lerp)));
        });
        _this._raf.play();
        // Start preloading resources
        _this._fetchImages();
        _this._fetchVideos();
        _this._fetchResources();
        // Handle resources on page load
        (0, initVevet_1.initVevet)().onLoad(function () { return _this.resolveResource(PAGE_RESOURCE); });
        return _this;
    }
    /**
     * Retrieves the default static properties.
     */
    ProgressPreloader.prototype._getStatic = function () {
        return __assign(__assign({}, _super.prototype._getStatic.call(this)), { preloadImages: true, preloadVideos: false, customSelector: '.js-preload', ignoreClassName: 'js-preload-ignore', lerp: 0.1, endDuration: 500 });
    };
    /**
     * Retrieves the default mutable properties.
     */
    ProgressPreloader.prototype._getMutable = function () {
        return __assign({}, _super.prototype._getMutable.call(this));
    };
    Object.defineProperty(ProgressPreloader.prototype, "resources", {
        /**
         * The list of custom resources to preload.
         */
        get: function () {
            return this._resources;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ProgressPreloader.prototype, "totalWeight", {
        /**
         * Calculates the total number of resources to preload, including their weight.
         */
        get: function () {
            return this.resources.reduce(function (acc, _a) {
                var weight = _a.weight;
                return acc + weight;
            }, 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ProgressPreloader.prototype, "loadedWeight", {
        /**
         * Loaded weight
         */
        get: function () {
            return this.resources.reduce(function (acc, _a) {
                var loaded = _a.loaded;
                return acc + loaded;
            }, 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ProgressPreloader.prototype, "loadProgress", {
        /**
         * Current loading progress (0 to 1).
         */
        get: function () {
            return this.loadedWeight / this.totalWeight;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ProgressPreloader.prototype, "progress", {
        /**
         * Gets the current progress value.
         */
        get: function () {
            return this._progress;
        },
        enumerable: false,
        configurable: true
    });
    /** Preload images */
    ProgressPreloader.prototype._fetchImages = function () {
        var _a;
        var _this = this;
        if (!this.props.preloadImages) {
            return;
        }
        var list = Array.from(document.querySelectorAll('img'));
        list = list.filter(function (resource) {
            var isIgnored = resource.classList.contains(_this.props.ignoreClassName);
            return !isIgnored && resource.loading !== 'lazy';
        });
        (_a = this._resources).push.apply(_a, list.map(function (resource) { return ({
            id: resource,
            weight: 1,
            loaded: 0,
        }); }));
        list.forEach(function (element) {
            (0, preloadImage_1.preloadImage)(element, function () { return _this.resolveResource(element); });
        });
    };
    /** Preload videos */
    ProgressPreloader.prototype._fetchVideos = function () {
        var _a;
        var _this = this;
        if (!this.props.preloadVideos) {
            return;
        }
        var list = Array.from(document.querySelectorAll('video'));
        list = list.filter(function (resource) { return !resource.classList.contains(_this.props.ignoreClassName); });
        (_a = this._resources).push.apply(_a, list.map(function (resource) { return ({
            id: resource,
            weight: 1,
            loaded: 0,
        }); }));
        list.forEach(function (element) {
            (0, preloadVideo_1.preloadVideo)(element, function () { return _this.resolveResource(element); });
        });
    };
    /** Preload custom resources */
    ProgressPreloader.prototype._fetchResources = function () {
        var _this = this;
        var list = Array.from(document.querySelectorAll(this.props.customSelector));
        list = list.filter(function (resource) { return !resource.classList.contains(_this.props.ignoreClassName); });
        list.forEach(function (element) {
            var weight = parseInt(element.getAttribute('data-weight') || '1', 10);
            weight = Number.isNaN(weight) ? 1 : (0, math_1.clamp)(weight, 1, Infinity);
            var resource = {
                id: element,
                weight: weight,
                loaded: 0,
            };
            _this._resources.push(resource);
            (0, preloadCustomElement_1.preloadCustomElement)(resource, function (loadedWeight) {
                return _this.resolveResource(element, loadedWeight);
            });
        });
    };
    /**
     * Adds a custom resource
     * @param id - The custom resource element or identifier to preload.
     * @param weight - The resource weight
     */
    ProgressPreloader.prototype.addResource = function (id, weight) {
        if (weight === void 0) { weight = 1; }
        if (this.isDestroyed) {
            return;
        }
        var hasResource = this.resources.some(function (item) { return item.id === id; });
        if (hasResource) {
            throw new Error('Resource already exists');
        }
        this._resources.push({ id: id, weight: weight, loaded: 0 });
    };
    /**
     * Emits a resource load event and updates the count of loaded resources.
     * @param id - The resource element or identifier being loaded.
     */
    ProgressPreloader.prototype.resolveResource = function (id, loadedWeight) {
        if (this.isDestroyed) {
            return;
        }
        var resource = this.resources.find(function (item) { return item.id === id; });
        if (!resource) {
            return;
        }
        var targetWeight = loadedWeight !== null && loadedWeight !== void 0 ? loadedWeight : resource.weight;
        resource.loaded = (0, math_1.clamp)(targetWeight, 0, resource.weight);
        this.callbacks.emit('resource', resource);
    };
    /**
     * Handles updates to the preloader's progress, triggering events and animations as needed.
     * @param newProgress - The updated progress value.
     */
    ProgressPreloader.prototype._handleUpdate = function (newProgress) {
        var _this = this;
        var _a;
        this._progress = newProgress;
        this.callbacks.emit('progress', undefined);
        if (this.loadProgress < 1) {
            return;
        }
        (_a = this._raf) === null || _a === void 0 ? void 0 : _a.destroy();
        var startProgress = this.progress;
        if (startProgress >= 1) {
            return;
        }
        var endTimeline = new Timeline_1.Timeline({ duration: this.props.endDuration });
        this.onDestroy(function () { return endTimeline.destroy(); });
        endTimeline.on('update', function (_a) {
            var progress = _a.progress;
            var diff = 1 - startProgress;
            _this._progress = startProgress + diff * progress;
            _this.callbacks.emit('progress', undefined);
        });
        endTimeline.play();
    };
    /**
     * Resolves when the page and all resources are fully loaded.
     */
    ProgressPreloader.prototype._onLoaded = function (callback) {
        var _this = this;
        var isFinish = false;
        this.callbacks.on('progress', (function () {
            if (_this.progress >= 1 && !isFinish) {
                isFinish = true;
                callback();
            }
        }), { protected: true, name: this.name });
    };
    /**
     * Cleans up resources and destroys the preloader instance.
     */
    ProgressPreloader.prototype._destroy = function () {
        _super.prototype._destroy.call(this);
        this._raf.destroy();
    };
    return ProgressPreloader;
}(Preloader_1.Preloader));
exports.ProgressPreloader = ProgressPreloader;
//# sourceMappingURL=index.js.map