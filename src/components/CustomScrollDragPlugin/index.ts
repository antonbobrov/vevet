import { Plugin } from '@/base/Plugin';
import { NCustomScrollDragPlugin } from './types';
import type { CustomScroll as CustomScrollInstance } from '../CustomScroll';
import { DraggerMove, NDraggerMove } from '../DraggerMove';

export type { NCustomScrollDragPlugin };

/**
 * Plugin to add dragging functionality to a `CustomScroll` instance.
 * It allows the user to control the scroll by dragging within the container.
 *
 * @link See examples https://antonbobrov.github.io/vevet-demo/custom-scroll/
 *
 * @link See docs https://antonbobrov.github.io/vevet/classes/CustomScrollDragPlugin.html
 */
export class CustomScrollDragPlugin<
  StaticProp extends
    NCustomScrollDragPlugin.IStaticProps = NCustomScrollDragPlugin.IStaticProps,
  ChangeableProp extends
    NCustomScrollDragPlugin.IChangeableProps = NCustomScrollDragPlugin.IChangeableProps,
  CallbacksTypes extends
    NCustomScrollDragPlugin.ICallbacksTypes = NCustomScrollDragPlugin.ICallbacksTypes,
> extends Plugin<
  StaticProp,
  ChangeableProp,
  CallbacksTypes,
  CustomScrollInstance
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

  /** Instance of the DraggerMove component that handles dragging. */
  protected _dragger?: DraggerMove;

  /** List of callbacks added to the CustomScroll instance. */
  protected _componentCallbacks?: (() => void)[];

  /** Holds the previous lerp value of the CustomScroll component. */
  protected _prevComponentLerp?: number;

  /**
   * Determines whether dragging is currently active.
   */
  get isDragging() {
    return this._dragger?.isDragging ?? false;
  }

  protected _init() {
    super._init();

    this._toggleDragger();
  }

  protected _onPropsMutate() {
    super._onPropsMutate();

    this._toggleDragger();
  }

  /**
   * Enables or disables the dragger based on the `isEnabled` property.
   */
  protected _toggleDragger() {
    if (this.props.isEnabled) {
      this._addDragger();
    } else {
      this._removeDragger();
    }
  }

  /**
   * Adds the dragger functionality to the CustomScroll instance.
   */
  protected _addDragger() {
    if (this._dragger) {
      return;
    }

    const { component } = this;

    this._dragger = new DraggerMove({
      container: component.container,
    });

    this._dragger.on('start', () => this._handleDragStart());

    this._dragger.on('move', (data) => this._handleDragMove(data));

    this._dragger.on('end', () => this._handleDragEnd());

    if (!this._componentCallbacks) {
      this._componentCallbacks = [];
    }

    this._componentCallbacks.push(
      component.on('wheel', () => this._dragger?.cancel(), {
        name: this.name,
      }),
    );
  }

  /**
   * Removes the dragger and cleans up callbacks.
   */
  protected _removeDragger() {
    if (!this._dragger) {
      return;
    }

    this._dragger.destroy();
    this._dragger = undefined;

    this._componentCallbacks?.forEach((callback) => callback());
    this._componentCallbacks = [];
  }

  /**
   * Determines if dragging is possible based on the current scroll state.
   */
  protected _getIsDragAvailable() {
    const { component } = this;

    if (!component.props.isEnabled) {
      return false;
    }

    if (
      component.maxScrollableWidth <= 0 &&
      component.maxScrollableHeight <= 0
    ) {
      return false;
    }

    return true;
  }

  /**
   * Handles the start of dragging.
   */
  protected _handleDragStart() {
    if (!this._getIsDragAvailable()) {
      return;
    }

    const { component } = this;

    if (typeof this.props.lerp === 'number') {
      this._prevComponentLerp = component.props.lerp;
      component.changeProps({ lerp: this.props.lerp });
    }

    this.callbacks.tbt('start', undefined);
  }

  /**
   * Handles the dragging move event and updates scroll values.
   */
  protected _handleDragMove({
    event,
    coords,
    start,
    step,
  }: NDraggerMove.ICallbacksTypes['move']) {
    if (!this._getIsDragAvailable()) {
      return;
    }

    const { component, props } = this;

    const {
      stopPropagationThreshold: threshold,
      stopPropagationDirection: direction,
    } = props;

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

    const x = step.x * props.speed;
    const y = step.y * props.speed;

    component.targetLeft -= x;
    component.targetTop -= y;

    component.wrapper.style.pointerEvents = 'none';
    component.wrapper.style.userSelect = 'none';

    this.callbacks.tbt('move', undefined);
  }

  /**
   * Handles the end of dragging and restores the scroll state.
   */
  protected _handleDragEnd() {
    const { component } = this;

    component.wrapper.style.pointerEvents = '';
    component.wrapper.style.userSelect = '';

    if (typeof this._prevComponentLerp === 'number') {
      component.changeProps({ lerp: this._prevComponentLerp });
      this._prevComponentLerp = undefined;
    }

    this.callbacks.tbt('end', undefined);
  }

  /** Cleans up and destroys the plugin. */
  protected _destroy() {
    super._destroy();

    this._removeDragger();
  }
}
