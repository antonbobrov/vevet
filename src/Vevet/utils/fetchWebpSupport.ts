import { PCancelable } from '@/utils/common/PCancelable';

export function fetchWebpSupport() {
  return new PCancelable((resolve, reject) => {
    const testWebP = new Image();

    testWebP.onload = () => {
      if (testWebP.width === 1) {
        resolve();
      } else {
        reject();
      }
    };

    testWebP.onerror = reject;

    testWebP.src =
      'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
  });
}
