import * as Vevet from '../../../../src/ts/index';

new Vevet.Application();

const frame = new Vevet.AnimationFrame({
    fps: 60,
}, false);
frame.addResponsiveProp({
    breakpoint: 'd',
    settings: {
        fps: 60,
    },
});
frame.addResponsiveProp({
    breakpoint: 't',
    settings: {
        fps: 30,
    },
});
frame.addResponsiveProp({
    breakpoint: 'm',
    settings: {
        fps: 10,
    },
});
frame.init();

// get interactive elements
const prevTimeEl = document.querySelector('#animation-frame-prev-time');
const targetFPSEl = document.querySelector('#animation-frame-target-fps');
const realFPSEl = document.querySelector('#animation-frame-real-fps');
const playButton = document.querySelector<HTMLButtonElement>('#animation-frame-play');
const pauseButton = document.querySelector<HTMLButtonElement>('#animation-frame-pause');

// set events
if (playButton) {
    playButton.addEventListener('click', () => {
        frame.play();
    });
}
if (pauseButton) {
    pauseButton.addEventListener('click', () => {
        frame.pause();
    });
}

// set animation callbacks
frame.addCallback('frame', (data) => {
    if (prevTimeEl) {
        prevTimeEl.innerHTML = `${data.prevFrameDuration}`;
    }
    if (targetFPSEl) {
        targetFPSEl.innerHTML = `${data.fps}`;
    }
    if (realFPSEl) {
        realFPSEl.innerHTML = `${data.realFPS}`;
    }
});
frame.play();
