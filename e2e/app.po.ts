import { browser, by, element } from 'protractor';

export class NgPackagedPage {
  navigateTo() {
    return browser.get('/demo.html');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }

  getById(id) {
    return element(by.id(id)).getText();
  }

  getValueById(id) {
    return element(by.id(id)).getAttribute('value');
  }

  sendKeys(id, val) {
    element(by.id(id)).sendKeys(val);
  }

  submit() {
    element(by.id('submit')).click();
  }
}
