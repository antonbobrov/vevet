import * as Vevet from '../../../../src/ts/index';

new Vevet.Application();

const page = new Vevet.Page({
    name: 'page-instance',
});

page.create();
page.show();
page.hide();
page.destroy();
