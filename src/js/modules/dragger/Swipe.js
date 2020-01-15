import Dragger from './index';

/**
 * @classdesc Swipe events.
 * <br><br> <b>import {Swipe} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.Dragger
 */
export default class Swipe extends Dragger {



    _setEvents() {

        // ...
        let outer = this._outer,
            outerIgnore = this._outerIgnore,
            type = "swipe";

        // stat swipe
        this.listener(outer, 'touchstart', this._call.bind(this, type, 'start'), {
            passive: true
        });

        // moving
        this.listener(outerIgnore, 'touchmove', this._call.bind(this, type, 'move'), {
            passive: true
        });

        // end swipe, _once events
        this.listener(outerIgnore, 'touchend', (e) => {
            this._call(type, 'up', e);
            this._call(type, 'down', e);
            this._call(type, 'left', e);
            this._call(type, 'right', e);
            this._call(type, 'end', e);
        }, {
            passive: true
        });

    }



}