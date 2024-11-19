import version from '../version';
import { createOnPageLoad } from './events/createOnPageLoad';
import { IVevetProps } from './types';
import { fetchWebpSupport } from './utils/fetchWebpSupport';
import { PCancelable } from '@/utils/common/PCancelable';
import { createViewport } from './events/createViewport';
import { IVevet } from './global';
import { getDeviceInfo } from './utils/getDeviceInfo';

export function Vevet(input: Partial<IVevetProps>): IVevet {
  // set default properties

  const defaultProps: IVevetProps = {
    tablet: 1199,
    phone: 899,
    easing: [0.25, 0.1, 0.25, 1],
    resizeDebounce: 16,
    checkWebpSupport: true,
  };

  const props = { ...defaultProps, ...input };

  const prefix = 'v-';

  // device info

  const { osName, browserName, device } = getDeviceInfo();
  const isPhone = device.phone;
  const isTablet = device.tablet;
  const isMobile = device.phone || device.tablet;
  const isDesktop = !isMobile;

  // events

  const pageLoad = createOnPageLoad(prefix);
  const viewport = createViewport(props, isMobile, prefix);

  // output

  const output: IVevet = {
    ...viewport.data,
    version,
    props,
    prefix,
    isPhone,
    isTablet,
    isDesktop,
    isMobile,
    osName,
    browserName,
    isWebpSupported: false,
    isPageLoaded: false,
    doc: document,
    html: document.documentElement,
    body: document.body,
    onPageLoad: () =>
      new PCancelable((resolve: (...arg: any) => void) =>
        pageLoad.onLoad(resolve),
      ),
    viewportCallbacks: viewport.callbacks,
    onViewport: (...params) => viewport.callbacks.on(...params),
  };

  // update props on page load

  pageLoad.onLoad(() => {
    output.isPageLoaded = true;
  });

  // update props on viewport change

  viewport.callbacks.add(
    'any',
    () => {
      Object.keys(viewport.data).forEach((key) => {
        // @ts-ignore
        output[key] = viewport.data[key];
      });
    },
    { isProtected: true, name: 'app' },
  );

  // set device features

  (function setDeviceFeatures() {
    const { html } = output;

    html.classList.add(`${prefix}os-${osName}`);

    html.classList.add(`${prefix}browser-${browserName}`);

    html.classList.toggle(`${prefix}phone`, output.isPhone);

    html.classList.toggle(`${prefix}tablet`, output.isTablet);

    html.classList.toggle(`${prefix}mobile`, output.isMobile);

    html.classList.toggle(`${prefix}desktop`, output.isDesktop);

    // check webp support
    if (props.checkWebpSupport) {
      fetchWebpSupport()
        .then(() => {
          output.isWebpSupported = true;
        })
        .catch(() => {});
    }
  })();

  return output;
}
