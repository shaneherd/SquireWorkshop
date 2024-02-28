import { SquireWebAppPage } from './app.po';

describe('squire-web-app App', () => {
  let page: SquireWebAppPage;

  beforeEach(() => {
    page = new SquireWebAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
