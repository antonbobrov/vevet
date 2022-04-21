import * as Vevet from '../../../../src/ts/index';

new Vevet.Application();

const container = document.querySelector('#dragger-thumb') as HTMLElement;
let currentX = 0;
let currentY = 0;

const dragger = new Vevet.DraggerMove({
    container,
});
dragger.addCallback('start', () => {
    container.classList.add('is-dragging');
});
dragger.addCallback('move', (data) => {
    data.evt.preventDefault();
    currentX += data.step.x;
    currentY += data.step.y;
    render();
});
dragger.addCallback('end', () => {
    container.classList.remove('is-dragging');
    currentX = 0;
    currentY = 0;
    render();
});

function render () {
    container.style.transform = `translate(${currentX}px, ${currentY}px)`;
}
