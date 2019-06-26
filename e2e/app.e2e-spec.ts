import { NgPackagedPage } from './app.po';

import 'mocha';
import { element, by } from 'protractor';

describe('ng-packaged App', () => {
  let page: NgPackagedPage;

  beforeEach(() => {
    page = new NgPackagedPage();
  });

  afterEach(() => {
    page.navigateTo();
  });

  it('it should change language from pt to en', () => {
    page.navigateTo();

    element(by.css('.gtaskheading.gresource')).getText()
    .then(t=>{
      expect(t).toEqual('Resource');

      element(by.cssContainingText('option', 'pt')).click();

      return  element(by.css('.gtaskheading.gresource')).getText()
    })
    .then(t=>{
      expect(t).toEqual('Responsável');
    });
  });


});

