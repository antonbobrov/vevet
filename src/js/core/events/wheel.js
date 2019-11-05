/**
 * @typedef {object} Vevet.utils.NormalizeWheel
 * @property {number} spinX
 * @property {number} spinY
 * @property {number} pixelX
 * @property {number} pixelY
 */

/**
 * @description Normalize wheel data.
 * @author {@link https://github.com/basilfx/normalize-wheel| basilfx}
 * 
 * @param {object} e - Object of the wheel event.
 * 
 * @returns {Vevet.utils.NormalizeWheel} Returns normalized data.
 * 
 * @memberof Vevet.utils
 * @alias Vevet.utils.normalizeWheel
 * 
 * @public
 * 
 */
export function normalizeWheel (e) {

    const step = 10;
    const lineHeight = 40;
    const pageHeight = 800;

    let sX = 0,
        sY = 0,
        pX = 0,
        pY = 0;

    if ('detail' in e) {
        sY = e.detail;
    }
    if ('wheelDelta' in e) {
        sY = -e.wheelDelta / 120;
    }
    if ('wheelDeltaY' in e) {
        sY = -e.wheelDeltaY / 120;
    }
    if ('wheelDeltaX' in e) {
        sX = -e.wheelDeltaX / 120;
    }

    if ('axis' in e && e.axis === e.HORIZONTAL_AXIS) {
        sX = sY;
        sY = 0;
    }

    pX = sX * step;
    pY = sY * step;

    if ('deltaY' in e) {
        pY = e.deltaY;
    }

    if ('deltaX' in e) {
        pX = e.deltaX;
    }

    if ((pX || pY) && e.deltaMode) {
        if (e.deltaMode == 1) {
            pX *= lineHeight;
            pY *= lineHeight;
        }
        else {
            pX *= pageHeight;
            pY *= pageHeight;
        }
    }

    if (pX && !sX) {
        sX = (pX < 1) ? -1 : 1;
    }
    if (pY && !sY) {
        sY = (pY < 1) ? -1 : 1;
    }

    return {
        spinX: sX,
        spinY: sY,
        pixelX: pX,
        pixelY: pY
    };

}