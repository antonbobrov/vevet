import { IViewport, TViewportCallbacks } from './types';
import { Callbacks } from '@/base/Callbacks';
import { ICoreProps } from '@/core/types';
import { cnToggle } from '@/internal/cn';
import { body, doc, html } from '@/internal/env';
import { addEventListener } from '@/utils/listeners';

interface IProps {
  prefix: string;
  props: ICoreProps;
  isMobile: boolean;
  isInApp: boolean;
}

export function createViewport({ prefix, props, isMobile, isInApp }: IProps) {
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

  // media queries
  const mqDesktop = window.matchMedia(`(min-width: ${props.md + 0.001}px)`);
  const mqTablet = window.matchMedia(
    `(min-width: ${props.sm + 0.001}px) and (max-width: ${props.md}px)`,
  );
  const mqPhone = window.matchMedia(`(max-width: ${props.sm}px)`);

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
    sm: true,
    md: false,
    lg: false,
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

    const rootStyles = getComputedStyle(html);

    data.width = window.innerWidth;
    data.height = window.innerHeight;
    data.scrollbarWidth = window.innerWidth - html.clientWidth;
    data.vw = data.width / 100;
    data.vh = data.height / 100;
    data.rem = parseFloat(rootStyles.fontSize);
    data.landscape = data.width > data.height;
    data.portrait = data.width < data.height;
    data.dpr = window.devicePixelRatio;
    data.lowerDpr = !isMobile ? 1 : Math.min(data.dpr, 2);
    data.sm = false;
    data.md = false;
    data.lg = false;

    if (mqPhone.matches) {
      data.sm = true;
    } else if (mqTablet.matches) {
      data.md = true;
    } else if (mqDesktop.matches) {
      data.lg = true;
    }

    // for in-app browser, update svh only if width changed
    if (isMobile && isInApp) {
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

    cnToggle(html, `${prefix}lg`, data.lg);
    cnToggle(html, `${prefix}md`, data.md);
    cnToggle(html, `${prefix}sm`, data.sm);

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
