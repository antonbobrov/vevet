"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.childOf = childOf;
exports.wrapLines = wrapLines;
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
function childOf(element, parent) {
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
function wrapLines(_a) {
    var container = _a.container, hasLinesWrapper = _a.hasLinesWrapper, wordsMeta = _a.wordsMeta, lineClassName = _a.lineClassName, lineWrapperClassName = _a.lineWrapperClassName, tagName = _a.tagName;
    var direction = getComputedStyle(container).direction;
    var linesMeta = [];
    var lineIndex = -1;
    var lastBounding = null;
    var baseElement = document.createElement(tagName);
    baseElement.style.display = 'block';
    baseElement.setAttribute('aria-hidden', 'true');
    baseElement.classList.add(lineClassName);
    var boundings = wordsMeta.map(function (wordMeta) {
        return wordMeta.element.getBoundingClientRect();
    });
    // Create lines by wrapping words
    wordsMeta.forEach(function (wordMeta, index) {
        var _a;
        var bounds = boundings[index];
        var topParent = getTopParent(wordMeta.element, container);
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
            var element = baseElement.cloneNode(false);
            var wrapper = void 0;
            if (hasLinesWrapper) {
                wrapper = document.createElement(tagName);
                wrapper.style.display = 'block';
                wrapper.classList.add(lineWrapperClassName);
                wrapper.appendChild(element);
            }
            linesMeta[lineIndex] = { element: element, wrapper: wrapper, nodes: [], words: [] };
        }
        lastBounding = bounds;
        var currentLine = linesMeta[lineIndex];
        var isInList = !!linesMeta.find(function (_a) {
            var nodes = _a.nodes;
            return nodes.includes(topParent);
        });
        if (!isInList) {
            currentLine.nodes.push(topParent);
            if (((_a = topParent.nextSibling) === null || _a === void 0 ? void 0 : _a.nodeType) === 3) {
                currentLine.nodes.push(topParent.nextSibling);
            }
        }
    });
    // Append line elements to the container
    linesMeta.forEach(function (line) {
        var _a;
        container.insertBefore((_a = line.wrapper) !== null && _a !== void 0 ? _a : line.element, line.nodes[0]);
        var fragment = document.createDocumentFragment();
        fragment.append.apply(fragment, line.nodes);
        line.element.append(fragment);
    });
    // Hide any extra <br> elements after lines
    var hiddenBr = [];
    linesMeta.forEach(function (line) {
        var _a;
        var nextSibling = ((_a = line.wrapper) !== null && _a !== void 0 ? _a : line.element).nextElementSibling;
        if (nextSibling instanceof HTMLBRElement) {
            nextSibling.style.display = 'none';
            hiddenBr.push(nextSibling);
        }
    });
    // Associate words with the corresponding lines
    linesMeta.forEach(function (line) {
        var _a;
        (_a = line.words).push.apply(_a, wordsMeta.filter(function (word) { return childOf(word.element, line.element); }));
    });
    // Destroy method to undo the line wrapping
    var destroy = function () {
        var isSuccess = true;
        hiddenBr.forEach(function (br) {
            // eslint-disable-next-line no-param-reassign
            br.style.display = '';
        });
        linesMeta.forEach(function (line) {
            var _a;
            line.nodes.forEach(function (node) {
                var _a;
                var reference = (_a = line.wrapper) !== null && _a !== void 0 ? _a : line.element;
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
    return { linesMeta: linesMeta, destroy: destroy };
}
//# sourceMappingURL=wrapLines.js.map