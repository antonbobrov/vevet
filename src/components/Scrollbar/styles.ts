import { body, doc } from '@/internal/env';

let style: HTMLStyleElement | null = null;

export function createScrollbarStyles(prefix: string) {
  if (style) {
    return style;
  }

  style = doc.createElement('style');
  body.appendChild(style);

  style.innerHTML = `
    .${prefix}-scrollable {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    .${prefix}-scrollable::-webkit-scrollbar {
      display: none;
      appearance: none;
      width: 0;
      height: 0;
    }

    .${prefix} {
      position: absolute;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.25s linear, visibility 0.25s linear;
    }

    .${prefix}.${prefix}_in-window {
      position: fixed;
      z-index: 9;
    }

    .${prefix}.${prefix}_inited {
      opacity: 1;
      visibility: visible;
    }

    .${prefix}.${prefix}_empty {
      opacity: 0;
      visibility: hidden;
    }

    .${prefix}.${prefix}_auto-hide {
      opacity: 0;
    }

    .${prefix}.${prefix}_auto-hide:hover,
    .${prefix}.${prefix}_auto-hide:active,
    .${prefix}.${prefix}_in-action {
      opacity: 1;
    }

    .${prefix}_y {
      top: 0;
      right: 0;
      width: 10px;
      height: 100%;
    }

    .${prefix}_x {
      bottom: 0;
      left: 0;
      width: 100%;
      height: 10px;
    }

    .${prefix}__track {
      position: relative;
      width: 100%;
      height: 100%;
      background: #ccc;
    }

    .${prefix}__thumb {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #333;
    }
  `;

  return style;
}
