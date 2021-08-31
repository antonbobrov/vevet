export default function intersectionObserverSupported () {
    if (
        !('IntersectionObserver' in window)
        || !('IntersectionObserverEntry' in window)
        || !('intersectionRatio' in window.IntersectionObserverEntry.prototype)
    ) {
        return false;
    }
    return true;
}
