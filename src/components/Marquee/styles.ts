interface IProps {
  container: HTMLElement;
  isVertical: boolean;
  isRtl: boolean;
}

export function appleMarqueeContainerStyles({
  container,
  isVertical,
  isRtl,
}: IProps) {
  const { style } = container;

  style.position = 'relative';
  style.display = 'flex';
  style.flexDirection = isVertical ? 'column' : 'row';
  style.alignItems = 'center';
  style.justifyContent = isRtl ? 'flex-end' : 'flex-start';
  style.overflow = 'hidden';
  if (isVertical) {
    style.height = '100%';
  } else {
    style.width = '100%';
  }
}

export function removeMarqueeContainerStyles(container: HTMLElement) {
  const { style } = container;

  style.position = '';
  style.display = '';
  style.flexDirection = '';
  style.alignItems = '';
  style.justifyContent = '';
  style.overflow = '';
  style.height = '';
  style.width = '';
}
