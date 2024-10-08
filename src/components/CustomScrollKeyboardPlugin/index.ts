import { childOf } from 'vevet-dom';
import { Plugin } from '@/base/Plugin';
import { NCustomScrollKeyboardPlugin } from './types';
import type { CustomScroll as CustomScrollInstance } from '../CustomScroll';
import { getApp } from '@/utils/internal/getApp';

export type { NCustomScrollKeyboardPlugin };

/**
 * CustomScrollKeyboardPlugin adds keyboard navigation functionality to the `CustomScroll` component.
 * It allows scrolling the container using keyboard arrow keys, space bar, page up/down, home, end, and tab.
 */
export class CustomScrollKeyboardPlugin<
  StaticProps extends
    NCustomScrollKeyboardPlugin.IStaticProps = NCustomScrollKeyboardPlugin.IStaticProps,
  ChangeableProps extends
    NCustomScrollKeyboardPlugin.IChangeableProps = NCustomScrollKeyboardPlugin.IChangeableProps,
  CallbacksTypes extends
    NCustomScrollKeyboardPlugin.ICallbacksTypes = NCustomScrollKeyboardPlugin.ICallbacksTypes,
> extends Plugin<
  StaticProps,
  ChangeableProps,
  CallbacksTypes,
  CustomScrollInstance
> {
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      iterator: 40,
    };
  }

  /**
   * Timeout for handling the Tab key navigation.
   */
  protected _tabTimeout?: NodeJS.Timeout;

  /** Initializes the plugin by adding event listeners for keyboard events. */
  protected _init() {
    super._init();

    this.addEventListener(window, 'keydown', (event) =>
      this._handleKeydown(event),
    );
  }

  /**
   * Determines if keyboard events should be ignored, based on the currently active element.
   */
  protected _canIgnoreEvents() {
    const { activeElement } = document;

    return (
      activeElement instanceof HTMLInputElement ||
      activeElement instanceof HTMLTextAreaElement ||
      activeElement instanceof HTMLSelectElement
    );
  }

  /**
   * Checks if the scroll container is visible in the viewport.
   */
  protected _isInViewport() {
    const { viewport } = getApp();

    const bounding = this.component.container.getBoundingClientRect();

    return (
      bounding.left < viewport.width &&
      bounding.right > 0 &&
      bounding.top < viewport.height &&
      bounding.bottom > 0
    );
  }

  /**
   * Determines whether the scroll has reached its end.
   */
  protected _checkIsEndOfScroll() {
    const { component } = this;

    return (
      component.targetTop >= component.maxScrollableHeight &&
      component.targetLeft >= component.maxScrollableWidth
    );
  }

  /**
   * Handles the `keydown` event for navigating the scrollable container with the keyboard.
   */
  protected _handleKeydown(event: KeyboardEvent) {
    const { component } = this;
    const { iterator } = this.props;

    if (!component.props.isEnabled) {
      return;
    }

    // Handle Tab key
    if (event.keyCode === 9) {
      this._handleTab();

      return;
    }

    // Handle Spacebar key
    if (event.keyCode === 32) {
      this._handleSpace(event);

      return;
    }

    // Ignore events from form fields
    if (this._canIgnoreEvents()) {
      return;
    }

    // Ignore scroll events if the container is not in the viewport
    if (!this._isInViewport()) {
      return;
    }

    // Prevent default behavior for specific keys if the scroll has not reached its end
    if (
      !this._checkIsEndOfScroll() &&
      [38, 40, 39, 37, 34, 33, 36, 35].includes(event.keyCode)
    ) {
      event.preventDefault();
    }

    // Handle scroll key events
    switch (event.keyCode) {
      case 38: // Arrow Up
        component.targetTop -= iterator;
        break;
      case 40: // Arrow Down
        component.targetTop += iterator;
        break;
      case 39: // Arrow Right
        component.targetLeft += iterator;
        break;
      case 37: // Arrow Left
        component.targetLeft -= iterator;
        break;
      case 34: // Page Down
        component.targetTop += iterator * 10;
        break;
      case 33: // Page Up
        component.targetTop -= iterator * 10;
        break;
      case 36: // Home
        component.targetTop = 0;
        component.targetLeft = 0;
        break;
      case 35: // End
        component.targetTop = component.scrollHeight;
        component.targetLeft = component.scrollWidth;
        break;

      default:
        break;
    }
  }

  /**
   * Handles the Tab key for focusing elements inside the scrollable container and adjusting the scroll position.
   */
  protected _handleTab() {
    if (this._tabTimeout) {
      clearTimeout(this._tabTimeout);
    }

    this._tabTimeout = setTimeout(() => {
      const scroll = this.component;
      const { activeElement } = document;

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

  /**
   * Handles the Spacebar key to scroll down the container by a fixed amount.
   */
  protected _handleSpace(event: KeyboardEvent) {
    if (document.activeElement instanceof HTMLButtonElement) {
      return;
    }

    event.preventDefault();

    this.component.targetTop += this.props.iterator * 5;
  }

  /** Destroys the plugin and clears any timeouts or event listeners. */
  protected _destroy() {
    super._destroy();

    if (this._tabTimeout) {
      clearTimeout(this._tabTimeout);
    }
  }
}
