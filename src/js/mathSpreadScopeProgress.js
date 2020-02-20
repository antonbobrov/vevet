/**
 * @description Calculate scope timings for each element within one timeline.
 * 
 * @param {number} quantity - Elements quantity.
 * @param {number} shift -  Shift in animation chain between elements. 
 * F.e., if the shift is 0.2, then the animation of the second element will start after 80% of animation 
 * of the first element passed.
 * 
 * @returns {Array<Array<number>>} Returns a progress value.
 * 
 * @memberof Vevet
 */
function mathSpreadScopeProgress(quantity, shift) {

    let timelines = [];

    // get duration for each element
    let time = 1 / (quantity - shift * (quantity - 1));

    // calculate timelines
    for (let i = 0; i < quantity; i++) {
        let start = (time * (1 - shift)) * i,
            end = start + time;
        timelines.push([start, end]);
    }

    return timelines;

}

export default mathSpreadScopeProgress;