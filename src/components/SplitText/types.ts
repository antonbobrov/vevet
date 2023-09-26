import { NComponent } from '@/base/Component/types';
import { TOnResizeTarget } from '@/utils/listeners/onResize';

export namespace NSplitText {
  export type TTextSource = 'textContent' | 'innerText' | 'innerHTML';

  export interface IStaticProps extends NComponent.IStaticProps {
    /**
     * The text container. You may use a CSS selector or the element itself
     */
    container: string | Element;
    /**
     * Text content
     * @default 'innerText'
     */
    textSource?: TTextSource;
    /**
     * If need to split text into letters.
     * @default true
     */
    hasLetters?: boolean;
    /**
     * If need to split text into lines.
     * @default false
     */
    hasLines?: boolean;
    /**
     * Viewport target
     * @default 'any'
     */
    viewportTarget?: TOnResizeTarget;
    /**
     * Timeout of resize event
     * @default 0
     */
    resizeDebounce?: number;
  }

  export interface IChangeableProps extends NComponent.IChangeableProps {}

  export interface ICallbacksTypes extends NComponent.ICallbacksTypes {
    split: undefined;
  }

  export interface ILine {
    element: HTMLElement;
    textContent: string;
    words: NSplitText.IWord[];
  }

  export interface IWord {
    element: HTMLElement;
    textContent: string;
    hasNewLine: boolean;
    letters: NSplitText.ILetter[];
    br?: HTMLBRElement;
    whitespace?: Text;
  }

  export interface ILetter {
    element: HTMLElement;
    textContent: string;
    word: NSplitText.IWord;
  }
}
