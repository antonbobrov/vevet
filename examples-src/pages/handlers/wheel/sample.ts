import * as Vevet from '../../../../src/ts/index';

new Vevet.Application();

const area = document.querySelector('#wheel-area');
if (area) {
    // use wheel handler
    const handler = new Vevet.WheelHandler({
        container: area,
        stopPropagation: true,
    });
    // set events
    handler.addCallback('up', () => {
        area.innerHTML = 'up';
    });
    handler.addCallback('down', () => {
        area.innerHTML = 'down';
    });
    handler.addCallback('left', () => {
        area.innerHTML = 'left';
    });
    handler.addCallback('right', () => {
        area.innerHTML = 'right';
    });
}
