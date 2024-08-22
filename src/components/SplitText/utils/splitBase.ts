/* eslint-disable no-param-reassign */
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

/** Split text into letters & words */
export function splitBase({
  container,
  letterClassName,
  wordClassName,
  hasLetters,
  letterTag,
  wordTag,
}: IProps) {
  const helper = container.cloneNode(true) as HTMLElement;

  const words = wrapWords({
    container: helper,
    classname: wordClassName,
    tagName: wordTag,
  });

  const letters: NSplitText.ILetter[] = [];

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
