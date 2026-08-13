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

export function getScope(
  element: HTMLElement,
  suffix: string,
  defaultValue: number[],
) {
  const attrValue = getAttr(element, suffix);
  const stringValue = attrValue.toLowerCase();

  if (stringValue === 'none') {
    return [-Infinity, Infinity];
  }

  if (stringValue === 'const') {
    return [1, 1];
  }

  const cleanValue = attrValue.replace(/[\s\\[\]]+/g, '');
  const minMax = cleanValue.split(',');
  const minRaw = parseFloat(minMax[0]);
  const maxRaw = parseFloat(minMax[1]);

  const min = Number.isNaN(minRaw) ? defaultValue[0] : minRaw;
  const max = Number.isNaN(maxRaw) ? defaultValue[1] : maxRaw;

  return [min, max];
}
