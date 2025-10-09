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
exports.SplitText = void 0;
var onResize_1 = require("../../utils/listeners/onResize");
var splitBase_1 = require("./utils/splitBase");
var wrapLines_1 = require("./utils/wrapLines");
var base_1 = require("../../base");
var initVevet_1 = require("../../global/initVevet");
var saveInitialNodes_1 = require("./utils/saveInitialNodes");
__exportStar(require("./types"), exports);
/**
 * `SplitText` splits text within a container into individual lines, words, and letters.
 *
 * Features:
 * - Supports resizing, HTML content, and special symbols like emojis.
 * - Handles multi-line breaks and non-breaking spaces.
 * - Saves initial nodes for easy restoration.
 * - Allows splitting into lines, words, or letters as needed.
 *
 * **Note**: Apply `fontKerning: none` to prevent layout shifts.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/SplitText)
 *
 * @group Components
 */
var SplitText = /** @class */ (function (_super) {
    __extends(SplitText, _super);
    /**
     * Initializes the SplitText instance and saves the initial state.
     */
    function SplitText(props) {
        var _this = _super.call(this, props) || this;
        /**
         * Tracks whether the text is already split into base elements: words and letters.
         */
        _this._isBaseSplit = false;
        /**
         * List of letters metadata.
         */
        _this._lettersMeta = [];
        /**
         * List of words metadata.
         */
        _this._wordsMeta = [];
        /**
         * List of lines metadata.
         */
        _this._linesMeta = [];
        var container = _this.props.container;
        container.style.fontKerning = 'none';
        container.setAttribute('aria-label', container.textContent || '');
        _this._addTempClassName(container, _this._cn(''));
        container.translate = false;
        _this._savedNodes = (0, saveInitialNodes_1.saveInitialNodes)(container);
        _this._setup();
        return _this;
    }
    /**
     * Retrieves the default static properties.
     */
    SplitText.prototype._getStatic = function () {
        return __assign(__assign({}, _super.prototype._getStatic.call(this)), { letters: false, lines: false, linesWrapper: false, letterTag: 'span', wordTag: 'span', lineTag: 'span', letterClass: this._cn('__letter'), wordClass: this._cn('__word'), lineClass: this._cn('__line'), lineWrapperClass: this._cn('__line-wrapper'), resizeDebounce: 0, ignore: null });
    };
    /**
     * Retrieves the default mutable properties.
     */
    SplitText.prototype._getMutable = function () {
        return __assign({}, _super.prototype._getMutable.call(this));
    };
    Object.defineProperty(SplitText.prototype, "prefix", {
        /**
         * Classname prefix for styling elements.
         */
        get: function () {
            return "".concat((0, initVevet_1.initVevet)().prefix, "split-text");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SplitText.prototype, "lettersMeta", {
        /**
         * Retrieves an array of letters metadata.
         */
        get: function () {
            return this._lettersMeta;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SplitText.prototype, "letters", {
        /**
         * Retrieves an array of letter elements.
         */
        get: function () {
            return this._lettersMeta.map(function (letter) { return letter.element; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SplitText.prototype, "wordsMeta", {
        /**
         * Retrieves an array of words metadata.
         */
        get: function () {
            return this._wordsMeta;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SplitText.prototype, "words", {
        /**
         * Retrieves an array of word elements.
         */
        get: function () {
            return this._wordsMeta.map(function (word) { return word.element; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SplitText.prototype, "linesMeta", {
        /**
         * Retrieves an array of lines metadata.
         */
        get: function () {
            return this._linesMeta;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SplitText.prototype, "lines", {
        /**
         * Retrieves an array of line elements.
         */
        get: function () {
            return this._linesMeta.map(function (line) { return line.element; });
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Sets up event listeners and handles initial splitting.
     */
    SplitText.prototype._setup = function () {
        var _this = this;
        var _a = this.props, container = _a.container, resizeDebounce = _a.resizeDebounce;
        if (!this.props.lines) {
            this.split();
            return;
        }
        var resizeHandler = (0, onResize_1.onResize)({
            callback: function () { return _this.split(); },
            element: container,
            viewportTarget: 'width',
            resizeDebounce: resizeDebounce,
            name: this.name,
        });
        resizeHandler.resize();
        this.onDestroy(function () { return resizeHandler.remove(); });
    };
    /**
     * Splits the text into letters, words, and optionally lines based on configuration.
     */
    SplitText.prototype.split = function () {
        this.callbacks.emit('beforeSplit', undefined);
        this._splitBase();
        if (this.props.lines) {
            this._splitLines();
        }
        this.callbacks.emit('split', undefined);
    };
    /**
     * Splits text into base elements: letters and words.
     */
    SplitText.prototype._splitBase = function () {
        if (this._isBaseSplit) {
            return;
        }
        var _a = this.props, container = _a.container, letterTag = _a.letterTag, wordTag = _a.wordTag, wordClass = _a.wordClass, letterClass = _a.letterClass, ignore = _a.ignore;
        this._isBaseSplit = true;
        var _b = (0, splitBase_1.splitBase)({
            container: container,
            letterClassName: letterClass,
            wordClassName: wordClass,
            hasLetters: this.props.letters,
            letterTag: letterTag,
            wordTag: wordTag,
            ignore: ignore,
        }), wordsMeta = _b.wordsMeta, lettersMeta = _b.lettersMeta;
        this._wordsMeta = wordsMeta;
        this._lettersMeta = lettersMeta;
    };
    /**
     * Wraps words into line containers.
     */
    SplitText.prototype._splitLines = function () {
        var _a;
        var wordsMeta = this.wordsMeta;
        var _b = this.props, container = _b.container, lineTag = _b.lineTag, lineClass = _b.lineClass, lineWrapperClass = _b.lineWrapperClass;
        var isHidden = container.offsetParent === null;
        if (isHidden) {
            return;
        }
        (_a = this._lineSplitWrapper) === null || _a === void 0 ? void 0 : _a.destroy();
        this._lineSplitWrapper = (0, wrapLines_1.wrapLines)({
            container: container,
            hasLinesWrapper: this.props.linesWrapper,
            wordsMeta: wordsMeta,
            lineClassName: lineClass,
            lineWrapperClassName: lineWrapperClass,
            tagName: lineTag,
        });
        this._linesMeta = this._lineSplitWrapper.linesMeta;
    };
    /**
     * Destroys the component.
     * This method does not restore the initial nodes. For this purpose, use `restore()`.
     */
    SplitText.prototype._destroy = function () {
        _super.prototype._destroy.call(this);
        if (!this._lineSplitWrapper) {
            this._savedNodes.restore();
        }
        else {
            var isSuccessfulDestroy = this._lineSplitWrapper.destroy();
            this._lineSplitWrapper = undefined;
            if (isSuccessfulDestroy) {
                this._savedNodes.restore();
            }
        }
    };
    return SplitText;
}(base_1.Module));
exports.SplitText = SplitText;
//# sourceMappingURL=index.js.map