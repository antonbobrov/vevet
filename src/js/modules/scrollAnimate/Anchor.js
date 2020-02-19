import ScrollAnimate from './index';
import Timeline from '../timeline';
import utils from '../../core/utils';

/**
 * @classdesc Split your content into sections and highlight links that refer to a definite section when it is in viewport. <br>
 * Available targets:
 *  <ul>
 *      <li>change - When a screen has been changed. Argument - {@linkcode Vevet.Anchor.Ref}</li>
 *      <li>click - This event is called when a reference-link was clicked. Argument - {@linkcode Vevet.Anchor.Change}</li>
 *  </ul>
 * <br><br> <b>import {Anchor} from 'vevet';</b>
 * 
 * @class
 * @abstract
 * @memberof Vevet
 * @augments Vevet.ScrollAnimate
 * @requires Vevet.Timeline
 */
export default class Anchor extends ScrollAnimate {


    
    /**
     * @memberof Vevet.Anchor
     * @typedef {object} Properties
     * @augments Vevet.ScrollAnimate.Properties
     * 
     * @property {object} [selectors]
     * @property {string|HTMLElement|Window|Vevet.Scroll} [selectors.outer=.vevet-scrollAnimate] - The scroll outer element.
     * @property {string|HTMLElement|NodeList|Array<HTMLElement>} [selectors.elements=.vevet-scrollAnimate__el] - Sections.
     * @property {boolean} [selectors.inside=true] - True for searching elements only inside the outer element.
     * @property {string|HTMLElement|NodeList|Array<HTMLElement>} [selectors.anchors=.vevet-anchor__anchor] - The selector for reference-anchors.
     * 
     * @property {number} [animation] - Animation settings.
     * @property {number} [animation.auto=true] - Auto duration that is calculated for each 100px.
     * @property {number} [animation.duration=50] - Duration either for the whole 'scrollTop/scrollLeft' or for each 100px.
     * @property {number} [animation.min=250] - Minimum duration.
     * @property {number} [animation.max=1750] - Maximum duration.
     * @property {number} [animation.delay=0] - Delay before 'scrollTo'.
     * @property {string|Array<number>|Function} [animation.easing] - Easing function. The default value is equal to {@linkcode Vevet.Application#easing}.
     * 
     * @property {number} [edge=0.5] - The moment when a section is in viewport.
     * 0.5 = 50% of viewport height/width from top/left.
     * @property {number} [edgeClick=0.3] - Where a section must be positionated after a reference-anchor was clickd.
     * 0.3 = 30% of viewport height/width from top/left.
     */
    /**
     * @alias Vevet.Anchor
     * @param {Vevet.Anchor.Properties} [data]
     */
    constructor(data = {}) {
        super(data);
    }

    get prefix() {
        return `${this._v.prefix}anchor`;
    }

    /**
     * @readonly
     * @type {Vevet.Anchor.Properties}
     */
    get defaultProp() {
        
        return utils.merge(super.defaultProp, {
            selectors: {
                anchors: `.${this._prefix}__anchor`
            },
            classes: {
                element: 'active',
                anchor: 'active'
            },
            clicks: true,
            animation: {
                auto: true,
                duration: 750,
                min: 250,
                max: 1750,
                delay: 0,
                easing: this._vp.easing
            },
            edge: .5,
            edgeClick: .3
        });

    }

    /**
     * @member Vevet.Anchor#prop
     * @memberof Vevet.Anchor
     * @readonly
     * @type {Vevet.Anchor.Properties}
     */

    /**
     * @member Vevet.Anchor#_prop
     * @memberof Vevet.Anchor
     * @protected
     * @type {Vevet.Anchor.Properties}
     */

    /**
     * @function Vevet.Anchor#changeProp
     * @memberof Vevet.Anchor
     * @param {Vevet.Anchor.Properties} [prop]
     */



    /**
     * @description Active id.
     * @readonly
     * @type {string}
     */
    get active() {
        return this._active;
    }

    /**
     * @memberof Vevet.Anchor
     * @typedef {object} Ref
     * @property {string} href - Reference id.
     * @property {HTMLElement} el - Reference section.
     * @property {HTMLElement} anchor - Reference anchor.
     */
    /**
     * @memberof Vevet.Anchor
     * @typedef {object} Change
     * @property {Vevet.Anchor.Ref} prev - Previous section.
     * @property {Vevet.Anchor.Ref} next - Previous section.
     */



    // Extra Constructor
    _extra() {

        this._edge = 0;
        this._active = '';

        super._extra();

    }



    /**
     * @description Get elements.
     * @protected
     */
    _elGet() {

        super._elGet();

        // get anchors
        this._anchors = utils.elements(this._prop.selectors.anchors);

        // set hrefs
        this._hrefs = [];
        this._anchors.forEach(el => {
            let href = this._getHref(el);
            if (href) {
                this._hrefs.push(href);
            }
        });

    }

    /**
     * @description Get href of a link.
     * @param {HTMLElement} el 
     * @private
     */
    _getHref(el) {

        let href = el.getAttribute("href");
        if (href) {
            href = href.replace("#", "");
            if (href.length === 0) {
                return false;
            }
            else {
                return href;
            }
        }

        return false;

    }

    /**
     * @description Get a section with a certain id.
     * @param {string} href 
     * @private
     */
    _getSection(href) {

        let section = false;

        this._el.forEach(el => {
            let id = el.getAttribute("id");
            if (id === href) {
                section = el;
            }
        });
        
        return section;

    }

    /**
     * @description Get an anchor with a certain id.
     * @param {string} id 
     * @private
     */
    _getAnchor(id) {

        let anchor = false;

        this._anchors.forEach(el => {
            let href = this._getHref(el);
            if (href) {
                if (id === href) {
                    anchor = el;
                }
            }
        });
        
        return anchor;

    }



    // Set events
    _setEvents() {

        super._setEvents();

        // set clicks on anchors
        this._anchors.forEach(el => {
            if (this._prop.clicks) {
                this.listener(el, 'click', this._click.bind(this, el));
            }
        });

    }

    /**
     * @description Update size values.
     */
    setSize() {

        super.setSize();

        this._edge = this._prop.edge * this._size;

    }



    /**
     * @description Click on anchor.
     * @param {HTMLElement} el - Anchor element.
     * @param {object|null} [e=null] -Event object.
     * @private
     */
    _click(el, e = null) {

        // prevent action
        if (e != null) {
            e.preventDefault();
        }

        // get href
        let href = this._getHref(el);
        if (!href) {
            return false;
        }

        // get section
        let section = this._getSection(href);
        if (!section) {
            return false;
        }

        // callbacks
        this.lbt("click", {
            href: href,
            el: section,
            anchor: el
        });

        // scroll to the section
        setTimeout(() => {
            this._scrollTo(section);
        }, this._prop.animation.delay);

    }



    /**
     * @description Scroll to a definite section.
     * @param {HTMLElement} el - Section element.
     * @private
     */
    _scrollTo(el) {

        // get vars
        let prop = this._prop,
            animation = prop.animation;

        // scroll value
        let scrollValue = this._scrollValue;

        // get section bounding
        let bounding = el.getBoundingClientRect();

        // get difference
        let diff = 0;
        if (prop.horizontal) {
            diff = bounding.left - this._bounding.left;
        }
        else {
            diff = bounding.top - this._bounding.top;
        }

        // new difference with edges
        diff -= (prop.edgeClick * this._size);

        // get duration
        let duration = animation.duration;
        if (animation.auto) {
            duration = Math.ceil(Math.abs(diff / 100) * duration);
        }
        if (duration < animation.min) {
            duration = animation.min;
        }
        if (duration > animation.max) {
            duration = animation.max;
        }

        // set animation
        let timeline = new Timeline({
            destroyOnEnd: true
        });
        timeline.add({
            target: 'progress',
            do: (p) => {
                if (prop.horizontal) {
                    this._vevetScroll.scrollLeft = scrollValue + (diff * p.se);
                }
                else {
                    this._vevetScroll.scrollTop = scrollValue + (diff * p.se);
                }
            }
        });
        timeline.play({
            duration: duration,
            easing: animation.easing
        });

    }



    // Seek elements
    seek(val = null) {
        
        if (!super.seek(val)) {
            return false;
        }

        // get prop
        let prop = this._prop,
            classes = prop.classes;

        // get edge
        let edge = this._edge;

        // active href
        let activePrev = this._active;

        // search active
		for (let i = 0; i < this._el.length; i++) {

            let el = this.elements[i];

            // get sizes
            let bounding = this.elements[i].getBoundingClientRect();
            let b = {
                top: bounding.top - this._bounding.top,
                left: bounding.left - this._bounding.left
            };
            let elEdge = prop.horizontal ? b.left : b.top;

            // check if in viewport
			if (elEdge <= edge) {
                let id = el.id;
                this._active = id;
            }
            
        }

        // check if active changed
        let changed = activePrev != this._active;

        // change classes
        if (changed) {
            this._el.forEach(el => {

                // get id
                let id = el.id;

                // change section classes
                if (id === this._active) {
                    el.classList.add(classes.element);
                }
                else {
                    el.classList.remove(classes.element);
                }

                // change anchor classes
                let anchor = this._getAnchor(id);
                if (anchor) {
                    if (id === this._active) {
                        anchor.classList.add(classes.anchor);
                    }
                    else {
                        anchor.classList.remove(classes.anchor);
                    }
                }

            });
        }

        // callback
        if (changed) {
            this.lbt("change", {
                prev: {
                    href: activePrev,
                    el: this._getSection(activePrev),
                    anchor: this._getAnchor(activePrev)
                },
                next: {
                    href: this._active,
                    el: this._getSection(this._active),
                    anchor: this._getAnchor(this._active)
                }
            });
        }

    }



    /**
     * @description Set a new section/Scroll to a section.
     * @param {string} id - Id of the section.
     * @returns {boolean} Returns true if success.
     */
    set(id) {

        let section = this._getSection(id);
        if (!section) {
            return false;
        }
     
        this._scrollTo(section);

        return true;

    }



}