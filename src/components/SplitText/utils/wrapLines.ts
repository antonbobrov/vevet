/* eslint-disable no-param-reassign */
import { childOf } from 'vevet-dom';
import { NSplitText } from '../types';

interface IProps {
  container: HTMLElement;
  words: NSplitText.IWord[];
  className: string;
}

interface ILine extends NSplitText.ILine {
  nodes: Node[];
}

function getTopParent(ref: Element | null, topParent: Element): Element {
  if (ref?.parentElement === topParent) {
    return ref;
  }

  return getTopParent(ref?.parentElement ?? null, topParent);
}

/** Wrap each word inside the container */
export function wrapLines({ container, words, className }: IProps) {
  const lines: ILine[] = [];
  let lineIndex = -1;
  let prevTop = Infinity;

  // create lines
  words.forEach((word) => {
    const currentTop = Math.round(word.element.getBoundingClientRect().top);
    const topParent = getTopParent(word.element, container);

    if (currentTop !== prevTop) {
      prevTop = currentTop;
      lineIndex += 1;

      const element = document.createElement('span');
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

  // append lines
  lines.forEach((line) => {
    container.insertBefore(line.element, line.nodes[0]);

    line.element.append(...line.nodes);
  });

  // hide extra br
  const hiddenBr: HTMLBRElement[] = [];
  lines.forEach((line) => {
    const nextSibling = line.element.nextElementSibling;
    if (nextSibling instanceof HTMLBRElement) {
      nextSibling.style.display = 'none';
      hiddenBr.push(nextSibling);
    }
  });

  // add words
  lines.forEach((line) => {
    line.words.push(
      ...words.filter((word) => childOf(word.element, line.element)),
    );
  });

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
