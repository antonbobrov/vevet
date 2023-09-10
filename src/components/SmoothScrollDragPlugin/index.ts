import { Plugin } from '@/base/Plugin';
import { NSmoothScrollDragPlugin } from './types';
import type { SmoothScroll as SmoothScrollInstance } from '../SmoothScroll';
import { DraggerMove, NDraggerMove } from '../DraggerMove';
import { NCallbacks } from '@/base/Callbacks';

export type { NSmoothScrollDragPlugin };

/**
 * Add dragger to `SmoothScroll`
 */
export class SmoothScrollDragPlugin<
  StaticProp extends NSmoothScrollDragPlugin.IStaticProps = NSmoothScrollDragPlugin.IStaticProps,
  ChangeableProp extends NSmoothScrollDragPlugin.IChangeableProps = NSmoothScrollDragPlugin.IChangeableProps,
  CallbacksTypes extends NSmoothScrollDragPlugin.ICallbacksTypes = NSmoothScrollDragPlugin.ICallbacksTypes
> extends Plugin<
  StaticProp,
  ChangeableProp,
  CallbacksTypes,
  SmoothScrollInstance
> {
  protected _getDefaultProps() {
    return {
      ...super._getDefaultProps(),
      isEnabled: true,
      speed: 1,
      lerp: false,
      stopPropagationThreshold: false,
      stopPropagationDirection: 'y',
    };
  }

  /** Dragger component */
  private _dragger?: DraggerMove;

  /** Component callbacks */
  private _componentCallbacks?: NCallbacks.IAddedCallback[];

  /** If is dragging at the moment */
  get isDragging() {
    return this._dragger?.isDragging ?? false;
  }

  /**
   * Current lerp of SmoothScroll
   */
  private _prevComponentLerp?: number;

  /** Initialize the class */
  protected _init() {
    super._init();

    this._toggleDragger();
  }

  protected _onPropsMutate() {
    super._onPropsMutate();

    this._toggleDragger();
  }

  /** Add or remove dragger */
  private _toggleDragger() {
    if (this.props.isEnabled) {
      this._addDragger();
    } else {
      this._removeDragger();
    }
  }

  /** Add dragger */
  private _addDragger() {
    if (this._dragger) {
      return;
    }

    const { component } = this;

    this._dragger = new DraggerMove({
      container: component.container,
    });

    this._dragger.addCallback('start', () => this._handleDragStart());

    this._dragger.addCallback('move', (data) => this._handleDragMove(data));

    this._dragger.addCallback('end', () => this._handleDragEnd());

    if (!this._componentCallbacks) {
      this._componentCallbacks = [];
    }

    this._componentCallbacks.push(
      component.addCallback('wheel', () => this._dragger?.cancel(), {
        name: this.name,
      })
    );
  }

  /** Remove dragger */
  private _removeDragger() {
    if (!this._dragger) {
      return;
    }

    this._dragger.destroy();
    this._dragger = undefined;

    this._componentCallbacks?.forEach((callback) => callback.remove());
    this._componentCallbacks = [];
  }

  /** Check if dragging is available */
  private _getIsDragAvailable() {
    const { component } = this;

    if (!component.props.isEnabled) {
      return false;
    }

    // check scrollable area
    if (
      component.maxScrollableWidth <= 0 &&
      component.maxScrollableHeight <= 0
    ) {
      return false;
    }

    return true;
  }

  /** Callback on dragging start */
  private _handleDragStart() {
    if (!this._getIsDragAvailable()) {
      return;
    }

    const { component } = this;

    // change lerp
    if (typeof this.props.lerp === 'number') {
      this._prevComponentLerp = component.props.lerp;
      component.changeProps({ lerp: this.props.lerp });
    }

    // launch callbacks
    this.callbacks.tbt('start', undefined);
  }

  /** Callback on drag move */
  private _handleDragMove({
    event,
    coords,
    start,
    step,
  }: NDraggerMove.ICallbacksTypes['move']) {
    if (!this._getIsDragAvailable()) {
      return;
    }

    const { component } = this;
    const { props } = this;

    // get difference between coordinates and decide
    // if we need to stop propagation
    const {
      stopPropagationThreshold: threshold,
      stopPropagationDirection: direction,
    } = this.props;
    if (typeof threshold === 'number' && event.cancelable) {
      const diffX = Math.abs(coords.x - start.x);
      const diffY = Math.abs(coords.y - start.y);

      if (
        (diffX > threshold && direction === 'x') ||
        (diffY > threshold && direction === 'y')
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    }

    // get coordinates
    const x = step.x * props.speed;
    const y = step.y * props.speed;

    // update scroll values
    component.targetLeft -= x;
    component.targetTop -= y;

    // update styles
    component.wrapper.style.pointerEvents = 'none';
    component.wrapper.style.userSelect = 'none';

    // launch callbacks
    this.callbacks.tbt('move', undefined);
  }

  /**
   * Callback on dragging end
   */
  private _handleDragEnd() {
    const { component } = this;

    // update styles
    component.wrapper.style.pointerEvents = '';
    component.wrapper.style.userSelect = '';

    // restore SmoothScroll Lerp
    if (typeof this._prevComponentLerp === 'number') {
      component.changeProps({ lerp: this._prevComponentLerp });
      this._prevComponentLerp = undefined;
    }

    // launch callbacks
    this.callbacks.tbt('end', undefined);
  }

  /** Destroy the plugin */
  protected _destroy() {
    super._destroy();

    this._removeDragger();
  }
}
