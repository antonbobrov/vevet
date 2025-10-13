import { onResize } from '../../utils/listeners/onResize';
import { Module } from '../../base/Module';
import { initVevet } from '../../global/initVevet';
export * from './types';
/**
 * A class for managing an HTML5 Canvas element and its 2D context.
 *
 * [Documentation](https://antonbobrov.github.io/vevet/docs/components/Canvas)
 *
 * @group Components
 */
export class Canvas extends Module {
    /** Get default static properties */
    _getStatic() {
        return Object.assign(Object.assign({}, super._getStatic()), { container: null, append: true, resizeOnInit: true, resizeOnRuntime: false, viewportTarget: 'any', resizeDebounce: 0 });
    }
    /** Get default mutable properties */
    _getMutable() {
        return Object.assign(Object.assign({}, super._getMutable()), { width: 'auto', height: 'auto', dpr: 'auto' });
    }
    /** The canvas element instance. */
    get canvas() {
        return this._canvas;
    }
    /** Returns the 2D rendering context */
    get ctx() {
        return this._ctx;
    }
    /** Canvas width (DPR applied). */
    get width() {
        return this._width;
    }
    /** Width without DPR scaling. */
    get offsetWidth() {
        return this.width / this.dpr;
    }
    /** Canvas height (DPR applied). */
    get height() {
        return this._height;
    }
    /** Height without DPR scaling. */
    get offsetHeight() {
        return this.height / this.dpr;
    }
    /** Current device pixel ratio. */
    get dpr() {
        return this._dpr;
    }
    /** Checks if the canvas is ready to render. */
    get canRender() {
        return this.width > 0 && this.height > 0;
    }
    /**
     * Constructor for the Ctx2D class.
     */
    constructor(props) {
        super(props);
        const { append: shouldAppend, container, resizeOnInit: hasResizeOnInit, resizeOnRuntime: hasRuntimeResize, viewportTarget, resizeDebounce, } = this.props;
        // Set default values
        this._width = 0;
        this._height = 0;
        this._dpr = 1;
        // Create canvas element
        this._canvas = document.createElement('canvas');
        // Add canvas styles
        const { style } = this._canvas;
        style.position = 'absolute';
        style.top = '0';
        style.left = '0';
        style.width = '100%';
        style.height = '100%';
        // Append canvas to container if required
        if (shouldAppend && container instanceof HTMLElement) {
            container.append(this._canvas);
            this.onDestroy(() => this.canvas.remove());
        }
        // Create 2D context
        this._ctx = this._canvas.getContext('2d');
        // Set resize events
        if (hasResizeOnInit) {
            this.resize();
        }
        if (hasRuntimeResize) {
            const resizeHandler = onResize({
                callback: () => this.resize(),
                element: this.props.container,
                viewportTarget,
                resizeDebounce,
                name: this.name,
            });
            this.onDestroy(() => resizeHandler.remove());
        }
    }
    /** Handle property mutations */
    _handleProps() {
        super._handleProps();
        this.resize();
    }
    /** Triggers a canvas resize based on container or viewport dimensions. */
    resize() {
        const core = initVevet();
        const { props, canvas } = this;
        const { container } = this.props;
        // Calculate DPR
        this._dpr = typeof props.dpr === 'number' ? props.dpr : core.dpr;
        // Calculate new width and height
        let newWidth = 0;
        let newHeight = 0;
        if (props.width === 'auto') {
            newWidth = (container === null || container === void 0 ? void 0 : container.offsetWidth) || core.width;
        }
        else {
            newWidth = props.width;
        }
        if (props.height === 'auto') {
            newHeight = (container === null || container === void 0 ? void 0 : container.offsetHeight) || core.height;
        }
        else {
            newHeight = props.height;
        }
        // Apply DPR
        newWidth *= this._dpr;
        newHeight *= this._dpr;
        // Update canvas size
        this._width = newWidth;
        this._height = newHeight;
        canvas.width = newWidth;
        canvas.height = newHeight;
        // Callbacks
        this.callbacks.emit('resize', undefined);
    }
    /**
     * Renders content on the canvas if it's ready.
     *
     * @param render - A function that performs the actual rendering on the canvas.
     */
    render(render) {
        if (!this.canRender) {
            return;
        }
        render({
            ctx: this.ctx,
            width: this.width,
            height: this.height,
            dpr: this.dpr,
            offsetWidth: this.offsetWidth,
            offsetHeight: this.offsetHeight,
            canvas: this.canvas,
        });
    }
}
//# sourceMappingURL=index.js.map