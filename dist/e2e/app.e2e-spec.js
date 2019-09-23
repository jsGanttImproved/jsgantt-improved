"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_po_1 = require("./app.po");
require("mocha");
var protractor_1 = require("protractor");
describe('ng-packaged App', function () {
    var page;
    beforeEach(function () {
        page = new app_po_1.NgPackagedPage();
    });
    afterEach(function () {
        page.navigateTo();
    });
    it('it should change language from pt to en', function () {
        page.navigateTo();
        protractor_1.element(protractor_1.by.css('.gtaskheading.gresource')).getText()
            .then(function (t) {
            expect(t).toEqual('Resource');
            protractor_1.element(protractor_1.by.cssContainingText('option', 'pt')).click();
            return protractor_1.element(protractor_1.by.css('.gtaskheading.gresource')).getText();
        })
            .then(function (t) {
            expect(t).toEqual('Responsável');
        });
    });
});
//# sourceMappingURL=app.e2e-spec.js.map