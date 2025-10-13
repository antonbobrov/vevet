"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preloadVideo = preloadVideo;
function preloadVideo(resource, onLoad) {
    if (resource.readyState > 0) {
        onLoad();
        return;
    }
    if (resource.preload === 'none') {
        onLoad();
        return;
    }
    resource.addEventListener('error', function () { return onLoad(); });
    resource.addEventListener('loadedmetadata', function () { return onLoad(); });
}
//# sourceMappingURL=preloadVideo.js.map