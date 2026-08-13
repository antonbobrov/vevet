export function getTransforms(element: Element) {
  const computed = getComputedStyle(element).transform;
  const matrix =
    computed === 'none' ? new DOMMatrix() : new DOMMatrix(computed);

  const translateX = matrix.e;
  const translateY = matrix.f;

  return { translateX, translateY };
}
