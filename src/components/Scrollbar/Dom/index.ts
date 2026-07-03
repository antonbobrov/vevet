import { cnAdd } from '@/internal/cn';
import { body, doc, html } from '@/internal/env';
import { ModulePart } from '@/shared/ModulePart';

import { Scrollbar } from '..';
import { isSnap } from '../utils/isSnap';

import { createScrollbarStyles } from './styles';

/**
 * DOM tree and mount target for {@link Scrollbar}.
 *
 * Injects global styles once, builds `outer` → `track` → `thumb`, appends to
 * {@link domParent}, and applies axis-specific `-scrollable-*` classes on the
 * scroll target. `_inited` is deferred to the next tick after mount.
 *
 * @internal
 */
export class ScrollbarDom extends ModulePart<Scrollbar> {
  private _outer: HTMLElement;

  private _track: HTMLElement;

  private _thumb: HTMLElement;

  constructor(parent: Scrollbar) {
    super(parent);

    createScrollbarStyles(this.prefix);

    const isInWindow = this.props.container instanceof Window;
    const { scrollElement } = this;
    const axis = this.parent.axis;

    this._outer = this._createOuter();
    this.domParent.appendChild(this._outer);
    this.onDestroy(() => this._outer.remove());

    this._track = this._createTrack();
    this._outer.appendChild(this._track);

    this._thumb = this._createThumb();
    this._track.appendChild(this._thumb);

    if (isInWindow) {
      this._tempCn(html, `-scrollable-${axis}`);
      this._tempCn(body, `-scrollable-${axis}`);
    } else if (scrollElement instanceof HTMLElement) {
      this._tempCn(scrollElement, `-scrollable-${axis}`);
    }

    const timeout = setTimeout(() => cnAdd(this.outer, this._cn('_inited')), 0);

    this.onDestroy(() => clearTimeout(timeout));
  }

  get container() {
    return this.props.container;
  }

  private get insideWindow() {
    return this.props.container instanceof Window;
  }

  /** Native scroll metrics target (`html` for `window`, else {@link container}). */
  get scrollElement() {
    return this.container instanceof Window ? html : this.container;
  }

  get outer() {
    return this._outer;
  }

  get track() {
    return this._track;
  }

  get thumb() {
    return this._thumb;
  }

  /**
   * Element that receives the scrollbar DOM.
   *
   * Defaults to `props.parent`, `body` for `window`, Snap inner container, or
   * the scroll container itself.
   */
  get domParent() {
    const { container } = this;
    const { parent } = this.props;

    if (parent) {
      return parent;
    }

    if (container instanceof Window) {
      return body;
    }

    if (isSnap(container)) {
      return container.container;
    }

    return container;
  }

  private _createOuter() {
    const { props, axis } = this.parent;

    const element = doc.createElement('div');
    element.setAttribute('data-scrollbar', 'true');
    cnAdd(element, this._cn(''));
    cnAdd(element, this._cn(`_${axis}`));

    if (props.class) {
      cnAdd(element, props.class);
    }

    if (this.insideWindow) {
      cnAdd(element, this._cn('_in-window'));
    }

    if (props.autoHide) {
      cnAdd(element, this._cn('_auto-hide'));
    }

    return element;
  }

  private _createTrack() {
    const { axis } = this.parent;

    const element = doc.createElement('div');
    cnAdd(element, this._cn('__track'));
    cnAdd(element, this._cn(`__track_${axis}`));

    return element;
  }

  private _createThumb() {
    const { axis } = this.parent;

    const element = doc.createElement('div');
    cnAdd(element, this._cn('__thumb'));
    cnAdd(element, this._cn(`__thumb_${axis}`));

    return element;
  }
}
