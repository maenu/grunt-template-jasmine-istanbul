/* global __coverage__:true */
/**
 * Nodeunit tests for the basic template functionality.
 */

const grunt = require('grunt'),
	istanbul = require('istanbul');
const instrumenter = new istanbul.Instrumenter(),
	collector = new istanbul.Collector();

var jasmine;
var sandbox;

function MockJasmine () {
	this.reporters = [];
	this.Reporter = function Reporter () {};
	this.getEnv = function () {
		var self = this;
		return {
			addReporter: function (reporter) {
				self.reporters.push(reporter);
			}
		}
	};
}

function MockBrowser () {
	this.messages = [],
	this.sendMessage = function (event, data) {
		this.messages.push({
			event: event,
			data: data
		});
	};
}

exports.reporter = {
	'setUp': function (callback) {
		jasmine = new MockJasmine();
		sandbox = new MockBrowser();
		/* eslint-disable no-eval */
		// instrument and load reporter
		let window = sandbox;
		eval(instrumenter.instrumentSync(
				grunt.file.read('src/main/js/reporter.js'),
				'src/main/js/reporter.js'));
		/* eslint-enable no-eval */
		callback();
	},
	'tearDown': function (callback) {
		// write coverage data and delete instrumented template
		collector.add(__coverage__);
		grunt.file.write(grunt.config.process(
				'<%= meta.bin.coverage %>/coverage-reporter.json'),
				JSON.stringify(collector.getFinalCoverage()));
		callback();
	},
	'shouldNotDefineReporter': function (test) {
		test.throws(function () {
			return reporter; // eslint-disable-line no-undef
		}, ReferenceError, 'should not define reporter');
		test.done();
	},
	'shouldAddReporter': function (test) {
		test.strictEqual(jasmine.reporters.length, 1, 'should add 1 reporter');
		test.done();
	},
	'shouldSendMessageToSandbox': function (test) {
		var reporter = jasmine.reporters[0];
		reporter.jasmineDone();
		test.strictEqual(sandbox.messages.length, 1, 'should send message');
		var message = sandbox.messages[0];
		test.equal(message.event, 'jasmine.coverage',
				'should send jasmine.coverage event');
		test.strictEqual(message.data, __coverage__,
				'should send coverage data');
		test.done();
	},
	'shouldNotSendMessageToSandbox': function (test) {
		var oldCoverage = __coverage__;
		__coverage__ = undefined; // eslint-disable-line no-undefined
		var reporter = jasmine.reporters[0];
		reporter.jasmineDone();
		test.strictEqual(sandbox.messages.length, 0, 'should not send message');
		__coverage__ = oldCoverage;
		test.done();
	}
};
