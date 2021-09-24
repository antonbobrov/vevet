import * as Vevet from '../../../../src/ts/index';

new Vevet.Application();

const page = new Vevet.Page({
    name: 'page-instance',
});

page.create().then(() => {
    page.show().then(() => {
        page.hide().then(() => {
            page.destroy();
        });
    });
});
