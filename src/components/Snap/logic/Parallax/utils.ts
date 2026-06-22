const PARALLAX_ATTR_PREFIX = 'data-snap-parallax-';

export function getAttrName(suffix: string) {
  if (suffix.startsWith(PARALLAX_ATTR_PREFIX)) {
    return suffix;
  }

  return `${PARALLAX_ATTR_PREFIX}${suffix}`;
}

export function isParallaxAttr(name: string) {
  return name.startsWith(PARALLAX_ATTR_PREFIX);
}

export function getAttr(element: HTMLElement, suffix: string) {
  return (element.getAttribute(getAttrName(suffix)) ?? '').trim();
}

export function getFloatAttr(
  element: HTMLElement,
  suffix: string,
  defaultValue: number,
) {
  const attr = getAttr(element, suffix);
  const float = parseFloat(attr);

  return Number.isNaN(float) ? defaultValue : float;
}
