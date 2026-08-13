export function applyCanvasStyles(canvas: HTMLCanvasElement) {
  const { style } = canvas;

  style.position = 'absolute';
  style.top = '0';
  style.left = '0';
  style.width = '100%';
  style.height = '100%';
}
