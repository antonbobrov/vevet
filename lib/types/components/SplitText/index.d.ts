import { wrapLines } from './utils/wrapLines';
import { ISplitTextCallbacksMap, ISplitTextLetterMeta, ISplitTextLineMeta, ISplitTextMutableProps, ISplitTextStaticProps, ISplitTextWordMeta } from './types';
import { Module } from '../../base';
import { TRequiredProps } from '../../internal/requiredProps';
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
export declare class SplitText<CallbacksMap extends ISplitTextCallbacksMap = ISplitTextCallbacksMap, StaticProps extends ISplitTextStaticProps = ISplitTextStaticProps, MutableProps extends ISplitTextMutableProps = ISplitTextMutableProps> extends Module<CallbacksMap, StaticProps, MutableProps> {
    /**
     * Retrieves the default static properties.
     */
    _getStatic(): TRequiredProps<StaticProps>;
    /**
     * Retrieves the default mutable properties.
     */
    _getMutable(): TRequiredProps<MutableProps>;
    /**
     * Classname prefix for styling elements.
     */
    get prefix(): string;
    /**
     * Saved initial HTML nodes of the container.
     */
    protected _savedNodes: ReturnType<typeof saveInitialNodes>;
    /**
     * Tracks whether the text is already split into base elements: words and letters.
     */
    protected _isBaseSplit: boolean;
    /**
     * List of letters metadata.
     */
    protected _lettersMeta: ISplitTextLetterMeta[];
    /**
     * Retrieves an array of letters metadata.
     */
    get lettersMeta(): ISplitTextLetterMeta[];
    /**
     * Retrieves an array of letter elements.
     */
    get letters(): HTMLElement[];
    /**
     * List of words metadata.
     */
    protected _wordsMeta: ISplitTextWordMeta[];
    /**
     * Retrieves an array of words metadata.
     */
    get wordsMeta(): ISplitTextWordMeta[];
    /**
     * Retrieves an array of word elements.
     */
    get words(): HTMLElement[];
    /**
     * List of lines metadata.
     */
    protected _linesMeta: ISplitTextLineMeta[];
    /**
     * Retrieves an array of lines metadata.
     */
    get linesMeta(): ISplitTextLineMeta[];
    /**
     * Retrieves an array of line elements.
     */
    get lines(): HTMLElement[];
    /**
     * Utility for wrapping words into line containers.
     */
    protected _lineSplitWrapper?: ReturnType<typeof wrapLines>;
    /**
     * Initializes the SplitText instance and saves the initial state.
     */
    constructor(props?: StaticProps & MutableProps);
    /**
     * Sets up event listeners and handles initial splitting.
     */
    protected _setup(): void;
    /**
     * Splits the text into letters, words, and optionally lines based on configuration.
     */
    split(): void;
    /**
     * Splits text into base elements: letters and words.
     */
    protected _splitBase(): void;
    /**
     * Wraps words into line containers.
     */
    protected _splitLines(): void;
    /**
     * Destroys the component.
     * This method does not restore the initial nodes. For this purpose, use `restore()`.
     */
    protected _destroy(): void;
}
//# sourceMappingURL=index.d.ts.map