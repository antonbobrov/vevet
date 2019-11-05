/**
 * @description Easing functions. See {@link https://easings.net/en}. <br>
 * Available names of easing functions:
 * <ul>
 *     <li>easeInQuad</li>
 *     <li>easeOutQuad</li>
 *     <li>easeInOutQuad</li>
 *     <li>easeInCubic</li>
 *     <li>easeOutCubic</li>
 *     <li>easeInOutCubic</li>
 *     <li>easeInQuart</li>
 *     <li>easeOutQuart</li>
 *     <li>easeInOutQuart</li>
 *     <li>easeInQuint</li>
 *     <li>easeOutQuint</li>
 *     <li>easeInOutQuint</li>
 *     <li>easeInSine</li>
 *     <li>easeOutSine</li>
 *     <li>easeInOutSine</li>
 *     <li>easeInExpo</li>
 *     <li>easeOutExpo</li>
 *     <li>easeInOutExpo</li>
 *     <li>easeInCirc</li>
 *     <li>easeOutCirc</li>
 *     <li>easeInOutCirc</li>
 *     <li>easeInElastic</li>
 *     <li>easeOutElastic</li>
 *     <li>easeInOutElastic</li>
 *     <li>easeInBack</li>
 *     <li>easeOutBack</li>
 *     <li>easeInOutBack</li>
 *     <li>easeInBounce</li>
 *     <li>easeOutBounce</li>
 *     <li>easeInOutBounce</li>
 * </ul>
 * 
 * @param {number} t - Current time.
 * @param {string|Array<number>|Function} value - The name of a easing function or values of a quadratic bezier.
 * 
 * @returns {number} Returns a progress value.
 * 
 * @memberof Vevet.utils
 * @alias Vevet.utils.easing
 * 
 * @example 
 * 
 * Vevet.utils.easing(.5, 'easeInQuad');
 * Vevet.utils.easing(.5, [.25, .1, .25, 1]);
 * 
 */
export function easing (t, value) {

    let b = 0,
        c = 1,
        d = 1;

    if (Array.isArray(value)) {
        return this._bezier(value, t);
    }
    else if (typeof value === "string") {
        switch (value) {

            case 'easeInQuad':
                return c * (t /= d) * t + b;
                break;
            case 'easeOutQuad':
                return -c * (t /= d) * (t - 2) + b;
                break;
            case 'easeInOutQuad':
                if ((t /= d / 2) < 1) return c / 2 * t * t + b;
                return -c / 2 * ((--t) * (t - 2) - 1) + b;
                break;
            case 'easeInCubic':
                return c * (t /= d) * t * t + b;
                break;
            case 'easeOutCubic':
                return c * ((t = t / d - 1) * t * t + 1) + b;
                break;
            case 'easeInOutCubic':
                if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t + 2) + b;
                break;
            case 'easeInQuart':
                return c * (t /= d) * t * t * t + b;
                break;
            case 'easeOutQuart':
                return -c * ((t = t / d - 1) * t * t * t - 1) + b;
                break;
            case 'easeInOutQuart':
                if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
                return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
                break;
            case 'easeInQuint':
                return c * (t /= d) * t * t * t * t + b;
                break;
            case 'easeOutQuint':
                return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
                break;
            case 'easeInOutQuint':
                if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
                break;
            case 'easeInSine':
                return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
                break;
            case 'easeOutSine':
                return c * Math.sin(t / d * (Math.PI / 2)) + b;
                break;
            case 'easeInOutSine':
                return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
                break;
            case 'easeInExpo':
                return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
                break;
            case 'easeOutExpo':
                return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
                break;
            case 'easeInOutExpo':
                if (t == 0) return b;
                if (t == d) return b + c;
                if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
                break;
            case 'easeInCirc':
                return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
                break;
            case 'easeOutCirc':
                return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
                break;
            case 'easeInOutCirc':
                if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
                break;
            case 'easeInElastic':
                var s = 1.70158;
                var p = 0;
                var a = c;
                if (t == 0) return b;
                if ((t /= d) == 1) return b + c;
                if (!p) p = d * .3;
                if (a < Math.abs(c)) {
                    a = c;
                    var s = p / 4;
                } else var s = p / (2 * Math.PI) * Math.asin(c / a);
                return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                break;
            case 'easeOutElastic':
                var s = 1.70158;
                var p = 0;
                var a = c;
                if (t == 0) return b;
                if ((t /= d) == 1) return b + c;
                if (!p) p = d * .3;
                if (a < Math.abs(c)) {
                    a = c;
                    var s = p / 4;
                } else var s = p / (2 * Math.PI) * Math.asin(c / a);
                return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
                break;
            case 'easeInOutElastic':
                var s = 1.70158;
                var p = 0;
                var a = c;
                if (t == 0) return b;
                if ((t /= d / 2) == 2) return b + c;
                if (!p) p = d * (.3 * 1.5);
                if (a < Math.abs(c)) {
                    a = c;
                    var s = p / 4;
                } else var s = p / (2 * Math.PI) * Math.asin(c / a);
                if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
                break;
            case 'easeInBack':
                if (s == undefined) s = 1.70158;
                return c * (t /= d) * t * ((s + 1) * t - s) + b;
                break;
            case 'easeOutBack':
                if (s == undefined) s = 1.70158;
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
                break;
            case 'easeInOutBack':
                if (s == undefined) s = 1.70158;
                if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
                break;
            case 'easeInBounce':
                return c - this.easing((d - t), 'easeOutBounce') + b;
                break;
            case 'easeOutBounce':
                if ((t /= d) < (1 / 2.75)) {
                    return c * (7.5625 * t * t) + b;
                } else if (t < (2 / 2.75)) {
                    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                } else if (t < (2.5 / 2.75)) {
                    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                } else {
                    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
                }
                break;
            case 'easeInOutBounce':
                if (t < d / 2) return this.easing((t * 2), 'easeOutBounce') * .5 + b;
                return this.easing((t * 2 - d), 'easeOutBounce') * .5 + c * .5 + b;
                break;

            default: 
                return t;

        }
    }
    else if (typeof value === "function") {
        return value(t);
    }

    return t;

}



/* Private for bezier */

export function _bezier(arr, t) {

    let [x1, y1, x2, y2] = arr;

    if (x1 === y1 && x2 === y2) {
        return t;
    }

    let val = [];
    for (let i = 0; i < 11; ++i) {
        val[i] = this._bezierCalc(i * .1, x1, x2);
    }

    if (t === 0) {
        return 0;
    }
    if (t === 1) {
        return 1;
    }

    return this._bezierCalc(this._bezierX(arr, t, val), y1, y2);

}

export function _bezierX(arr, t, val) {

    let [x1, y1, x2, y2] = arr;

    let start = 0,
        current = 1;

    for (; current !== 10 && val[current] <= t; ++current) {
        start += .1;
    }
    --current;

    let dist = (t - val[current]) / (val[current + 1] - val[current]),
        guessForT = start + dist * .1;

    let initialSlope = this._bezierSlope(guessForT, x1, x2);
    if (initialSlope >= 0.001) {
        return this._bezierNewtonRaphsonIterate(t, guessForT, x1, x2);
    }
    else if (initialSlope === 0.0) {
        return guessForT;
    }
    else {
        return this._bezierBinarySubdivide(t, start, start + .1, x1, x2);
    }

}

export function _bezierSlope(t, x1, x2) {
    return 3.0 * this._bezierA(x1, x2) * t * t + 2.0 * this._bezierB(x1, x2) * t + this._bezierC(x1);
}

export function _bezierNewtonRaphsonIterate(t, guessForT, x1, x2) {

    for (let i = 0; i < 4; ++i) {
        let currentSlope = this._bezierSlope(guessForT, x1, x2);
        if (currentSlope === 0.0) {
            return guessForT;
        }
        let currentX = this._bezierCalc(guessForT, x1, x2) - t;
        guessForT -= currentX / currentSlope;
    }

    return guessForT;
    
}

export function _bezierBinarySubdivide(t, a, b, x1, x2) {

    var currentX,
        currentT,
        i = 0;

    do{
        currentT = a + (b - a) / 2.0;
        currentX = this._bezierCalc(currentT, x1, x2) - t;
        if (currentX > 0.0) {
            b = currentT;
        }
        else {
            a = currentT;
        }
    }

    while (Math.abs(currentX) > 0.0000001 && ++i < 10);

    return currentT;

}

export function _bezierCalc(t, x1, x2) {
    return ((this._bezierA(x1, x2) * t + this._bezierB(x1, x2)) * t + this._bezierC(x1)) * t;
}

export function _bezierA(x1, x2) {
    return 1.0 - 3.0 * x2 + 3.0 * x1;
}

export function _bezierB(x1, x2) {
    return 3.0 * x2 - 6.0 * x1;
}

export function _bezierC(x1) {
    return 3.0 * x1;
}