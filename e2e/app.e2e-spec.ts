import { TripSorterPage } from './app.po';

describe('trip-sorter App', () => {
  let page: TripSorterPage;

  beforeEach(() => {
    page = new TripSorterPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
