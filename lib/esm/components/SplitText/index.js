import { onResize } from '../../utils/listeners/onResize';
import { splitBase } from './utils/splitBase';
import { wrapLines } from './utils/wrapLines';
import { Module } from '../../base';
import { initVevet } from '../../global/initVevet';
import { saveInitialNodes } from './utils/saveInitialNodes';
export * from './types';
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
export class SplitText extends Module {
    /**
     * Retrieves the default static properties.
     */
    _getStatic() {
        return Object.assign(Object.assign({}, super._getStatic()), { letters: false, lines: false, linesWrapper: false, letterTag: 'span', wordTag: 'span', lineTag: 'span', letterClass: this._cn('__letter'), wordClass: this._cn('__word'), lineClass: this._cn('__line'), lineWrapperClass: this._cn('__line-wrapper'), resizeDebounce: 0, ignore: null });
    }
    /**
     * Retrieves the default mutable properties.
     */
    _getMutable() {
        return Object.assign({}, super._getMutable());
    }
    /**
     * Classname prefix for styling elements.
     */
    get prefix() {
        return `${initVevet().prefix}split-text`;
    }
    /**
     * Retrieves an array of letters metadata.
     */
    get lettersMeta() {
        return this._lettersMeta;
    }
    /**
     * Retrieves an array of letter elements.
     */
    get letters() {
        return this._lettersMeta.map((letter) => letter.element);
    }
    /**
     * Retrieves an array of words metadata.
     */
    get wordsMeta() {
        return this._wordsMeta;
    }
    /**
     * Retrieves an array of word elements.
     */
    get words() {
        return this._wordsMeta.map((word) => word.element);
    }
    /**
     * Retrieves an array of lines metadata.
     */
    get linesMeta() {
        return this._linesMeta;
    }
    /**
     * Retrieves an array of line elements.
     */
    get lines() {
        return this._linesMeta.map((line) => line.element);
    }
    /**
     * Initializes the SplitText instance and saves the initial state.
     */
    constructor(props) {
        super(props);
        /**
         * Tracks whether the text is already split into base elements: words and letters.
         */
        this._isBaseSplit = false;
        /**
         * List of letters metadata.
         */
        this._lettersMeta = [];
        /**
         * List of words metadata.
         */
        this._wordsMeta = [];
        /**
         * List of lines metadata.
         */
        this._linesMeta = [];
        const { container } = this.props;
        container.style.fontKerning = 'none';
        container.setAttribute('aria-label', container.textContent || '');
        this._addTempClassName(container, this._cn(''));
        container.translate = false;
        this._savedNodes = saveInitialNodes(container);
        this._setup();
    }
    /**
     * Sets up event listeners and handles initial splitting.
     */
    _setup() {
        const { container, resizeDebounce } = this.props;
        if (!this.props.lines) {
            this.split();
            return;
        }
        const resizeHandler = onResize({
            callback: () => this.split(),
            element: container,
            viewportTarget: 'width',
            resizeDebounce,
            name: this.name,
        });
        resizeHandler.resize();
        this.onDestroy(() => resizeHandler.remove());
    }
    /**
     * Splits the text into letters, words, and optionally lines based on configuration.
     */
    split() {
        this.callbacks.emit('beforeSplit', undefined);
        this._splitBase();
        if (this.props.lines) {
            this._splitLines();
        }
        this.callbacks.emit('split', undefined);
    }
    /**
     * Splits text into base elements: letters and words.
     */
    _splitBase() {
        if (this._isBaseSplit) {
            return;
        }
        const { container, letterTag, wordTag, wordClass, letterClass, ignore } = this.props;
        this._isBaseSplit = true;
        const { wordsMeta, lettersMeta } = splitBase({
            container,
            letterClassName: letterClass,
            wordClassName: wordClass,
            hasLetters: this.props.letters,
            letterTag,
            wordTag,
            ignore,
        });
        this._wordsMeta = wordsMeta;
        this._lettersMeta = lettersMeta;
    }
    /**
     * Wraps words into line containers.
     */
    _splitLines() {
        var _a;
        const { wordsMeta } = this;
        const { container, lineTag, lineClass, lineWrapperClass } = this.props;
        const isHidden = container.offsetParent === null;
        if (isHidden) {
            return;
        }
        (_a = this._lineSplitWrapper) === null || _a === void 0 ? void 0 : _a.destroy();
        this._lineSplitWrapper = wrapLines({
            container,
            hasLinesWrapper: this.props.linesWrapper,
            wordsMeta,
            lineClassName: lineClass,
            lineWrapperClassName: lineWrapperClass,
            tagName: lineTag,
        });
        this._linesMeta = this._lineSplitWrapper.linesMeta;
    }
    /**
     * Destroys the component.
     * This method does not restore the initial nodes. For this purpose, use `restore()`.
     */
    _destroy() {
        super._destroy();
        if (!this._lineSplitWrapper) {
            this._savedNodes.restore();
        }
        else {
            const isSuccessfulDestroy = this._lineSplitWrapper.destroy();
            this._lineSplitWrapper = undefined;
            if (isSuccessfulDestroy) {
                this._savedNodes.restore();
            }
        }
    }
}
//# sourceMappingURL=index.js.map