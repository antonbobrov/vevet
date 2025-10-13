/**
 * Recursively retrieves the top parent element of a given element within a container.
 */
function getTopParent(ref, topParent) {
    var _a;
    if (!(ref === null || ref === void 0 ? void 0 : ref.parentElement)) {
        return null;
    }
    if (ref.parentElement === topParent) {
        return ref;
    }
    return getTopParent((_a = ref === null || ref === void 0 ? void 0 : ref.parentElement) !== null && _a !== void 0 ? _a : null, topParent);
}
export function childOf(element, parent) {
    if (element === parent) {
        return true;
    }
    if (element !== null) {
        return childOf(element.parentNode, parent);
    }
    return false;
}
/**
 * Wraps each word in the container into lines, based on their vertical position.
 */
export function wrapLines({ container, hasLinesWrapper, wordsMeta, lineClassName, lineWrapperClassName, tagName, }) {
    const { direction } = getComputedStyle(container);
    const linesMeta = [];
    let lineIndex = -1;
    let lastBounding = null;
    const baseElement = document.createElement(tagName);
    baseElement.style.display = 'block';
    baseElement.setAttribute('aria-hidden', 'true');
    baseElement.classList.add(lineClassName);
    const boundings = wordsMeta.map((wordMeta) => wordMeta.element.getBoundingClientRect());
    // Create lines by wrapping words
    wordsMeta.forEach((wordMeta, index) => {
        var _a;
        const bounds = boundings[index];
        const topParent = getTopParent(wordMeta.element, container);
        if (!topParent) {
            return;
        }
        // create new line if the top position changes
        if (!lastBounding ||
            (bounds.top >= lastBounding.top &&
                bounds.left <= lastBounding.left &&
                direction === 'ltr') ||
            (bounds.top >= lastBounding.top &&
                bounds.left >= lastBounding.left &&
                direction === 'rtl')) {
            lineIndex += 1;
            const element = baseElement.cloneNode(false);
            let wrapper;
            if (hasLinesWrapper) {
                wrapper = document.createElement(tagName);
                wrapper.style.display = 'block';
                wrapper.classList.add(lineWrapperClassName);
                wrapper.appendChild(element);
            }
            linesMeta[lineIndex] = { element, wrapper, nodes: [], words: [] };
        }
        lastBounding = bounds;
        const currentLine = linesMeta[lineIndex];
        const isInList = !!linesMeta.find(({ nodes }) => nodes.includes(topParent));
        if (!isInList) {
            currentLine.nodes.push(topParent);
            if (((_a = topParent.nextSibling) === null || _a === void 0 ? void 0 : _a.nodeType) === 3) {
                currentLine.nodes.push(topParent.nextSibling);
            }
        }
    });
    // Append line elements to the container
    linesMeta.forEach((line) => {
        var _a;
        container.insertBefore((_a = line.wrapper) !== null && _a !== void 0 ? _a : line.element, line.nodes[0]);
        const fragment = document.createDocumentFragment();
        fragment.append(...line.nodes);
        line.element.append(fragment);
    });
    // Hide any extra <br> elements after lines
    const hiddenBr = [];
    linesMeta.forEach((line) => {
        var _a;
        const nextSibling = ((_a = line.wrapper) !== null && _a !== void 0 ? _a : line.element).nextElementSibling;
        if (nextSibling instanceof HTMLBRElement) {
            nextSibling.style.display = 'none';
            hiddenBr.push(nextSibling);
        }
    });
    // Associate words with the corresponding lines
    linesMeta.forEach((line) => {
        line.words.push(...wordsMeta.filter((word) => childOf(word.element, line.element)));
    });
    // Destroy method to undo the line wrapping
    const destroy = () => {
        let isSuccess = true;
        hiddenBr.forEach((br) => {
            // eslint-disable-next-line no-param-reassign
            br.style.display = '';
        });
        linesMeta.forEach((line) => {
            var _a;
            line.nodes.forEach((node) => {
                var _a;
                const reference = (_a = line.wrapper) !== null && _a !== void 0 ? _a : line.element;
                if (reference.parentElement) {
                    container.insertBefore(node, reference);
                }
                else {
                    isSuccess = false;
                }
            });
            line.element.remove();
            (_a = line.wrapper) === null || _a === void 0 ? void 0 : _a.remove();
        });
        return isSuccess;
    };
    return { linesMeta, destroy };
}
//# sourceMappingURL=wrapLines.js.map