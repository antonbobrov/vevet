/* Type of animation */

function elementary(prop, type) {
    
    // get elements

    let el;
    if (type === 'letter') {
        el = this._el.letters;
    }
    else if (type === 'word') {
        el = this._el.words;
    }
    else {
        el = this._el.lines;
    }

    // get the needed SettingStyle

    let styles;
    if (type === 'letter') {
        styles = prop.letter;
    }
    else if (type === 'word') {
        styles = prop.word;
    }
    else {
        styles = prop.line;
    }

    // copy elements

    el = el.slice();

    // if animation is to be reversed
    if (prop.reverse) {
        el.reverse();
    }

    // if the chain is to be chaotic

    if (prop.shuffle) {
        el.sort(() => {
            return Math.random() - .5;
        });
    }

    // if the chain must start from center

    if (prop.center) {
       
        let centerNums = [];

        // if odd or even // if one or two elements in the center 

        let centerNum = Math.ceil(el.length / 2) - 1;
        if (el.length % 2 == 0) {
            centerNums = [centerNum, centerNum + 1];
        }
        else {
            centerNums = [centerNum];
        }

        // create new array of elements // in the center at first

        let elNew = [],
            start = centerNums[0],
            end = centerNums[0];

        if (centerNums.length === 1) {
            elNew.push(el[centerNums[0]]);
        }
        else {
            elNew.push([
                el[centerNums[0]],
                el[centerNums[1]]
            ]);
            end = centerNums[1];
        }

        // how much elements are left?

        let elementsLeft = (el.length - centerNums.length) / 2;
        for(let i = 1; i <= elementsLeft; i++) {
            let arr = [];
            arr.push(el[end + i]);
            arr.push(el[start - i]);
            elNew.push(arr);
        }

        el = elNew;

    }

    // get animation information

    let info = this._animationInfo(Object.assign(prop, {
        el: el,
        styles: styles,
        type: type
    }));

    return info;

}



module.exports = elementary;