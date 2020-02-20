/**
 * @description Get the name of your operating system.
 * 
 * @returns {string} Returns the name of the Operating System (windows|linux|macos|freebsd|unknown).
 * 
 * @memberof Vevet
 * 
 * @example 
 * 
 * Vevet.getOsName();
 * // => 'windows'
 */
function getOsName () {

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

export default getOsName;