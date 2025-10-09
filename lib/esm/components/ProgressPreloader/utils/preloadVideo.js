export function preloadVideo(resource, onLoad) {
    if (resource.readyState > 0) {
        onLoad();
        return;
    }
    if (resource.preload === 'none') {
        onLoad();
        return;
    }
    resource.addEventListener('error', () => onLoad());
    resource.addEventListener('loadedmetadata', () => onLoad());
}
//# sourceMappingURL=preloadVideo.js.map