import InAppSpy from 'inapp-spy';
import Bowser from 'bowser';
import manifest from '../manifest.json';
import { createPageLoad } from './handlers/createPageLoad';
import { ICoreProps } from './types';
import { createViewport } from './handlers/createViewport';
import { ICore } from './global';

export function Core(input: Partial<ICoreProps>): ICore {
  // set default properties

  const defaultProps: ICoreProps = {
    md: 1199,
    sm: 999,
    resizeDebounce: 0,
    easing: [0.25, 0.1, 0.25, 1],
    applyClassNames: false,
  };

  const props = { ...defaultProps, ...input };

  const prefix = 'v-';

  // device info

  const bowser = Bowser.getParser(window.navigator.userAgent);

  const { isInApp, appName } = InAppSpy();
  const inAppBrowser = isInApp ? (appName || 'unknown').toLowerCase() : false;

  const browser = bowser.getBrowser();
  const os = bowser.getOS();

  const browserName =
    browser.name?.replaceAll(' ', '_').toLowerCase() ?? 'unknown';
  const osName = os.name?.replaceAll(' ', '_').toLowerCase() ?? 'unknown';

  const platform = bowser.getPlatform().type;
  const isPhone = platform === 'mobile';
  const isTablet = platform === 'tablet';

  const isMobile = isPhone || isTablet;

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
    phone: isPhone,
    tablet: isTablet,
    mobile: isMobile,
    osName,
    browserName,
    inAppBrowser,
    doc: document,
    html: document.documentElement,
    body: document.body,
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

    const { html } = output;

    html.classList.add(`${prefix}os-${osName}`);

    html.classList.add(`${prefix}browser-${browserName}`);

    html.classList.toggle(`${prefix}phone`, output.phone);

    html.classList.toggle(`${prefix}tablet`, output.tablet);

    html.classList.toggle(`${prefix}mobile`, output.mobile);
  })();

  return output;
}
