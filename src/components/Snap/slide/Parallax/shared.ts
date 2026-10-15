import { PARALLAX_TYPES } from './constants';

const PARALLAX_ATTRIBUTES = PARALLAX_TYPES.map(({ attr }) => attr);

export function getParallaxElements(container: Element | null) {
  if (!container) {
    return [];
  }

  const selector = PARALLAX_ATTRIBUTES.map((attr) => `[${attr}]`).join(',');
  const nodeList = container.querySelectorAll(selector);

  return Array.from(nodeList) as HTMLElement[];
}
