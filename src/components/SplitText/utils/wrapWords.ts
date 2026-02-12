import { cnAdd } from '@/internal/cn';
import { doc } from '@/internal/env';

import { ISplitTextStaticProps, ISplitTextWordMeta } from '../types';

import { isIgnored } from './isIgnored';

type TBaseProps = Pick<
  ISplitTextStaticProps,
  'ignore' | 'prepareText' | 'wordDelimiter' | 'wordDelimiterOutput'
>;

interface IProps extends TBaseProps {
  container: ChildNode;
  classname: string;
  tagName: keyof HTMLElementTagNameMap;
}

/**
 * Wraps each word inside the container in an HTML element with the specified tag and class.
 */
export function wrapWords({
  container,
  classname,
  tagName,
  ignore,
  prepareText,
  wordDelimiter = ' ',
  wordDelimiterOutput: wordDelimiterOutputProp,
}: IProps) {
  const wordDelimiterOutput = wordDelimiterOutputProp || wordDelimiter;

  const baseElement = doc.createElement(tagName);
  baseElement.style.display = 'inline-block';
  baseElement.setAttribute('aria-hidden', 'true');
  cnAdd(baseElement, classname);

  const wordsMeta: ISplitTextWordMeta[] = [];
  let prevNonBreakingWord: HTMLElement | null = null;

  /**
   * Recursively processes each child node within the container to wrap words.
   */
  function recursive(node: ChildNode) {
    // If the node is an element, process its children
    if (node instanceof HTMLElement || node instanceof DocumentFragment) {
      if ('tagName' in node && node.tagName !== 'BR') {
        if (isIgnored(node, ignore)) {
          if (prevNonBreakingWord) {
            prevNonBreakingWord.append(node);
          } else {
            wordsMeta.push({ element: node, letters: [] });
          }

          return;
        }

        node.style.display = 'inline-block';
      }

      prevNonBreakingWord = null;

      const children = [...Array.from(node.childNodes)];
      children.forEach((child) => recursive(child));

      return;
    }

    // If the node is a text node, split it into words
    if (node.nodeType === 3) {
      const parent = node.parentElement ?? container;
      let text = node.nodeValue ?? '';

      // Handle case where node contains only whitespace
      if (text === wordDelimiter) {
        prevNonBreakingWord = null;
        parent?.insertBefore(doc.createTextNode(wordDelimiterOutput), node);
        node.remove();

        return;
      }

      // Wrap each word in an element and insert it into the DOM
      text = prepareText ? prepareText(text) : text;
      const splitWords = text.split(wordDelimiter);

      splitWords.forEach((wordContents, index) => {
        if (wordContents) {
          const element = baseElement.cloneNode(false) as HTMLElement;
          element.appendChild(doc.createTextNode(wordContents));
          prevNonBreakingWord = element;

          wordsMeta.push({ element, letters: [] });

          parent?.insertBefore(element, node);
        }

        // Add a whitespace between words, except after the last word
        if (index < splitWords.length - 1) {
          parent?.insertBefore(doc.createTextNode(wordDelimiterOutput), node);
        }
      });

      node.remove();
    }
  }

  // Begin processing the container
  recursive(container);

  return wordsMeta;
}
