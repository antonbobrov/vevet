const moduleNamesProceeded = [];



exports.handlers = {

    beforeParse: function(e) {

        // Get Callbacks Info
        
        const regexp = /@vevetModuleCallback \{ (.*)\}/gi;
        const matches_array = e.source.match(regexp);
        if (Array.isArray(matches_array)) {

            matches_array.forEach(match => {

                let obj = {};

                let callbackString = match.replace(/ /g,'');
                callbackString = callbackString.replace("@vevetModuleCallback", "");
                callbackString = callbackString.replace("{", "");
                callbackString = callbackString.replace("}", "");

                const splitValue = callbackString.split(":");
                const classLongName = splitValue[0];
                const callbackName = splitValue[1];
                const callbackParamLongName = splitValue[2];

                obj = {
                    classLongName: classLongName,
                    callbackName: callbackName,
                    callbackParamLongName: callbackParamLongName
                };
    
                // Create Doclets
                e.source += create_Methods_Doclet(obj);

            });

        }

    }

};



// Create Methods Doclet
function create_Methods_Doclet(obj) {

    let extraDoc = ``;

    let extraDocVariation = '';
    const overlaps = getProceededModulesCount(obj.classLongName);
    if (overlaps > 0) {
        extraDocVariation = `@variation ${overlaps}`;
    }

    extraDoc += create_AddMethod_Doclet(obj, extraDocVariation);
    extraDoc += create_OnMethod_Doclet(obj, extraDocVariation);

    moduleNamesProceeded.push(obj.classLongName);

    return extraDoc;

}



// Create ADD-Method-Doclet
function create_AddMethod_Doclet(obj, extraDocVariation) {

    let str = ``;

    if (obj.callbackParamLongName.length > 0) {
        str += `
/**
 * @memberof ${obj.classLongName}
 * @callback _callback_${obj.callbackName}
 * @param {${obj.callbackParamLongName}} data
 */
/**
 * @memberof ${obj.classLongName}
 * @typedef {object} EventObj_${obj.callbackName}
 * @augments Vevet.Event.EventObj
 * 
 * @property {'${obj.callbackName}'} target The target of the callback. See possible values at the top.
 * @property {${obj.classLongName}._callback_${obj.callbackName}} do
 */
        `;
    }
    else {
        str += `
/**
 * @memberof ${obj.classLongName}
 * @typedef {object} EventObj_${obj.callbackName}
 * @augments Vevet.Event.EventObj
 * 
 * @property {'${obj.callbackName}'} target The target of the callback. See possible values at the top.
 */
        `;
    }

    str += `
/**
 * ${extraDocVariation}
 * @function ${obj.classLongName}#add
 * @memberof ${obj.classLongName}
 * @param {${obj.classLongName}.EventObj_${obj.callbackName}} data
 * @param {boolean} [bool=true]
 * 
 * @returns {string}
 */
    `;

    return str;

}



// Create ON-Method-Doclet
function create_OnMethod_Doclet(obj, extraDocVariation) {

    let str = ``;

    if (obj.callbackParamLongName.length > 0) {
        str += `
/**
 * ${extraDocVariation}
 * @function ${obj.classLongName}#on
 * @memberof ${obj.classLongName}
 * 
 * @param {'${obj.callbackName}'} target
 * @param {${obj.classLongName}._callback_${obj.callbackName}} callback
 * @param {Vevet.Event.EventObjSettings} [prop]
 * 
 * @returns {string}
 */
        `;
    }
    else {
        str += `
/**
 * ${extraDocVariation}
 * @function ${obj.classLongName}#on
 * @memberof ${obj.classLongName}
 * 
 * @param {'${obj.callbackName}'} target
 * @param {Function} callback
 * @param {Vevet.Event.EventObjSettings} [prop]
 * 
 * @returns {string}
 */
        `;
    }

    return str;

}



function getProceededModulesCount(classLongName) {

    let overlap = 0;
    moduleNamesProceeded.forEach(name => {
        if (name == classLongName) {
            overlap++;
        }
    });

    return overlap;

}