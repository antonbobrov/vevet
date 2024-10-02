import { NComponent } from '@/base/Component/types';
import { TOnResizeTarget } from '@/utils/listeners/onResize';

export namespace NSplitText {
  export interface IStaticProps extends NComponent.IStaticProps {
    /**
     * The text container where the content will be split.
     * Can be a CSS selector (string) or an actual HTML element.
     */
    container: string | Element;

    /**
     * Specifies whether the text should be split into individual letters.
     * @default true
     */
    hasLetters?: boolean;

    /**
     * Specifies whether the text should be split into lines.
     * @default false
     */
    hasLines?: boolean;

    /**
     * HTML tag to wrap each letter.
     * @default `span`
     */
    letterTag?: keyof HTMLElementTagNameMap;

    /**
     * HTML tag to wrap each word.
     * @default `span`
     */
    wordTag?: keyof HTMLElementTagNameMap;

    /**
     * HTML tag to wrap each line.
     * @default `span`
     */
    lineTag?: keyof HTMLElementTagNameMap;

    /**
     * Determines the viewport target for resizing behavior.
     * @default 'any'
     */
    viewportTarget?: TOnResizeTarget;

    /**
     * Debounce timeout for the resize event in milliseconds.
     * @default 0
     */
    resizeDebounce?: number;
  }

  export interface IChangeableProps extends NComponent.IChangeableProps {}

  export interface ICallbacksTypes extends NComponent.ICallbacksTypes {
    /**
     * Fired before the text is split.
     */
    beforeSplit: undefined;

    /**
     * Fired after the text has been split.
     */
    split: undefined;
  }

  export interface ILine {
    /**
     * HTML element representing a single line of split text.
     */
    element: HTMLElement;

    /**
     * Array of word objects within the line.
     */
    words: NSplitText.IWord[];
  }

  export interface IWord {
    /**
     * HTML element representing a single word.
     */
    element: HTMLElement;

    /**
     * The text content of the word.
     */
    text: string;

    /**
     * Array of letter objects within the word.
     */
    letters: NSplitText.ILetter[];
  }

  export interface ILetter {
    /**
     * HTML element representing a single letter.
     */
    element: HTMLElement;

    /**
     * The text content of the letter.
     */
    text: string;
  }
}
