import { childOf } from 'vevet-dom';
import { Plugin } from '@/base/Plugin';
import { NSmoothScrollKeyboardPlugin } from './types';
import type { SmoothScroll as SmoothScrollInstance } from '../SmoothScroll';

export type { NSmoothScrollKeyboardPlugin };

/**
 * Add keyboard navigation
 */
export class SmoothScrollKeyboardPlugin<
  StaticProps extends
    NSmoothScrollKeyboardPlugin.IStaticProps = NSmoothScrollKeyboardPlugin.IStaticProps,
  ChangeableProps extends
    NSmoothScrollKeyboardPlugin.IChangeableProps = NSmoothScrollKeyboardPlugin.IChangeableProps,
  CallbacksTypes extends
    NSmoothScrollKeyboardPlugin.ICallbacksTypes = NSmoothScrollKeyboardPlugin.ICallbacksTypes,
> extends Plugin<
  StaticProps,
  ChangeableProps,
  CallbacksTypes,
  SmoothScrollInstance
> {
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      iterator: 40,
    };
  }

  protected _tabDebounceTimeout?: NodeJS.Timeout;

  /** Initialize the class */
  protected _init() {
    super._init();

    this.addEventListener(window, 'keydown', (event) =>
      this._handleKeydown(event),
    );
  }

  /** Check if keyboard events may be ignored */
  protected _canIgnoreKeyboardEvents() {
    const { activeElement } = document;

    return (
      activeElement instanceof HTMLInputElement ||
      activeElement instanceof HTMLTextAreaElement ||
      activeElement instanceof HTMLSelectElement
    );
  }

  /** Check if scroll container is in viewport */
  protected _checkScrollContainerInViewport() {
    const { viewport } = this.app;

    const bounding = this.component.container.getBoundingClientRect();

    return (
      bounding.left < viewport.width &&
      bounding.right > 0 &&
      bounding.top < viewport.height &&
      bounding.bottom > 0
    );
  }

  /** Check if scroll ended */
  protected _checkIsEndOfScroll() {
    const { component } = this;

    return (
      component.targetTop >= component.maxScrollableHeight &&
      component.targetLeft >= component.maxScrollableWidth
    );
  }

  /** Event on `keydown` */
  protected _handleKeydown(event: KeyboardEvent) {
    const { component } = this;
    const { iterator } = this.props;

    if (!component.props.isEnabled) {
      return;
    }

    // TAB
    if (event.keyCode === 9) {
      this._handleTab();

      return;
    }

    // ignore key events for some elements
    if (this._canIgnoreKeyboardEvents()) {
      return;
    }

    // check if the scroll container is in viewport
    if (!this._checkScrollContainerInViewport()) {
      return;
    }

    // prevent default behavior
    if (
      !this._checkIsEndOfScroll() &&
      [38, 40, 39, 37, 34, 33, 36, 35, 32].includes(event.keyCode)
    ) {
      event.preventDefault();
    }

    // update scroll values
    switch (event.keyCode) {
      // UP
      case 38:
        component.targetTop -= iterator;
        break;
      // DOWN
      case 40:
        component.targetTop += iterator;
        break;

      // RIGHT
      case 39:
        component.targetLeft += iterator;
        break;
      // LEFT
      case 37:
        component.targetLeft -= iterator;
        break;

      // PageDown
      case 34:
        component.targetTop += iterator * 10;
        break;
      // PageUp
      case 33:
        component.targetTop -= iterator * 10;
        break;

      // HOME
      case 36:
        component.targetTop = 0;
        component.targetLeft = 0;
        break;
      // END
      case 35:
        component.targetTop = component.scrollHeight;
        component.targetLeft = component.scrollWidth;
        break;

      // SPACE
      case 32:
        component.targetTop += iterator * 5;
        break;

      default:
        break;
    }
  }

  /** Handle Tab key */
  protected _handleTab() {
    if (this._tabDebounceTimeout) {
      clearTimeout(this._tabDebounceTimeout);
    }

    this._tabDebounceTimeout = setTimeout(() => {
      const scroll = this.component;
      const { activeElement } = document;

      // skip elements that do not belong to the SmoothScroll outer
      if (
        !(activeElement instanceof HTMLElement) ||
        !childOf(activeElement, scroll.container)
      ) {
        return;
      }

      const scrollOuterBounding = scroll.container.getBoundingClientRect();
      const activeElementBounding = activeElement.getBoundingClientRect();

      const top =
        scroll.scrollTop +
        (activeElementBounding.top - scrollOuterBounding.top) -
        (scroll.clientHeight / 2 - activeElementBounding.height / 2);
      const left =
        scroll.scrollLeft +
        (activeElementBounding.left - scrollOuterBounding.left) -
        (scroll.clientWidth / 2 - activeElementBounding.width / 2);

      scroll.targetTop = top;
      scroll.targetLeft = left;
    }, 120);
  }

  /** Destroy the plugin */
  protected _destroy() {
    super._destroy();

    if (this._tabDebounceTimeout) {
      clearTimeout(this._tabDebounceTimeout);
    }
  }
}
