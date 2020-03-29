import DraggerModule from './DraggerModule';

/**
 * @classdesc Swipe events.
 * <br><br> <b>import {SwipeModule} from 'vevet';</b>
 * 
 * @class
 * @memberof Vevet
 * @augments Vevet.DraggerModule
 */
export default class SwipeModule extends DraggerModule {



    _setEvents() {

        // ...
        let outer = this._outer,
            outerIgnore = this._outerIgnore,
            type = "swipe";

        // stat swipe
        this.listener(outer, 'touchstart', (e) => {
            e.stopPropagation();
            this._call(type, 'start', e);
        }, {
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