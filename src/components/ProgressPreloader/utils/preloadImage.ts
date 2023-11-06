export function preloadImage(
  imageProp: HTMLImageElement,
  action: (isSuccess: boolean) => void,
) {
  if (imageProp.complete) {
    action(true);

    return;
  }

  const image = new Image();

  image.addEventListener('load', () => action(true));
  image.addEventListener('error', () => action(false));

  image.crossOrigin = 'anonymous';
  image.src = imageProp.currentSrc || imageProp.src;
}
