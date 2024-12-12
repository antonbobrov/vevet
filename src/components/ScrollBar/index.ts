import type { CustomScroll } from '../CustomScroll';
import { Bar } from './Bar';
import { NScrollBar } from './types';
import { Component as ComponentClass } from '@/base/Component';
import { IBarProps } from './Bar/types';
import { onResize } from '@/utils/listeners/onResize';
import { getApp } from '@/utils/internal/getApp';
import { selectOne } from '@/utils/dom/selectOne';

export type { NScrollBar };

/**
 * A custom scroll bar component that can be added to custom or native scroll containers.
 * It supports both horizontal and vertical scroll bars, auto-hide functionality,
 * and drag-to-scroll.
 *
 * @requires Requires styles: `@import '~vevet/lib/styles/components/ScrollBar';`
 *
 * @link See examples https://antonbobrov.github.io/vevet-demo/scrollbar/
 *
 * @link See docs https://antonbobrov.github.io/vevet/classes/ScrollBar.html
 */
export class ScrollBar<
  StaticProps extends NScrollBar.IStaticProps = NScrollBar.IStaticProps,
  ChangeableProps extends
    NScrollBar.IChangeableProps = NScrollBar.IChangeableProps,
  CallbacksTypes extends
    NScrollBar.ICallbacksTypes = NScrollBar.ICallbacksTypes,
> extends ComponentClass<StaticProps, ChangeableProps, CallbacksTypes> {
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      container: window,
      domParent: false,
      resizeDebounce: 16,
      isDraggable: true,
      shouldAutoSize: true,
      canAutoHide: true,
      minSize: 50,
      scrollBehavior: 'smooth',
    };
  }

  get prefix() {
    return `${getApp().prefix}scrollbar`;
  }

  /** Scroll container */
  protected _container: Element | Window | CustomScroll;

  /**
   * The container element or window where the scroll is applied.
   */
  get container() {
    return this._container;
  }

  /**
   * Returns the DOM element where the scroll bars will be appended.
   */
  get domParent() {
    const { domParent } = this.props;

    if (domParent) {
      return domParent;
    }

    const { container } = this;

    if (container instanceof Window) {
      return getApp().body;
    }

    if (container instanceof Element) {
      return container;
    }

    return container.container;
  }

  /**
   * Horizontal scrollbar instance
   * @ignore
   */
  protected _xBar: Bar;

  /**
   * Returns the horizontal scroll bar instance.
   * @ignore
   */
  get xBar() {
    return this._xBar;
  }

  /**
   * Vertical scrollbar instance
   * @ignore
   */
  protected _yBar: Bar;

  /**
   * Returns the vertical scroll bar instance.
   * @ignore
   */
  get yBar() {
    return this._yBar;
  }

  constructor(initialProps?: StaticProps & ChangeableProps, canInit = true) {
    super(initialProps, false);

    const { container } = this.props;

    // get container
    if (typeof container === 'string') {
      const element = selectOne(container);
      if (element) {
        this._container = element;
      } else {
        throw new Error('No scroll container found');
      }
    } else {
      this._container = container as any;
    }

    // create bars
    const barProps: Omit<IBarProps, 'direction'> = {
      ...this.props,
      container: this.container,
      domParent: this.domParent,
      prefix: this.prefix,
    };

    this._xBar = new Bar({
      ...barProps,
      direction: 'x',
    });

    this._yBar = new Bar({
      ...barProps,
      direction: 'y',
    });

    // add classnames
    if (this.container instanceof Window) {
      this.toggleClassName(getApp().html, this.className('-parent'), true);
      this.toggleClassName(getApp().body, this.className('-parent'), true);
    } else if (this.container instanceof Element) {
      this.toggleClassName(this.container, this.className('-parent'), true);
    } else {
      this.toggleClassName(
        this.container.container,
        this.className('-parent'),
        true,
      );
    }

    // initialize the class
    if (canInit) {
      this.init();
    }
  }

  /**
   * Initializes the ScrollBar component.
   */
  protected _init() {
    super._init();

    this._setEvents();
  }

  /**
   * Sets event listeners for the component.
   */
  protected _setEvents() {
    const { container, props } = this;

    // default resize handler
    const resizeHandler = onResize({
      onResize: () => this.resize(),
      element: [this.xBar.outer, this.yBar.outer],
      viewportTarget: 'any',
      hasBothEvents: true,
      resizeDebounce: props.resizeDebounce,
    });

    // resize for custom scroll
    const scrollResize =
      'isCustomScroll' in container
        ? container.on('resize', () => resizeHandler.debounceResize(), {
            name: this.name,
          })
        : undefined;

    this.addDestroyable(() => {
      resizeHandler.remove();
      scrollResize?.();
    });

    // initial resize
    resizeHandler.resize();
  }

  /**
   * Handles the mutation of the properties and updates the component accordingly.
   */
  protected _onPropsMutate() {
    super._onPropsMutate();

    this.resize();
  }

  /**
   * Resizes the scene and updates the scroll bars.
   */
  public resize() {
    this.xBar.resize();
    this.yBar.resize();
  }

  /**
   * Destroys the scroll bar component and cleans up.
   */
  protected _destroy() {
    super._destroy();

    // destroy bars
    this._xBar.destroy();
    this._yBar.destroy();
  }
}
