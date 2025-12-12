import { detect } from 'detect-browser';
import isMobileJs from 'ismobilejs';
import InAppSpy from 'inapp-spy';
import manifest from '../manifest.json';
import { createPageLoad } from './handlers/createPageLoad';
import { ICoreProps } from './types';
import { createViewport } from './handlers/createViewport';
import { ICore } from './global';
import { cnAdd, cnToggle } from '@/internal/cn';
import { body, doc, html } from '@/internal/env';

export function Core(input: Partial<ICoreProps>): ICore {
  // set default properties

  const defaultProps: ICoreProps = {
    resizeDebounce: 0,
    easing: [0.25, 0.1, 0.25, 1],
    applyClassNames: false,
  };

  const props = { ...defaultProps, ...input };

  const prefix = 'v-';

  // device info

  const browserData = detect();
  const device = isMobileJs();

  const osName = (browserData?.os || '')?.split(' ')[0].toLowerCase();
  const browserName = (browserData?.name || '').toLowerCase();

  const isMobile = device.phone || device.tablet;

  const { isInApp, appName } = InAppSpy();
  const inAppBrowser = isInApp ? (appName || 'unknown').toLowerCase() : false;

  // events

  const pageLoad = createPageLoad({
    prefix,
    applyClassNames: props.applyClassNames,
  });

  const viewport = createViewport({ prefix, props, isMobile, isInApp });

  // output

  const output: ICore = {
    ...viewport.data,
    viewportCallbacks: viewport.callbacks,
    version: manifest.version,
    props,
    prefix,
    phone: device.phone,
    tablet: device.tablet,
    mobile: isMobile,
    osName,
    browserName,
    inAppBrowser,
    doc,
    html,
    body,
    loaded: false,
    onLoad: pageLoad.onLoad,
    onResize: (...params) => viewport.callbacks.on(...params),
  };

  // update props on page load

  pageLoad.onLoad(() => {
    output.loaded = true;
  });

  // update props on viewport change

  viewport.callbacks.add(
    'trigger',
    () => {
      const keys = Object.keys(viewport.data);
      keys.forEach((key) => {
        // @ts-ignore
        output[key] = viewport.data[key];
      });
    },
    { protected: true, name: 'vevet core' },
  );

  // set device features

  (function setDeviceFeatures() {
    if (!props.applyClassNames) {
      return;
    }

    cnAdd(html, `${prefix}os-${osName}`);

    cnAdd(html, `${prefix}browser-${browserName}`);

    cnToggle(html, `${prefix}phone`, output.phone);

    cnToggle(html, `${prefix}tablet`, output.tablet);

    cnToggle(html, `${prefix}mobile`, output.mobile);
  })();

  return output;
}
