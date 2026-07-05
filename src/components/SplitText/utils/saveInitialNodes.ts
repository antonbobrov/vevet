import { doc } from '@/internal';

interface IClone {
  node: Node;
  cssText: string | null;
  parent?: Node | null;
}

/**
 * Deep-clones the container subtree and returns a restore function.
 *
 * Used by {@link SplitText.destroy} to put back the original DOM.
 */
export function saveInitialNodes(root: Node) {
  const flatArray: IClone[] = [];

  function copy(node: Node): void {
    flatArray.push({
      node,
      cssText: node instanceof HTMLElement ? node.style.cssText : null,
      parent: node.parentNode,
    });

    node.childNodes.forEach((child) => copy(child));
  }

  root.childNodes.forEach((child) => copy(child));

  return {
    restore: () => {
      const fragment = doc.createDocumentFragment();

      flatArray.forEach((element) => {
        const { node, cssText } = element;

        if (node instanceof HTMLElement && cssText) {
          node.style.cssText = cssText;
        }

        while (node.childNodes[0]) {
          node.childNodes[0].remove();
        }

        if (element.parent) {
          const parent = element.parent === root ? fragment : element.parent;
          parent.appendChild(element.node);
        }
      });

      while (root.childNodes[0]) {
        root.childNodes[0].remove();
      }

      root.appendChild(fragment);
    },
  };
}
