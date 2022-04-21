import { Easing } from 'easing-progress';
import * as Vevet from '../../../../src/ts/index';

const app = new Vevet.Application();

// create main timeline
const timeline = new Vevet.Timeline({
    easing: Easing.easeInOutBounce,
    duration: 1500,
});

app.pageLoad.onLoaded(() => {
    timeline.play();
});

// create nested timelines
const elements = document.querySelectorAll<HTMLElement>('.nested-timeline__item');
elements.forEach((el, index) => {
    const scopeStart = (1 / elements.length) * index;
    const tm = new Vevet.StaticTimeline({
        nestedScope: [scopeStart, 1],
        easing: Easing.easeOutBack,
    });
    tm.addCallback('progress', (data) => {
        el.style.transform = `scale(${data.easing}, 1)`;
    });
    timeline.addNestedTimeline(tm);
});

// controls
const playButton = document.querySelector('#timeline-play');
if (playButton) {
    playButton.addEventListener('click', () => {
        timeline.play();
    });
}
const pauseButton = document.querySelector('#timeline-pause');
if (pauseButton) {
    pauseButton.addEventListener('click', () => {
        timeline.pause();
    });
}
const reverseButton = document.querySelector('#timeline-reverse');
if (reverseButton) {
    reverseButton.addEventListener('click', () => {
        timeline.reverse();
    });
}

// range control
const rangeInput = document.querySelector<HTMLInputElement>('#timeline-range');
if (rangeInput) {
    timeline.progress = parseFloat(rangeInput.value);
    rangeInput.addEventListener('input', () => {
        timeline.progress = parseFloat(rangeInput.value);
    });
    timeline.addCallback('progress', (data) => {
        rangeInput.value = data.progress.toString();
    });
}
