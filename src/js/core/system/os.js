/**
 * @description Get operating system name.
 * 
 * @returns {string} Returns the aname of OS (windows|linux|macos|freebsd|unknown).
 * 
 * @memberof Vevet.utils
 * @alias Vevet.utils.osGet
 * 
 * @example 
 * 
 * Vevet.utils.osGet();
 * // => 'windows'
 */
export function osGet () {

    let os = '';

    if (navigator.userAgent.indexOf("Windows") !== -1) {
        os = "windows";
    }
    else if (navigator.userAgent.indexOf("Linux") !== -1) {
        os = "linux";
    }
    else if (navigator.userAgent.indexOf("Mac") !== -1) {
        os = "macos";
    }
    else if (navigator.userAgent.indexOf("FreeBSD") !== -1) {
        os = "freebsd";
    }
    else {
        os = "unknown";
    }
    
    return os;

}