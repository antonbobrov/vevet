/**
 * @typedef {object} Vevet.MediaSize
 * @property {HTMLElement} media
 * @property {number} width
 * @property {number} height
 * @property {number} mediaWidth
 * @property {number} mediaHeight
 * @property {number} x
 * @property {number} y
 */

/**
 * @description Get media sizes (images & videos).
 * 
 * @param {object} data - Settings.
 * @param {HTMLImageElement|HTMLVideoElement} data.media - Image or Video element.
 * @param {string} [data.size=cover] - Available values: cover, contain.
 * @param {number} [data.width=1000] - Container width.
 * @param {number} [data.height=1000] - Container height.
 * @param {number} [data.maxWidth=1000] - Max visible width of the element.
 * @param {number} [data.maxHeight=1000] - Max visible height of the element.
 * 
 * @returns {Vevet.MediaSize} Returns size values.
 * 
 * @memberof Vevet
 * 
 */
function getMediaSize (data) {

    // prop
    let prop = {
        media: false,
        size: 'cover',
        width: 1000,
        height: 1000,
        maxWidth: 1000,
        maxHeight: 1000
    };
    prop = Object.assign(prop, data);

    // variables
    let width = 0,
        height = 0,
        x = 0,
        y = 0,
        mediaWidth = 0,
        mediaHeight = 0;

    // get real sizes
    if (prop.media.tagName == 'VIDEO') {
        mediaWidth = prop.media.videoWidth;
        mediaHeight = prop.media.videoHeight;
    }
    else {
        mediaWidth = prop.media.width;
        mediaHeight = prop.media.height;
    }

    // cover sizes
    if (prop.size === 'cover') {

        width = prop.width;
        height = mediaHeight * width / mediaWidth;
        x = 0;
        y = (prop.height - height) / 2;

        if (height < prop.height) {
            height = prop.height;
            width = mediaWidth * height / mediaHeight;
            x = (prop.width - width) / 2;
            y = 0;  
        }

        if (prop.maxWidth !== prop.width || prop.maxHeight !== prop.height) {
            x = (prop.maxWidth - width) / 2;
            y = (prop.maxHeight - height) / 2;
        }

    }
    // cover sizes
    else if (prop.size === 'contain') {

        if (mediaWidth > mediaHeight) {
            width = prop.width;
            height = mediaHeight * width / mediaWidth;
            x = 0;
            y = (prop.height - height) / 2;
        }
        else if (mediaHeight >= mediaWidth) {

            height = prop.height;
            width = mediaWidth * height / mediaHeight;
            x = (prop.width - width) / 2;
            y = 0;  

        }

    }

    // return object
    return {
        media: prop.media,
        width: width,
        height: height,
        mediaWidth: mediaWidth,
        mediaHeight: mediaHeight,
        x: x,
        y: y
    }

}

export default getMediaSize;