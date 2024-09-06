import { addEventListener } from 'vevet-dom';
import { getApp } from '@/utils/internal/getApp';
import { EOrientationTypes, ESizeTypes, NViewport } from './types';
import { Callbacks } from '@/base/Callbacks';

export function createViewport() {
  // create callbacks
  const callbacks = new Callbacks<NViewport.ICallbacksTypes>();

  // defaults
  const data = {
    callbacks,
    width: 0,
    height: 0,
    radius: 0,
    vw: 0,
    vh: 0,
    vr: 0,
    isLandscape: false,
    isPortrait: false,
    isDesktop: false,
    isTablet: false,
    isPhone: false,
    dpr: window.devicePixelRatio,
    lowerDesktopDpr: window.devicePixelRatio,
  };

  // update values for the first time
  updateValues();

  // set resize events

  let resizeTimeout: NodeJS.Timeout | undefined;

  addEventListener(window, 'resize', () => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
      resizeTimeout = undefined;
    }

    resizeTimeout = setTimeout(() => {
      onResize();
      resizeTimeout = undefined;
    }, getApp().props.resizeDebounce);
  });

  // methods

  function onResize() {
    const { width: prevWidth, height: prevHeight } = data;

    updateValues();

    const { width, height } = data;

    // get changes in viewport
    const changes: NViewport.IChanges = {
      isWidthChanged: width !== prevWidth,
      isHeightChanged: height !== prevHeight,
      isOrientationChanged: width > height !== prevWidth > prevHeight,
    };

    if (width !== prevWidth && height === prevHeight) {
      callbacks.tbt('widthOnly', changes);
    }
    if (height !== prevHeight && width === prevWidth) {
      callbacks.tbt('heightOnly', changes);
    }
    if (width !== prevWidth && height !== prevHeight) {
      callbacks.tbt('both', changes);
    }
    if (width !== prevWidth) {
      callbacks.tbt('width', changes);
    }
    if (height !== prevHeight) {
      callbacks.tbt('height', changes);
    }

    callbacks.tbt('any', changes);
  }

  function updateValues() {
    const app = getApp();
    const { html, props } = app;

    // get width
    const width =
      props.widthDetection === 'boundingRect'
        ? parseFloat(html.getBoundingClientRect().width.toFixed(3))
        : html.clientWidth;

    // set sizes
    data.width = width;
    data.height = html.clientHeight;
    data.radius = Math.sqrt(data.width ** 2 + data.height ** 2) / 2;
    data.vw = data.width / 100;
    data.vh = data.height / 100;
    data.vr = data.radius / 100;
    data.isLandscape = data.width > data.height;
    data.isPortrait = data.width < data.height;
    data.isDesktop = data.width > props.tablet;
    data.isTablet = data.width <= props.tablet && data.width > props.phone;
    data.isPhone = data.width <= props.phone;
    data.dpr = window.devicePixelRatio;
    data.lowerDesktopDpr = data.dpr < 1 ? 1 : data.dpr;
    data.isDesktop = data.width > props.tablet;
    data.isTablet = data.width <= props.tablet && data.width > props.phone;
    data.isPhone = data.width <= props.phone;
    data.dpr = window.devicePixelRatio;
    data.lowerDesktopDpr = app.isDesktop ? 1 : data.dpr;

    // update states
    updateClassNames();
    updateCSSVars();
  }

  function updateClassNames() {
    const viewportSizeTypes: ESizeTypes[] = [
      ESizeTypes.Desktop,
      ESizeTypes.Tablet,
      ESizeTypes.Phone,
    ];

    if (data.isDesktop) {
      updateBreakpointClassNames(ESizeTypes.Desktop, viewportSizeTypes);
    } else if (data.isTablet) {
      updateBreakpointClassNames(ESizeTypes.Tablet, viewportSizeTypes);
    } else {
      updateBreakpointClassNames(ESizeTypes.Phone, viewportSizeTypes);
    }

    const orientationTypes: EOrientationTypes[] = [
      EOrientationTypes.Landscape,
      EOrientationTypes.Portrait,
    ];

    if (data.isLandscape) {
      updateBreakpointClassNames(EOrientationTypes.Landscape, orientationTypes);
    } else if (data.isPortrait) {
      updateBreakpointClassNames(EOrientationTypes.Portrait, orientationTypes);
    } else {
      updateBreakpointClassNames('', orientationTypes);
    }
  }

  function updateBreakpointClassNames(activeType: string, types: string[]) {
    const { html, prefix } = getApp();

    types.forEach((type) => {
      html.classList.toggle(`${prefix}viewport-${type}`, type === activeType);
    });
  }

  function updateCSSVars() {
    const { html } = getApp();

    html.style.setProperty('--vw', `${data.vw}px`);
    html.style.setProperty('--vh', `${data.vh}px`);
    html.style.setProperty('--vr', `${data.vr}px`);
  }

  return data;
}

export type { NViewport };
