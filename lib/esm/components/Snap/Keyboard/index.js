import { addEventListener } from '../../../utils';
export class SnapKeyboard {
    constructor(_snap) {
        this._snap = _snap;
        /** Listeners to destruct */
        this._destructors = [];
        _snap.on('destroy', () => this._destroy(), { protected: true });
        this._destructors.push(addEventListener(_snap.container, 'scroll', () => this._handleScroll()));
    }
    /** Snap component */
    get snap() {
        return this._snap;
    }
    /** Handle scroll lock */
    _handleScroll() {
        this.snap.container.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    /** Destroy wheel listeners */
    _destroy() {
        this._destructors.forEach((destructor) => destructor());
    }
}
//# sourceMappingURL=index.js.map