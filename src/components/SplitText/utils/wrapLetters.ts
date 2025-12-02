import split from 'lodash.split';
import {
  ISplitTextLetterMeta,
  ISplitTextStaticProps,
  ISplitTextWordMeta,
} from '../types';
import { isIgnored } from './isIgnored';
import { cnAdd } from '@/internal/cn';
import { doc } from '@/internal/env';

interface IProps {
  wordsMeta: ISplitTextWordMeta[];
  classname: string;
  tagName: keyof HTMLElementTagNameMap;
  ignore: ISplitTextStaticProps['ignore'];
}

/**
 * Wraps each letter in every word inside the container with the specified HTML tag and class name.
 */
export function wrapLetters({ wordsMeta, classname, tagName, ignore }: IProps) {
  const lettersMeta: ISplitTextLetterMeta[] = [];

  const baseElement = doc.createElement(tagName);
  baseElement.style.display = 'inline-block';
  cnAdd(baseElement, classname);

  // Iterate over each word to wrap its letters
  wordsMeta.forEach((wordMeta) => {
    if (isIgnored(wordMeta.element, ignore)) {
      return;
    }

    const textNode = wordMeta.element.childNodes[0];
    if (!textNode) {
      return;
    }

    const text = textNode.textContent;

    if (!text) {
      return;
    }

    // Split the word into individual letters
    const splitLetters = split(text, '');

    splitLetters.forEach((letterContents) => {
      const element = baseElement.cloneNode(false) as HTMLElement;
      element.appendChild(doc.createTextNode(letterContents));

      // Append the letter element to the word's container
      wordMeta.element.insertBefore(element, textNode);

      const letter: ISplitTextLetterMeta = { element };

      // Add the letter to the word's letters array and the global letters array
      wordMeta.letters.push(letter);
      lettersMeta.push(letter);
    });

    // Remove the original text node after wrapping the letters
    textNode.remove();
  });

  return { lettersMeta };
}
