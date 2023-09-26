import { selectOne } from 'vevet-dom';
import type { SmoothScroll } from '../SmoothScroll';
import Bar from './Bar';
import { NScrollBar } from './types';
import { Component as ComponentClass } from '@/base/Component';
import { IBarProps } from './Bar/types';
import { onResize } from '@/utils/listeners/onResize';

export type { NScrollBar };

/**
 * Create custom scroll bar
 */
export class ScrollBar<
  StaticProps extends NScrollBar.IStaticProps = NScrollBar.IStaticProps,
  ChangeableProps extends NScrollBar.IChangeableProps = NScrollBar.IChangeableProps,
  CallbacksTypes extends NScrollBar.ICallbacksTypes = NScrollBar.ICallbacksTypes
> extends ComponentClass<StaticProps, ChangeableProps, CallbacksTypes> {
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      container: window,
      domParent: false,
      resizeDebounce: 16,
      isDraggable: true,
      hasAutoSize: true,
      canAutoHide: true,
      minSize: 50,
      scrollBehavior: 'smooth',
    };
  }

  get prefix() {
    return `${this.app.prefix}scrollbar`;
  }

  /** Scroll container */
  private _container: Element | Window | SmoothScroll;

  /** Scroll container */
  get container() {
    return this._container;
  }

  /** Scrollable element */
  get scrollableElement() {
    const { container } = this;

    if (container instanceof Window) {
      return this.app.body;
    }

    if (container instanceof Element) {
      return container;
    }

    return container.container;
  }

  /**
   * The element where scrollbars will be appended
   */
  get domParent() {
    const { domParent } = this.props;

    if (domParent) {
      return domParent;
    }

    const { container } = this;

    if (container instanceof Window) {
      return this.app.body;
    }

    if (container instanceof Element) {
      return container;
    }

    return container.container;
  }

  /** Horizontal scrollbar */
  private _xBar: Bar;

  /** Vertical scrollbar */
  private _yBar: Bar;

  constructor(initialProps?: StaticProps & ChangeableProps, canInit = true) {
    super(initialProps, false);

    const { container } = this.props;

    // get container
    if (typeof container === 'string') {
      const element = selectOne(container);
      if (element) {
        this._container = element;
      } else {
        throw new Error('No scroll container');
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
    this.toggleClassName(
      this.scrollableElement,
      this.className('-parent'),
      true
    );

    // initialize the class
    if (canInit) {
      this.init();
    }
  }

  protected _init() {
    super._init();

    this._setEvents();
  }

  // Set Module Events
  private _setEvents() {
    const { container, props } = this;

    // default resize handler
    const resizeHandler = onResize({
      onResize: () => this.resize(),
      element: [this._xBar.outer, this._yBar.outer],
      viewportTarget: 'any',
      hasBothEvents: true,
      resizeDebounce: props.resizeDebounce,
    });

    // resize for smoothscroll
    const smoothScrollResize =
      'isSmoothScroll' in container
        ? container.addCallback(
            'resize',
            () => resizeHandler.debounceResize(),
            { name: this.name }
          )
        : undefined;

    this.addDestroyableAction(() => {
      resizeHandler.remove();
      smoothScrollResize?.remove();
    });

    // initial resize
    resizeHandler.resize();
  }

  protected _onPropsMutate() {
    super._onPropsMutate();
    this.resize();
  }

  /** Resize the scene */
  public resize() {
    this._xBar.resize();
    this._yBar.resize();
  }

  /** Destroy the module */
  protected _destroy() {
    super._destroy();

    // destroy bars
    this._xBar.destroy();
    this._yBar.destroy();
  }
}
