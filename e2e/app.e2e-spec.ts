import { GoLPage } from './app.po';

describe('go-l App', function() {
  let page: GoLPage;

  beforeEach(() => {
    page = new GoLPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
