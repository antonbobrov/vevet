/* Type of animation */

function composite_elementary(prop, type) {

    // get the needed SettingStyle

    let styles;
    if (type === 'lineletter' || type === 'wordletter') {
        styles = prop.letter;
    }
    else if (type === 'lineword') {
        styles = prop.word;
    }

    // get parents
    let parents;
    if (type === 'lineletter' || type === 'lineword') {
        parents = this._el.lines.slice();
    }
    else if (type === 'wordletter') {
        parents = this._el.words.slice();
    }

    // if animation is to be reversed
    if (prop.reverseComposite) {
        parents.reverse();
    }

    // if the chain is to be chaotic

    if (prop.shuffle) {
        parents.sort(() => {
            return Math.random() - .5;
        });
    }

    // get animation information

    let info = composite_elementary_duration(Object.assign(prop, {
        styles: styles,
        type: type,
        parents: parents
    }), this._prop);

    return info;

}


function composite_elementary_getChildren(parent, data, prop) {

    // get children

    let children = [];

    if (data.type == 'lineletter') {
        if (prop.appendWords) {
            for (let i = 0; i < parent.children.length; i++) {
                let subChild = parent.children[i];
                for (let a = 0; a < subChild.children.length; a++) {
                    let child = subChild.children[a];
                    children.push(child);
                }
            }
        }
        else {
            children = parent.children;
        }
    }
    else if (data.type == 'lineword' || data.type == 'wordletter')  {
        children = parent.children;
    }

    // get amount

    let amount = children.length,
        el = children.slice();

    // copy elements
    el = el.slice();

    // if animation is to be reversed
    if (data.reverse) {
        el.reverse();
    }

    // if the chain is to be chaotic

    if (data.shuffle) {
        el.sort(() => {
            return Math.random() - .5;
        });
    }

    // return values

    return {
        amount: amount,
        el: el
    };

}

function composite_elementary_getParents(data) {

    // get amount

    let amount = data.parents.length,
        el = data.parents.slice();

    // return values

    return {
        amount: amount,
        el: el
    };

}



function composite_elementary_duration(data, prop) {

    // get parents
    let parents = composite_elementary_getParents(data);

    // get duration
    let duration = data.duration;

    // intervals of time
    let timelines = [];

    // calculate custom duration if auto

    if (data.durationAuto) {

        // calculate duration of children

        // full duration of all parents including elements inside with shifts
        let durationFull = 0;
        // all shifts between parents
        let shiftsFull = 0; 
        // durations of parents that include duration of all elements with shifts
        let parentsDuration = [];
        // children in parents
        let allChildren = [];

        for (let i = 0; i < parents.amount; i++) {

            // all children inside the line
            let children = composite_elementary_getChildren(parents.el[i], data, prop);
            // duration of children without shifts
            let childrenDurationFull = children.amount * data.durationElement;
            // all shifts between children
            let childrenShifts = (children.amount - 1) * data.shift * data.durationElement

            // get duration of children taking shifts into account
            let childrenDuration = childrenDurationFull - childrenShifts;

            // increase full duration without shifts
            durationFull += childrenDuration;
            // increase total shifts
            if (i > 0) {
                shiftsFull += childrenDuration * data.shiftLine;
            }

            // add informations to stack
            parentsDuration.push(childrenDuration);
            allChildren.push(children);
            
        }

        // calculate real duration
        duration = durationFull - shiftsFull;

        // get timelines

        for (let i = 0; i < parents.amount; i++) {

            // get starting point of time in line
            let startTimeLine = 0;
            for (let a = 0; a < i; a++) {
                startTimeLine += parentsDuration[a] - (parentsDuration[a] * data.shiftLine);
            }

            // calculate timelines of children
            for (let a = 0; a < allChildren[i].amount; a++) {
                let startTime = startTimeLine + data.durationElement * (1 - data.shift) * a,
                    endTime = startTime + data.durationElement;
                timelines.push({
                    start: startTime / duration,
                    end: endTime / duration,
                    el: allChildren[i].el[a]
                });
            }

        }

    }

    // calculate duration of each element if duration not auto

    else {

        // get duration of each parent
        let parentDuration = 1 / (parents.amount - data.shiftLine * (parents.amount - 1));

        // go thru all parents
        for (let i = 0; i < parents.amount; i++) {

            // get starting point in parent
            let parentStart = (parentDuration * (1 - data.shiftLine)) * i;

            // get children
            let children = composite_elementary_getChildren(parents.el[i], data, prop);
            
            // calculate duration of each child
            let childDuration = parentDuration / (children.amount - data.shift * (children.amount - 1));

            // set timelines of children
            for (let a = 0; a < children.amount; a++) {
                let start = parentStart + (childDuration * (1 - data.shift)) * a,
                    end = start + childDuration;
                timelines.push({
                    start: start,
                    end: end,
                    el: children.el[a]
                });
            }

        }

    }

    // return object of data

    return {
        duration: duration,
        timelines: timelines,
        styles: data.styles
    };

}



module.exports = composite_elementary;