"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preloadImage = preloadImage;
function preloadImage(resource, onLoad) {
    if (resource.complete) {
        onLoad();
        return;
    }
    var image = new Image();
    image.addEventListener('load', function () { return onLoad(); });
    image.addEventListener('error', function () { return onLoad(); });
    image.crossOrigin = 'anonymous';
    image.src = resource.currentSrc || resource.src;
}
//# sourceMappingURL=preloadImage.js.map