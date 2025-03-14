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
      const nodeParent = node.parentElement ?? container;
      const text = node.nodeValue ?? '';
      const splitWords = text.split(whitespace);

      // Handle case where node contains only whitespace
      if (text === whitespace) {
        nodeParent?.insertBefore(document.createTextNode(whitespace), node);
        node.remove();

        return;
      }

      // Wrap each word in an element and insert it into the DOM
      splitWords.forEach((wordContents, index) => {
        if (wordContents) {
          const element = document.createElement(tagName);
          element.style.display = 'inline-block';
          element.classList.add(classname);
          element.appendChild(document.createTextNode(wordContents));

          wordsMeta.push({ element, letters: [] });

          nodeParent?.insertBefore(element, node);
        }

        // Add a whitespace between words, except after the last word
        if (index < splitWords.length - 1) {
          nodeParent?.insertBefore(document.createTextNode(whitespace), node);
        }
      });

      node.remove();
    }
  }

  // Begin processing the container
  recursive(container);

  return wordsMeta;
}
