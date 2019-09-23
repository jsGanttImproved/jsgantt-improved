"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JSGantt = require("../index");
var chai_1 = require("chai");
var protractor_1 = require("protractor");
var dv = protractor_1.browser.driver;
describe('Initial test', function () {
    it('Import', function () {
        chai_1.expect(JSGantt).to.exist;
    });
    it('Import', function () {
        chai_1.expect(dv).to.exist;
    });
});
//# sourceMappingURL=index.js.map