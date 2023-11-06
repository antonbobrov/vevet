export function preloadVideo(
  video: HTMLVideoElement,
  action: (isSuccess: boolean) => void,
) {
  if (video.readyState > 0) {
    action(true);

    return;
  }

  if (video.preload === 'none') {
    action(false);

    return;
  }

  video.addEventListener('error', () => action(false));
  video.addEventListener('loadedmetadata', () => action(true));
}
