import { doc } from '@/internal/env';

interface IClone {
  node: Node;
  cssText: string | null;
  parent?: Node | null;
}

export function saveInitialNodes(root: Node) {
  const flatArray: IClone[] = [];

  function copy(node: Node): void {
    // Add the current node and its parent to the array
    flatArray.push({
      node,
      cssText: node instanceof HTMLElement ? node.style.cssText : null,
      parent: node.parentNode,
    });

    // Recursively process child nodes
    node.childNodes.forEach((child) => copy(child));
  }

  // Start recursion with the root node
  root.childNodes.forEach((child) => copy(child));

  // Return a function to restore the initial nodes
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
