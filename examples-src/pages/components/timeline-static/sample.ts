import { Easing } from 'easing-progress';
import * as Vevet from '../../../../src/ts/index';

new Vevet.Application();

// get visualizer
const visualizerThumb = document.querySelector<HTMLElement>('#timeline-visualizer-thumb');

// create a timeline
const timeline = new Vevet.StaticTimeline({
    easing: Easing.easeInOutBounce,
});
timeline.addCallback('progress', (data) => {
    if (visualizerThumb) {
        visualizerThumb.style.left = `${data.easing * 100}%`;
    }
});

const rangeInput = document.querySelector<HTMLInputElement>('#timeline-range');
if (rangeInput) {
    timeline.progress = parseFloat(rangeInput.value);
    rangeInput.addEventListener('input', () => {
        timeline.progress = parseFloat(rangeInput.value);
    });
}
