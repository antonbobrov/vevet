import { clamp, onResize, toPixels, uid } from '../../../utils';
export class SnapSlide {
    constructor(_element, initProps = {}) {
        this._element = _element;
        /** Current coordinate */
        this._coord = 0;
        /** If the slide is appended */
        this._isAppended = false;
        /** If the slide is visible */
        this._isVisible = false;
        /** Static coordinate (as if the slide was never moved) */
        this._staticCoord = 0;
        /** Current progress of slide movement: from -1 to 1 */
        this._progress = 0;
        this._id = uid('snap-slide');
        this._index = 0;
        const defaultProps = {
            virtual: false,
        };
        this._props = Object.assign(Object.assign({}, defaultProps), initProps);
        if (this.props.virtual && (!initProps.size || initProps.size === 'auto')) {
            throw new Error('Virtual slide must have a size');
        }
    }
    /** Slide element */
    get element() {
        return this._element;
    }
    /** Slide properties */
    get props() {
        return this._props;
    }
    /** Slide id */
    get id() {
        return this._id;
    }
    /** Slide index */
    get index() {
        return this._index;
    }
    /** Snap component */
    get snap() {
        return this._snap;
    }
    /** Current coordinate */
    get coord() {
        return this._coord;
    }
    /** Current coordinate. Do not update it manually! */
    setCoord(value) {
        var _a, _b;
        this._coord = value;
        this._isVisible =
            this.size > 0 &&
                this.coord > -this.size &&
                this.coord < ((_b = (_a = this.snap) === null || _a === void 0 ? void 0 : _a.domSize) !== null && _b !== void 0 ? _b : 0);
    }
    /** Static coordinate (as if the slide was never moved) */
    get staticCoord() {
        return this._staticCoord;
    }
    /** Static coordinate (as if the slide was never moved). Do not update it manually! Alignment: start */
    setStaticCoord(value) {
        this._staticCoord = value;
    }
    /** Current progress of slide movement: from -1 to 1 */
    get progress() {
        return this._progress;
    }
    /** Current progress of slide movement: from -1 to 1. Do not update it manually! */
    setProgress(value) {
        this._progress = value;
    }
    /** Size property */
    get sizeProp() {
        var _a, _b, _c;
        return (_c = (_a = this.props.size) !== null && _a !== void 0 ? _a : (_b = this.snap) === null || _b === void 0 ? void 0 : _b.props.slideSize) !== null && _c !== void 0 ? _c : 'auto';
    }
    /** Slide size in pixels */
    get size() {
        var _a;
        const { snap, sizeProp } = this;
        if (!snap) {
            return 0;
        }
        if (sizeProp === 'stretch') {
            return snap.domSize;
        }
        if (sizeProp === 'auto') {
            return (_a = this._domSize) !== null && _a !== void 0 ? _a : snap.domSize;
        }
        return toPixels(sizeProp);
    }
    /** Check if the slide is visible */
    get isVisible() {
        return this._isVisible;
    }
    /** Resize the slide & trigger snap reflow */
    resize(isManual = false) {
        const { element, snap } = this;
        if (!snap) {
            return;
        }
        // Update DOM size
        if (element) {
            const { direction } = snap.props;
            this._domSize =
                direction === 'horizontal' ? element.offsetWidth : element.offsetHeight;
        }
        // Re-flow
        snap.resize(isManual);
    }
    /** Attach the slide to the Snap class */
    attach(snap, index) {
        this.detach();
        this._snap = snap;
        this._index = index;
        if (this.element && this.sizeProp === 'auto') {
            this._onResize = onResize({
                element: this.element,
                viewportTarget: 'width',
                callback: () => this.resize(),
                name: 'Snap Slide',
            });
        }
        this.resize();
    }
    /** Detach the slide from the Snap class */
    detach() {
        var _a;
        this._snap = undefined;
        (_a = this._onResize) === null || _a === void 0 ? void 0 : _a.remove();
    }
    /** Render the slide */
    render() {
        this._toggleAppend();
    }
    /** Toggle slide append/remove */
    _toggleAppend() {
        if (!this.props.virtual || !this.element || !this.snap) {
            return;
        }
        const { element } = this;
        const { container } = this.snap;
        if (this.isVisible && !this._isAppended) {
            this._isAppended = true;
            container.appendChild(element);
        }
        else if (!this.isVisible && this._isAppended) {
            this._isAppended = false;
            container.removeChild(element);
        }
    }
    /** Get magnets with static coordinates but dynamic alignment */
    get magnets() {
        if (!this.snap) {
            return [];
        }
        const { snap, staticCoord, size, index } = this;
        const { domSize, track, firstSlideSize } = snap;
        let points = [];
        if (index === 0 && snap.props.loop) {
            points.push(track.max);
        }
        if (snap.props.centered) {
            const point = staticCoord + size / 2 - firstSlideSize / 2;
            if (size > domSize) {
                points.push(point);
                points.push(point + (domSize - size) / 2);
                points.push(point - (domSize - size) / 2);
            }
            else {
                points.push(point);
            }
        }
        else {
            points.push(staticCoord);
            if (size > domSize) {
                points.push(staticCoord + (size - domSize));
            }
        }
        if (!track.canLoop && !snap.props.centered) {
            points = points.map((point) => clamp(point, 0, track.max));
        }
        return points;
    }
}
//# sourceMappingURL=index.js.map