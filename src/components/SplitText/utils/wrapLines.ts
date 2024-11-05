/* eslint-disable no-param-reassign */
import { childOf } from '@/utils/dom/childOf';
import { NSplitText } from '../types';

interface IProps {
  container: HTMLElement;
  words: NSplitText.IWord[];
  className: string;
  tagName: keyof HTMLElementTagNameMap;
}

interface ILine extends NSplitText.ILine {
  nodes: Node[];
}

/**
 * Recursively retrieves the top parent element of a given element within a container.
 */
function getTopParent(ref: Element | null, topParent: Element): Element {
  if (ref?.parentElement === topParent) {
    return ref;
  }

  return getTopParent(ref?.parentElement ?? null, topParent);
}

/**
 * Wraps each word in the container into lines, based on their vertical position.
 */
export function wrapLines({ container, words, className, tagName }: IProps) {
  const lines: ILine[] = [];
  let lineIndex = -1;
  let prevTop = Infinity;

  // Create lines by wrapping words
  words.forEach((word) => {
    const currentTop = Math.round(word.element.getBoundingClientRect().top);
    const topParent = getTopParent(word.element, container);

    if (currentTop !== prevTop) {
      prevTop = currentTop;
      lineIndex += 1;

      const element = document.createElement(tagName);
      element.style.display = 'block';
      element.classList.add(className);

      lines[lineIndex] = { element, nodes: [], words: [] };
    }

    const currentLine = lines[lineIndex];

    const isInList = !!lines.find(({ nodes }) => nodes.includes(topParent));

    if (!isInList) {
      currentLine.nodes.push(topParent);

      if (topParent.nextSibling?.nodeType === 3) {
        currentLine.nodes.push(topParent.nextSibling);
      }
    }
  });

  // Append line elements to the container
  lines.forEach((line) => {
    container.insertBefore(line.element, line.nodes[0]);

    line.element.append(...line.nodes);
  });

  // Hide any extra <br> elements after lines
  const hiddenBr: HTMLBRElement[] = [];
  lines.forEach((line) => {
    const nextSibling = line.element.nextElementSibling;
    if (nextSibling instanceof HTMLBRElement) {
      nextSibling.style.display = 'none';
      hiddenBr.push(nextSibling);
    }
  });

  // Associate words with the corresponding lines
  lines.forEach((line) => {
    line.words.push(
      ...words.filter((word) => childOf(word.element, line.element)),
    );
  });

  // Destroy method to undo the line wrapping
  const destroy = () => {
    hiddenBr.forEach((br) => {
      br.style.display = '';
    });

    lines.forEach((line) => {
      line.nodes.forEach((node) => {
        container.insertBefore(node, line.element);
      });

      line.element.remove();
    });
  };

  return { lines, destroy };
}
