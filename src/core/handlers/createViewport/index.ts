import { Callbacks } from '@/base/Callbacks';
import { ICoreProps } from '@/core/types';
import { cnToggle } from '@/internal/cn';
import { body, doc, html } from '@/internal/env';
import { isFiniteNumber } from '@/internal/isFiniteNumber';
import { addEventListener } from '@/utils/listeners';

import { IViewport, TViewportCallbacks } from './types';

interface IProps {
  prefix: string;
  props: ICoreProps;
  isMobile: boolean;
  isInApp: boolean;
  browserName: string;
}

export function createViewport({
  prefix,
  props,
  isMobile,
  isInApp,
  browserName,
}: IProps) {
  // create styles
  let styles = doc.getElementById('vevet_css_preset');
  if (!styles) {
    styles = doc.createElement('style');
    styles.id = 'vevet_css_preset';
    body.appendChild(styles);
  }

  // create svh helper
  const svhHelper = doc.createElement('div');
  const { style } = svhHelper;
  svhHelper.id = 'vevet_svh_helper';
  style.position = 'fixed';
  style.top = '-100svh';
  style.left = '-100px';
  style.width = '1px';
  style.height = '100svh';
  body.appendChild(svhHelper);

  // create callbacks
  const callbacks: TViewportCallbacks = new Callbacks();

  // default data
  const data: IViewport = {
    width: 0,
    height: 0,
    sHeight: 0,
    vw: 0,
    vh: 0,
    svh: 0,
    scrollbarWidth: 0,
    rem: 16,
    landscape: false,
    portrait: false,
    dpr: window.devicePixelRatio,
    lowerDpr: window.devicePixelRatio,
  };

  // update values for the first time
  updateValues();
  updateClassNames();
  updateCSSVars();

  // add resize events

  let debounce: NodeJS.Timeout | undefined;

  function debounceResize() {
    if (debounce) {
      clearTimeout(debounce);
      debounce = undefined;
    }

    if (props.resizeDebounce) {
      debounce = setTimeout(() => onResize(), props.resizeDebounce);
    } else {
      onResize();
    }
  }

  addEventListener(window, 'resize', () => debounceResize());

  const observer = new ResizeObserver(() => debounceResize());
  observer.observe(html);
  observer.observe(body);

  /** Event on window resize */
  function onResize() {
    const { width: prevWidth, height: prevHeight } = data;

    updateValues();
    updateClassNames();
    updateCSSVars();

    const { width, height } = data;

    callbacks.emit('trigger', undefined);

    if (width !== prevWidth || height !== prevHeight) {
      callbacks.emit('any', undefined);
    }

    if (width !== prevWidth && height === prevHeight) {
      callbacks.emit('onlyWidth', undefined);
    }

    if (height !== prevHeight && width === prevWidth) {
      callbacks.emit('onlyHeight', undefined);
    }

    if (width !== prevWidth && height !== prevHeight) {
      callbacks.emit('both', undefined);
    }

    if (width !== prevWidth) {
      callbacks.emit('width', undefined);
    }

    if (height !== prevHeight) {
      callbacks.emit('height', undefined);
    }
  }

  /** Update viewport values */
  function updateValues() {
    const { width: prevWidth } = data;

    const vWidth = window.innerWidth;
    const vHeight = window.innerHeight;

    data.width = vWidth;
    data.height = vHeight;
    data.scrollbarWidth = vWidth - html.clientWidth;
    data.vw = data.width / 100;
    data.vh = data.height / 100;

    const rootStyles = getComputedStyle(html);
    const fontSize = parseFloat(rootStyles.fontSize);

    data.rem = isFiniteNumber(fontSize) ? fontSize : 16;

    data.landscape = data.width > data.height;
    data.portrait = data.width < data.height;
    data.dpr = window.devicePixelRatio;
    data.lowerDpr = !isMobile ? 1 : Math.min(data.dpr, 2);

    // for in-app browser, update svh only if width changed
    if (isMobile && (isInApp || browserName.includes('fxios'))) {
      const rootHeight = html.clientHeight;

      if (prevWidth !== data.width || !data.sHeight) {
        data.sHeight = rootHeight;
        data.svh = data.sHeight / 100;
      } else if (prevWidth === data.width && rootHeight < data.sHeight) {
        data.sHeight = rootHeight;
        data.svh = data.sHeight / 100;
      }
    } else {
      // when other browser, update svh directly
      data.svh = svhHelper.clientHeight / 100 || html.clientHeight / 100;
      data.sHeight = data.svh * 100;
    }
  }

  /** Update page classnames according to the viewport data */
  function updateClassNames() {
    if (!props.applyClassNames) {
      return;
    }

    cnToggle(html, `${prefix}landscape`, data.landscape);
    cnToggle(html, `${prefix}portrait`, data.portrait);
  }

  /** Update CSS variables */
  function updateCSSVars() {
    styles!.innerHTML = `
      html {
        --vw: ${data.vw}px;
        --vh: ${data.vh}px;
        --svh: ${data.svh}px;
        --scrollbar-width: ${data.scrollbarWidth}px;
      }
    `;
  }

  return { data, callbacks };
}
