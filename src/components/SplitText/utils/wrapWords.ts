import { NSplitText } from '../types';

/* eslint-disable no-param-reassign */
interface IProps {
  container: ChildNode;
  classname: string;
}

/** Wrap each word inside the container */
export function wrapWords({ container, classname }: IProps) {
  const whitespace = String.fromCharCode(32);

  const words: NSplitText.IWord[] = [];

  function recursive(node: ChildNode) {
    if (node instanceof HTMLElement) {
      if (node.tagName !== 'BR') {
        node.style.display = 'inline-block';
      }

      const children = [...Array.from(node.childNodes)];
      children.forEach((child) => recursive(child));

      return;
    }

    if (node.nodeType === 3) {
      const nodeParent = node.parentElement;
      const text = node.nodeValue ?? '';
      const splitWords = text.split(whitespace);

      if (text === whitespace) {
        nodeParent?.insertBefore(document.createTextNode(whitespace), node);
        node.remove();

        return;
      }

      splitWords.forEach((splitWord, index) => {
        if (splitWord) {
          const element = document.createElement('span');
          element.style.display = 'inline-block';
          element.classList.add(classname);
          element.appendChild(document.createTextNode(splitWord));

          words.push({ element, text: splitWord, letters: [] });

          nodeParent?.insertBefore(element, node);
        }

        if (index < splitWords.length - 1) {
          nodeParent?.insertBefore(document.createTextNode(whitespace), node);
        }
      });

      node.remove();
    }
  }

  recursive(container);

  return words;
}
