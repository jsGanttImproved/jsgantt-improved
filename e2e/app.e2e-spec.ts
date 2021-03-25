import { NgPackagedPage } from './app.po';

import 'mocha';
import { element, by } from 'protractor';

describe('ng-packaged App', () => {
  let page: NgPackagedPage;

  beforeEach(() => {
    page = new NgPackagedPage();
    return page.navigateTo();
  });

  afterEach(() => {
    page.navigateTo();
  });

  it('it should change language from pt to en', () => {
    element(by.css('.gtaskheading.gres')).getText()
    .then(t=>{
      expect(t).toEqual('Resource');
      element(by.cssContainingText('option', 'pt')).click();
      return  element(by.css('.gtaskheading.gres')).getText()
    })
    .then(t=>{
      expect(t).toEqual('Responsável');
    });
  });
});

