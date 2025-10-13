let style = null;
export function createCursorStyles(prefix) {
    if (style) {
        return style;
    }
    style = document.createElement('style');
    document.body.appendChild(style);
    style.innerHTML = `
    .${prefix}-container.${prefix}-hide-default,
    .${prefix}-container.${prefix}-hide-default * {
      cursor: none;
    }

    .${prefix} {
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      z-index: 999;
      pointer-events: none;

      transition: opacity 0.25s;
      opacity: 0;

      --cursor-w: 50px;
      --cursor-h: 50px;
    }
    
    .${prefix}-in-window {
      position: fixed;
    }
      
    .${prefix}-visible {
      opacity: 1;
    }

    .${prefix}-disabled {
      opacity: 0;
    }

    .${prefix}__inner {
      position: relative;
      width: var(--cursor-w);
      height: var(--cursor-h);
      margin-left: calc(var(--cursor-w) / -2);
      margin-top: calc(var(--cursor-h) / -2);

      background-color: rgba(0, 0, 0, 0.25);

      transition: transform 0.25s;
    }

    .${prefix}__inner > * {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: scale(0.75) translate(-62.5%, -62.5%);
      opacity: 0;
      transition: opacity 0.25s linear, transform 0.25s linear;
    }

    .${prefix}__inner > *.active {
      opacity: 1;
      transform: scale(1) translate(-50%, -50%);
    }
  `;
    return style;
}
//# sourceMappingURL=styles.js.map