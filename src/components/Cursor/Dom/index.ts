import { body, cnToggle, doc, getTextDirection, ModulePart } from '@/internal';
import { addEventListener } from '@/utils';

import { ICursorDomData } from './types';

import type { Cursor } from '..';

/**
 * Cursor outer/inner DOM, visibility/click classes, and native cursor hiding.
 *
 * On destroy: removes nodes, click/blur listeners, and restores `cursor` /
 * `position` on the container when previously changed.
 *
 * @internal
 */
export class CursorDom extends ModulePart<Cursor> {
  private _outer: HTMLElement;

  private _inner: HTMLElement;

  constructor(
    parent: Cursor,
    private _data: ICursorDomData,
  ) {
    super(parent);

    this._outer = doc.createElement('div');
    this._inner = doc.createElement('div');

    this._modifyElements();
    this._applyGlobalStyles();

    this.onDestroy(() => {
      this._inner.remove();
      this._outer.remove();
    });

    this.onDestroy(
      addEventListener(
        _data.domContainer,
        'mousedown',
        this._handleMouseDown.bind(this),
      ),
    );

    this.onDestroy(
      addEventListener(
        _data.domContainer,
        'mouseup',
        this._handleMouseUp.bind(this),
      ),
    );

    this.onDestroy(
      addEventListener(window, 'blur', this._handleWindowBlur.bind(this)),
    );
  }

  get outer() {
    return this._outer;
  }

  get inner() {
    return this._inner;
  }

  private _modifyElements() {
    const { outer, inner } = this;
    const { container, domContainer } = this._data;

    const isWindow = container instanceof Window;

    this._tempCn(outer, '');
    this._tempCn(outer, isWindow ? '-in-window' : '-in-element');
    this._tempCn(outer, '-disabled');

    if (this.props.append) {
      domContainer.append(outer);
    }

    const direction = getTextDirection(outer);
    this._tempCn(outer, `_${direction}`);

    this._tempCn(inner, '__inner');
    this._tempCn(inner, '-disabled');
    outer.append(inner);
  }

  private _applyGlobalStyles() {
    const { domContainer } = this._data;

    // Hide native cursor
    if (this.props.hideNative) {
      domContainer.style.cursor = 'none';

      this._tempCn(domContainer, '-hide-default');
    }

    // Set class names
    this._tempCn(domContainer, '-container');

    // Set container position
    if (domContainer !== body) {
      const previousPosition = domContainer.style.position;
      domContainer.style.position = 'relative';

      this.onDestroy(() => {
        domContainer.style.position = previousPosition;
      });
    }

    // Reset styles
    this.onDestroy(() => {
      domContainer.style.cursor = '';
    });
  }

  public toggleEnabled(isEnabled: boolean) {
    const className = this._cn('-disabled');

    cnToggle(this.outer, className, !isEnabled);
    cnToggle(this.inner, className, !isEnabled);
  }

  public toggleVisibility(isVisible: boolean) {
    cnToggle(this.outer, this._cn('-visible'), isVisible);
  }

  private _toggleClick(isActive: boolean) {
    const className = this._cn('-click');

    cnToggle(this.outer, className, isActive);
    cnToggle(this.inner, className, isActive);
  }

  private _handleMouseDown(evt: MouseEvent) {
    if (evt.which === 1) {
      this._toggleClick(true);
    }
  }

  private _handleMouseUp() {
    this._toggleClick(false);
  }

  private _handleWindowBlur() {
    this._handleMouseUp();
  }
}
