import * as Vevet from '../../../../src/ts/index';

new Vevet.Application();

const container = document.querySelector('#v-split-text')!;
new Vevet.SplitText({
    container,
    appendLines: true,
    appendLetters: false,
});
