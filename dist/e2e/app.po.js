"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var NgPackagedPage = /** @class */ (function () {
    function NgPackagedPage() {
    }
    NgPackagedPage.prototype.navigateTo = function () {
        return protractor_1.browser.get('/demo.html');
    };
    NgPackagedPage.prototype.getParagraphText = function () {
        return protractor_1.element(protractor_1.by.css('app-root h1')).getText();
    };
    NgPackagedPage.prototype.getById = function (id) {
        return protractor_1.element(protractor_1.by.id(id)).getText();
    };
    NgPackagedPage.prototype.getValueById = function (id) {
        return protractor_1.element(protractor_1.by.id(id)).getAttribute('value');
    };
    NgPackagedPage.prototype.sendKeys = function (id, val) {
        protractor_1.element(protractor_1.by.id(id)).sendKeys(val);
    };
    NgPackagedPage.prototype.submit = function () {
        protractor_1.element(protractor_1.by.id('submit')).click();
    };
    return NgPackagedPage;
}());
exports.NgPackagedPage = NgPackagedPage;
//# sourceMappingURL=app.po.js.map