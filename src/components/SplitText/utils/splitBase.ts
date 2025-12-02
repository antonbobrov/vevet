import { ISplitTextLetterMeta, ISplitTextStaticProps } from '../types';
import { wrapLetters } from './wrapLetters';
import { wrapWords } from './wrapWords';

type TBaseProps = Pick<
  ISplitTextStaticProps,
  'ignore' | 'prepareText' | 'wordDelimiter' | 'wordDelimiterOutput'
>;

interface IProps extends TBaseProps {
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
  ignore,
  ...props
}: IProps) {
  // Prepare the fragment
  const prepareFragment = document.createDocumentFragment();
  while (container.childNodes[0]) {
    prepareFragment.appendChild(container.childNodes[0]);
  }

  // Wrap the text into words
  const wordsMeta = wrapWords({
    ...props,
    container: prepareFragment as any,
    classname: wordClassName,
    tagName: wordTag,
    ignore,
  });

  const lettersMeta: ISplitTextLetterMeta[] = [];

  // If enabled, wrap words into letters
  if (hasLetters) {
    const wrappedLetters = wrapLetters({
      wordsMeta,
      classname: letterClassName,
      tagName: letterTag,
      ignore,
    });

    lettersMeta.push(...wrappedLetters.lettersMeta);
  }

  // Append the prepared fragment
  container.appendChild(prepareFragment);

  return { wordsMeta, lettersMeta };
}
