interface IProps {
  container: HTMLElement;
  isVertical: boolean;
  isRtl: boolean;
}

/** Apply the minimal inline styles required for marquee layout. */
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

/** Remove inline styles previously applied by `appleMarqueeContainerStyles`. */
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
