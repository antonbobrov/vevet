import { NSplitText } from '../types';
import { wrapLetters } from './wrapLetters';
import { wrapWords } from './wrapWords';

interface IProps {
  container: HTMLElement;
  letterClassName: string;
  wordClassName: string;
  hasLetters: boolean;
  letterTag: keyof HTMLElementTagNameMap;
  wordTag: keyof HTMLElementTagNameMap;
}

/**
 * Splits text in the container into words and optionally into letters.
 */
export function splitBase({
  container,
  letterClassName,
  wordClassName,
  hasLetters,
  letterTag,
  wordTag,
}: IProps) {
  // Clone the container to manipulate the DOM without affecting the original
  const helper = container.cloneNode(true) as HTMLElement;

  // Wrap the text into words
  const words = wrapWords({
    container: helper,
    classname: wordClassName,
    tagName: wordTag,
  });

  const letters: NSplitText.ILetter[] = [];

  // If enabled, wrap words into letters
  if (hasLetters) {
    const wrappedLetters = wrapLetters({
      words,
      classname: letterClassName,
      tagName: letterTag,
    });

    letters.push(...wrappedLetters.letters);
  }

  return {
    helper,
    words,
    letters,
  };
}
