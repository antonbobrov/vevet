export function prependStyles(style: HTMLStyleElement) {
  const firstStyles = document.querySelector('link[rel="stylesheet"], style');

  if (firstStyles) {
    firstStyles.parentNode?.insertBefore(style, firstStyles);
  } else {
    document.head.appendChild(style);
  }
}
