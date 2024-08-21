/* eslint-disable no-param-reassign */
import { NSplitText } from '../types';
import { wrapLetters } from './wrapLetters';
import { wrapWords } from './wrapWords';

interface IProps {
  container: HTMLElement;
  letterClassName: string;
  wordClassName: string;
  hasLetters: boolean;
}

/** Split text into letters & words */
export function splitBase({
  container,
  letterClassName,
  wordClassName,
  hasLetters,
}: IProps) {
  const helper = container.cloneNode(true) as HTMLElement;

  const words = wrapWords({ container: helper, classname: wordClassName });

  const letters: NSplitText.ILetter[] = [];

  if (hasLetters) {
    const wrappedLetters = wrapLetters({ words, classname: letterClassName });
    letters.push(...wrappedLetters.letters);
  }

  return {
    helper,
    words,
    letters,
  };
}

// todo: optimize when only words
