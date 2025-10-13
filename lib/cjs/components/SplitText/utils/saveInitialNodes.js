"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveInitialNodes = saveInitialNodes;
function saveInitialNodes(root) {
    var flatArray = [];
    function copy(node) {
        // Add the current node and its parent to the array
        flatArray.push({
            node: node,
            cssText: node instanceof HTMLElement ? node.style.cssText : null,
            parent: node.parentNode,
        });
        // Recursively process child nodes
        node.childNodes.forEach(function (child) { return copy(child); });
    }
    // Start recursion with the root node
    root.childNodes.forEach(function (child) { return copy(child); });
    // Return a function to restore the initial nodes
    return {
        restore: function () {
            var fragment = document.createDocumentFragment();
            flatArray.forEach(function (element) {
                var node = element.node, cssText = element.cssText;
                if (node instanceof HTMLElement && cssText) {
                    node.style.cssText = cssText;
                }
                while (node.childNodes[0]) {
                    node.childNodes[0].remove();
                }
                if (element.parent) {
                    var parent_1 = element.parent === root ? fragment : element.parent;
                    parent_1.appendChild(element.node);
                }
            });
            while (root.childNodes[0]) {
                root.childNodes[0].remove();
            }
            root.appendChild(fragment);
        },
    };
}
//# sourceMappingURL=saveInitialNodes.js.map