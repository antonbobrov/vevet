import { Easing } from 'easing-progress';
import * as Vevet from '../../../../src/ts/index';

new Vevet.Application();

// get visualizer
const visualizerThumb = document.querySelector<HTMLElement>('#timeline-visualizer-thumb');

// create a timeline
const timeline = new Vevet.Timeline({
    duration: 2000,
    easing: Easing.easeOutBounce,
});
timeline.addCallback('progress', (data) => {
    if (visualizerThumb) {
        visualizerThumb.style.left = `${data.easing * 100}%`;
    }
});
timeline.play();

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
