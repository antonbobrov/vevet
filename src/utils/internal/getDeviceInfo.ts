import { detect } from 'detect-browser';
import isMobileJs from 'ismobilejs';

export function getDeviceInfo() {
  const browserData = detect();

  const osName = (browserData?.os || '')?.split(' ')[0].toLowerCase();
  const browserName = (browserData?.name || '').toLowerCase();

  const device = isMobileJs();

  return {
    osName,
    browserName,
    device,
  };
}
