'use strict';

require('babel-core/register');
const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  framework: 'jasmine2',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['specs.js'],
  SELENIUM_PROMISE_MANAGER: false,  
   onPrepare: function() {
   	jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));

    var AllureReporter = require('jasmine-allure-reporter');
    jasmine.getEnv().addReporter(new AllureReporter({
      resultsDir: 'allure-results'
    }));

    jasmine.getEnv().afterEach(function(done){
      browser.takeScreenshot().then(function (png) {
        allure.createAttachment('Screenshot', function () {
          return new Buffer(png, 'base64')
        }, 'image/png')();
        done();
      })
    });
  }
}