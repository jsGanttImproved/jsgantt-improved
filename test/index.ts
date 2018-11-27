
import * as JSGantt from '../index';
import { expect } from 'chai';
import { browser, by, element } from 'protractor';

const dv = browser.driver;

describe('Initial test', () => {
  it('Import', () => {
    expect(JSGantt).to.exist;
  });

  it('Import', () => {
    expect(dv).to.exist;
  });
});