import { addEventListener } from 'vevet-dom';
import {
  EOrientationTypes,
  ESizeTypes,
  IViewport,
  IViewportCallbackTypes,
} from './types';
import { Callbacks } from '@/base/Callbacks';
import { IVevetProps } from '../../types';

export function createViewport(
  props: IVevetProps,
  isDesktopDevice: boolean,
  prefix: string,
): IViewport {
  const html = document.documentElement;

  // create callbacks
  const callbacks = new Callbacks<IViewportCallbackTypes>();

  // default data
  const data: IViewport = {
    callbacks,
    width: 0,
    height: 0,
    vw: 0,
    vh: 0,
    isLandscape: false,
    isPortrait: false,
    isDesktop: false,
    isTablet: false,
    isPhone: false,
    dpr: window.devicePixelRatio,
    lowerDpr: window.devicePixelRatio,
  };

  // update values for the first time
  updateValues();

  // add resize events

  let resizeTimeout: NodeJS.Timeout | undefined;

  addEventListener(window, 'resize', () => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
      resizeTimeout = undefined;
    }

    resizeTimeout = setTimeout(() => {
      onResize();
      resizeTimeout = undefined;
    }, props.resizeDebounce);
  });

  /** Event on window resize */
  function onResize() {
    const { width: prevWidth, height: prevHeight } = data;

    updateValues();

    const { width, height } = data;

    if (width !== prevWidth && height === prevHeight) {
      callbacks.tbt('widthOnly', undefined);
    }
    if (height !== prevHeight && width === prevWidth) {
      callbacks.tbt('heightOnly', undefined);
    }
    if (width !== prevWidth && height !== prevHeight) {
      callbacks.tbt('both', undefined);
    }
    if (width !== prevWidth) {
      callbacks.tbt('width', undefined);
    }
    if (height !== prevHeight) {
      callbacks.tbt('height', undefined);
    }

    callbacks.tbt('any', undefined);
  }

  /** Update viewport values */
  function updateValues() {
    // get width
    const width =
      props.widthDetection === 'boundingRect'
        ? parseFloat(html.getBoundingClientRect().width.toFixed(3))
        : html.clientWidth;

    // set sizes
    data.width = width;
    data.height = html.clientHeight;
    data.vw = data.width / 100;
    data.vh = data.height / 100;
    data.isLandscape = data.width > data.height;
    data.isPortrait = data.width < data.height;
    data.isDesktop = data.width > props.tablet;
    data.isTablet = data.width <= props.tablet && data.width > props.phone;
    data.isPhone = data.width <= props.phone;
    data.dpr = window.devicePixelRatio;
    data.lowerDpr = data.dpr < 1 ? 1 : data.dpr;
    data.isDesktop = data.width > props.tablet;
    data.isTablet = data.width <= props.tablet && data.width > props.phone;
    data.isPhone = data.width <= props.phone;
    data.dpr = window.devicePixelRatio;
    data.lowerDpr = isDesktopDevice ? 1 : Math.min(data.dpr, 2);

    // update states
    updateClassNames();
    updateCSSVars();
  }

  /** Update page classnames according to the viewport data */
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

  /** Set classnames */
  function updateBreakpointClassNames(activeType: string, types: string[]) {
    types.forEach((type) => {
      html.classList.toggle(`${prefix}viewport-${type}`, type === activeType);
    });
  }

  /** Update CSS variables */
  function updateCSSVars() {
    html.style.setProperty('--vw', `${data.vw}px`);
    html.style.setProperty('--vh', `${data.vh}px`);
  }

  return data;
}
