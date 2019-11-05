import Dragger from './index';

/**
 * @classdesc Drag events.
 * <br><br> <b>import {Drag} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Dragger
 */
export default class Drag extends Dragger {



    _setEvents() {

        // ...
        let outer = this._outer,
            outerIgnore = this._outerIgnore,
            type = "drag";

        // mouse down first
        this.listener(outer, 'mousedown', (e) => {
            if (e.which == 1) {
                this._call(type, 'start', e);
            }
        });

        // moving
        this.listener(outerIgnore, 'mousemove', this._call.bind(this, type, 'move'));

        // end drag, _once events
        this.listener(outerIgnore, 'mouseup', (e) => {
            this._call(type, 'up', e);
            this._call(type, 'down', e);
            this._call(type, 'left', e);
            this._call(type, 'right', e);
            this._call(type, 'end', e);
        });

        // end drag on window blur
        this.listener(outerIgnore, 'blur', (e) => {
            this._call(type, 'end', e);
        });

    }



}