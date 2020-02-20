/**
 * @description Get browser name.
 * 
 * @returns {string} Returns the name of yor browser (opera|firefox|safari|ie|edge|chrome|unknown).
 *
 * @memberof Vevet
 * @example 
 * 
 * Vevet.getBrowserName();
 * // => 'chrome'
 */
function getBrowserName () {

    let browser = '';

    // Opera 8.0+
    let isOpera = (!!window.opr && !!window.opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

    // Firefox 1.0+
    let isFirefox = typeof InstallTrigger !== 'undefined';

    // Safari 3.0+ "[object HTMLElementConstructor]" 
    let isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || window.safari.pushNotification);

    // Internet Explorer 6-11
    let isIE = /*@cc_on!@*/false || !!document.documentMode;

    // Edge 20+
    let isEdge = !isIE && !!window.StyleMedia;

    // Chrome 1+
    let isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    // Blink engine detection
    //let isBlink = (isChrome || isOpera) && !!window.CSS;

    if (isOpera) {
        browser = 'opera';
    }
    else if (isFirefox) {
        browser = 'firefox';
    }
    else if (isSafari) {
        browser = 'safari';
    }
    else if (isIE) {
        browser = 'ie';
    }
    else if (isEdge) {
        browser = 'edge';
    }
    else if (isChrome) {
        browser = 'chrome';
    }
    else{
        browser = 'unknown';
    }
    
    return browser;

}

export default getBrowserName;