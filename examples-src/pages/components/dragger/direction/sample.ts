import * as Vevet from '../../../../../src/ts/index';

new Vevet.Application();

const container = document.querySelector('#dragger-area')!;
const direction = container.querySelector('span')!;

const dragger = new Vevet.DraggerDirection({
    container,
});
dragger.addCallback('up', () => {
    direction.innerHTML = 'Up';
});
dragger.addCallback('down', () => {
    direction.innerHTML = 'Down';
});
dragger.addCallback('left', () => {
    direction.innerHTML = 'Left';
});
dragger.addCallback('right', () => {
    direction.innerHTML = 'Right';
});
