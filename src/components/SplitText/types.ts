import { NComponent } from '@/base/Component/types';
import { TOnResizeTarget } from '@/utils/listeners/onResize';

export namespace NSplitText {
  export interface IStaticProps extends NComponent.IStaticProps {
    /**
     * The text container. You may use a CSS selector or the element itself
     */
    container: string | Element;
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
     * Letter tagName
     * @default `span`
     */
    letterTag?: keyof HTMLElementTagNameMap;
    /**
     * Word tagName
     * @default `span`
     */
    wordTag?: keyof HTMLElementTagNameMap;
    /**
     * Line tagName
     * @default `span`
     */
    lineTag?: keyof HTMLElementTagNameMap;
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
    beforeSplit: undefined;
    split: undefined;
  }

  export interface ILine {
    element: HTMLElement;
    words: NSplitText.IWord[];
  }

  export interface IWord {
    element: HTMLElement;
    text: string;
    letters: NSplitText.ILetter[];
  }

  export interface ILetter {
    element: HTMLElement;
    text: string;
  }
}
