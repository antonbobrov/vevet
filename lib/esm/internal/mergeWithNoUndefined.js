export function mergeWithNoUndefined(source, add) {
    const addKeys = Object.keys(add);
    const addNonUndefinedKeys = addKeys.filter((key) => add[key] !== undefined);
    const newAdd = addNonUndefinedKeys.reduce((acc, key) => {
        acc[key] = add[key];
        return acc;
    }, {});
    return Object.assign(Object.assign({}, source), newAdd);
}
//# sourceMappingURL=mergeWithNoUndefined.js.map