"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uid = uid;
var index = 0;
/**
 * Generates a unique ID with an optional prefix.
 *
 * This function returns a string that combines a prefix (default is 'id') with a unique incrementing number.
 * It ensures each call will return a unique identifier.
 *
 * @group Utils
 *
 * @example
 * uid(); // => 'id_1'
 * uid('test'); // => 'test_2'
 * uid(0); // => '0_3'
 */
function uid(prefix) {
    if (prefix === void 0) { prefix = 'id'; }
    index += 1;
    return "".concat(prefix, "_").concat(index);
}
//# sourceMappingURL=uid.js.map