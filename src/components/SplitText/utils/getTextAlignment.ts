export function getTextAlignment(node: HTMLElement) {
  const { direction, textAlign } = getComputedStyle(node);

  if (textAlign === 'center') {
    return textAlign;
  }

  if (textAlign === 'justify') {
    return direction === 'rtl' ? 'right' : 'left';
  }

  if (textAlign === 'left' || textAlign === 'right') {
    return textAlign;
  }

  if (textAlign === 'start') {
    return direction === 'rtl' ? 'right' : 'left';
  }

  if (textAlign === 'end') {
    return direction === 'rtl' ? 'left' : 'right';
  }

  return direction === 'rtl' ? 'right' : 'left';
}
