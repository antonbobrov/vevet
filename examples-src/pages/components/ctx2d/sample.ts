import * as Vevet from '../../../../src/ts/index';

new Vevet.Application();

const container = document.querySelector('#ctx2d-container');
const ctx2d = new Vevet.Ctx2D({
    container: container || undefined,
    updateOnResize: true,
});

render();
ctx2d.addCallback('resize', () => {
    render();
});

updateData();
ctx2d.addCallback('resize', () => {
    updateData();
});

function render () {
    const { ctx, width, height } = ctx2d;
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.fillStyle = '#ccc';
    ctx.fillRect(width / 2, height / 2, width / 4, height / 4);
    ctx.closePath();
}

function updateData () {
    const dprEl = document.querySelector('#ctx2d-dpr');
    if (dprEl) {
        dprEl.innerHTML = `${ctx2d.dpr}`;
    }
    const widthEl = document.querySelector('#ctx2d-width');
    if (widthEl) {
        widthEl.innerHTML = `${ctx2d.width}`;
    }
    const heightEl = document.querySelector('#ctx2d-height');
    if (heightEl) {
        heightEl.innerHTML = `${ctx2d.width}`;
    }
}
