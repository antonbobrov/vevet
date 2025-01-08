import { ISplitTextLineMeta, ISplitTextWordMeta } from '../types';

interface IProps {
  container: HTMLElement;
  hasLinesWrapper: boolean;
  wordsMeta: ISplitTextWordMeta[];
  lineClassName: string;
  lineWrapperClassName: string;
  tagName: keyof HTMLElementTagNameMap;
}

interface ILine extends ISplitTextLineMeta {
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

export function childOf(element: Element, parent: Element) {
  if (element === parent) {
    return true;
  }

  if (element !== null) {
    return childOf(element.parentNode as Element, parent);
  }

  return false;
}

/**
 * Wraps each word in the container into lines, based on their vertical position.
 */
export function wrapLines({
  container,
  hasLinesWrapper,
  wordsMeta,
  lineClassName,
  lineWrapperClassName,
  tagName,
}: IProps) {
  const linesMeta: ILine[] = [];
  let lineIndex = -1;
  let prevTop = Infinity;

  // Create lines by wrapping words
  wordsMeta.forEach((wordMeta) => {
    const currentTop = Math.round(wordMeta.element.offsetTop);
    const topParent = getTopParent(wordMeta.element, container);

    // create new line if the top position changes
    if (currentTop !== prevTop) {
      prevTop = currentTop;
      lineIndex += 1;

      const element = document.createElement(tagName);
      element.style.display = 'block';
      element.classList.add(lineClassName);

      let wrapper: HTMLElement | undefined;

      if (hasLinesWrapper) {
        wrapper = document.createElement(tagName);
        wrapper.style.display = 'block';
        wrapper.classList.add(lineWrapperClassName);
        wrapper.appendChild(element);
      }

      linesMeta[lineIndex] = { element, wrapper, nodes: [], words: [] };
    }

    const currentLine = linesMeta[lineIndex];

    const isInList = !!linesMeta.find(({ nodes }) => nodes.includes(topParent));

    if (!isInList) {
      currentLine.nodes.push(topParent);

      if (topParent.nextSibling?.nodeType === 3) {
        currentLine.nodes.push(topParent.nextSibling);
      }
    }
  });

  // Append line elements to the container
  linesMeta.forEach((line) => {
    container.insertBefore(line.wrapper ?? line.element, line.nodes[0]);

    const fragment = document.createDocumentFragment();
    fragment.append(...line.nodes);
    line.element.append(fragment);
  });

  // Hide any extra <br> elements after lines
  const hiddenBr: HTMLBRElement[] = [];
  linesMeta.forEach((line) => {
    const nextSibling = (line.wrapper ?? line.element).nextElementSibling;
    if (nextSibling instanceof HTMLBRElement) {
      nextSibling.style.display = 'none';
      hiddenBr.push(nextSibling);
    }
  });

  // Associate words with the corresponding lines
  linesMeta.forEach((line) => {
    line.words.push(
      ...wordsMeta.filter((word) => childOf(word.element, line.element)),
    );
  });

  // Destroy method to undo the line wrapping
  const destroy = () => {
    let isSuccess = true;

    hiddenBr.forEach((br) => {
      // eslint-disable-next-line no-param-reassign
      br.style.display = '';
    });

    linesMeta.forEach((line) => {
      line.nodes.forEach((node) => {
        const reference = line.wrapper ?? line.element;

        if (reference.parentElement) {
          container.insertBefore(node, reference);
        } else {
          isSuccess = false;
        }
      });

      line.element.remove();
      line.wrapper?.remove();
    });

    return isSuccess;
  };

  return { linesMeta, destroy };
}
