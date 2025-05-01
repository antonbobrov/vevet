import { ISplitTextWordMeta } from '../types';

interface IProps {
  container: ChildNode;
  classname: string;
  tagName: keyof HTMLElementTagNameMap;
}

/**
 * Wraps each word inside the container in an HTML element with the specified tag and class.
 */
export function wrapWords({ container, classname, tagName }: IProps) {
  const whitespace = String.fromCharCode(32); // ASCII for space

  const baseElement = document.createElement(tagName);
  baseElement.style.display = 'inline-block';
  baseElement.setAttribute('aria-hidden', 'true');
  baseElement.classList.add(classname);

  const wordsMeta: ISplitTextWordMeta[] = [];

  /**
   * Recursively processes each child node within the container to wrap words.
   */
  function recursive(node: ChildNode) {
    // If the node is an element, process its children
    if (node instanceof HTMLElement || node instanceof DocumentFragment) {
      if ('tagName' in node && node.tagName !== 'BR') {
        // eslint-disable-next-line no-param-reassign
        node.style.display = 'inline-block';
      }

      const children = [...Array.from(node.childNodes)];
      children.forEach((child) => recursive(child));

      return;
    }

    // If the node is a text node, split it into words
    if (node.nodeType === 3) {
      const parent = node.parentElement ?? container;
      const text = node.nodeValue ?? '';

      // Handle case where node contains only whitespace
      if (text === whitespace) {
        parent?.insertBefore(document.createTextNode(whitespace), node);
        node.remove();

        return;
      }

      // Wrap each word in an element and insert it into the DOM
      const splitWords = text.split(whitespace);
      splitWords.forEach((wordContents, index) => {
        if (wordContents) {
          const element = baseElement.cloneNode(false) as HTMLElement;
          element.appendChild(document.createTextNode(wordContents));

          wordsMeta.push({ element, letters: [] });

          parent?.insertBefore(element, node);
        }

        // Add a whitespace between words, except after the last word
        if (index < splitWords.length - 1) {
          parent?.insertBefore(document.createTextNode(whitespace), node);
        }
      });

      node.remove();
    }
  }

  // Begin processing the container
  recursive(container);

  return wordsMeta;
}
