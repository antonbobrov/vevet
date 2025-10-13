export const cursorStyles = typeof window !== 'undefined' ? document.createElement('style') : null;
if (cursorStyles) {
    cursorStyles.innerHTML = '* { cursor: grabbing !important; }';
}
//# sourceMappingURL=styles.js.map