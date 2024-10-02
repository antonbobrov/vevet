/**
 * Check if `IntersectionObserver` is supported
 */
export function isIntersectionObserverSupported() {
  if (
    !('IntersectionObserver' in window) ||
    !('IntersectionObserverEntry' in window) ||
    !('intersectionRatio' in window.IntersectionObserverEntry.prototype)
  ) {
    return false;
  }

  return true;
}
