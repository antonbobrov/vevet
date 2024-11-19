import {
  EOrientation,
  EBreakpoint,
  IViewportData,
  IViewportCallbackTypes,
} from './types';
import { Callbacks } from '@/base/Callbacks';
import { IVevetProps } from '../../types';
import { addEventListener } from '@/utils/dom/addEventListener';

export function createViewport(
  props: IVevetProps,
  isMobileDevice: boolean,
  prefix: string,
) {
  const html = document.documentElement;

  const mqDesktop = window.matchMedia(`(min-width: ${props.tablet + 0.001}px)`);
  const mqTablet = window.matchMedia(
    `(min-width: ${props.phone + 0.001}px) and (max-width: ${props.tablet}px)`,
  );
  const mqPhone = window.matchMedia(`(max-width: ${props.phone}px)`);

  // create callbacks
  const callbacks = new Callbacks<IViewportCallbackTypes>();

  // default data
  const data: IViewportData = {
    width: 0,
    height: 0,
    sHeight: 0,
    vw: 0,
    vh: 0,
    svh: 0,
    isLandscape: false,
    isPortrait: false,
    dpr: window.devicePixelRatio,
    lowerDpr: window.devicePixelRatio,
    breakpoint: 'phone',
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

    callbacks.tbt('any', undefined);

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
  }

  /** Update viewport values */
  function updateValues() {
    const { width: prevWidth } = data;

    data.width = window.innerWidth;
    data.height = window.innerHeight;
    data.vw = data.width / 100;
    data.vh = data.height / 100;
    data.isLandscape = data.width > data.height;
    data.isPortrait = data.width < data.height;
    data.dpr = window.devicePixelRatio;
    data.lowerDpr = !isMobileDevice ? 1 : Math.min(data.dpr, 2);

    if (mqPhone.matches) {
      data.breakpoint = 'phone';
    } else if (mqTablet.matches) {
      data.breakpoint = 'tablet';
    } else if (mqDesktop.matches) {
      data.breakpoint = 'desktop';
    }

    // update sHeight && svh only when the width changes
    // or for desktop
    if (prevWidth !== data.width || !data.sHeight || !isMobileDevice) {
      data.sHeight = document.documentElement.clientHeight;
      data.svh = data.sHeight / 100;
    }

    // update states
    updateClassNames();
    updateCSSVars();
  }

  /** Update page classnames according to the viewport data */
  function updateClassNames() {
    const breakpoints: EBreakpoint[] = [
      EBreakpoint.Desktop,
      EBreakpoint.Tablet,
      EBreakpoint.Phone,
    ];

    if (data.breakpoint === 'desktop') {
      updateBreakpointClassNames(EBreakpoint.Desktop, breakpoints);
    } else if (data.breakpoint === 'tablet') {
      updateBreakpointClassNames(EBreakpoint.Tablet, breakpoints);
    } else {
      updateBreakpointClassNames(EBreakpoint.Phone, breakpoints);
    }

    const orientationTypes: EOrientation[] = [
      EOrientation.Landscape,
      EOrientation.Portrait,
    ];

    if (data.isLandscape) {
      updateBreakpointClassNames(EOrientation.Landscape, orientationTypes);
    } else if (data.isPortrait) {
      updateBreakpointClassNames(EOrientation.Portrait, orientationTypes);
    } else {
      updateBreakpointClassNames('', orientationTypes);
    }
  }

  /** Set classnames */
  function updateBreakpointClassNames(activeType: string, types: string[]) {
    types.forEach((type) => {
      html.classList.toggle(`${prefix}${type}`, type === activeType);
    });
  }

  /** Update CSS variables */
  function updateCSSVars() {
    html.style.setProperty('--vw', `${data.vw}px`);
    html.style.setProperty('--vh', `${data.vh}px`);
    html.style.setProperty('--svh', `${data.svh}px`);
  }

  return { data, callbacks };
}
