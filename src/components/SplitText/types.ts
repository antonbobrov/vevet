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
