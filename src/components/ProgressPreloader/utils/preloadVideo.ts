export function preloadVideo(resource: HTMLVideoElement, onLoad: () => void) {
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
