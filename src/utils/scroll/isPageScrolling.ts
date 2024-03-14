let isScrolling = false;

if (typeof window !== 'undefined') {
  let timeout: NodeJS.Timeout | null = null;

  window.addEventListener('scroll', () => {
    if (timeout) {
      clearTimeout(timeout);
    }

    isScrolling = true;

    timeout = setTimeout(() => {
      isScrolling = false;
    }, 150);
  });
}

export function isPageScrolling() {
  return isScrolling;
}
