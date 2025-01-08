export function preloadImage(resource: HTMLImageElement, onLoad: () => void) {
  if (resource.complete) {
    onLoad();

    return;
  }

  const image = new Image();

  image.addEventListener('load', () => onLoad());
  image.addEventListener('error', () => onLoad());

  image.crossOrigin = 'anonymous';
  image.src = resource.currentSrc || resource.src;
}
