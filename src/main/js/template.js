/* globals require, exports */
/**
 * Code coverage via istanbul.
 *
 * @module grunt-template-jasmine-istanbul
 * @class template
 */
var path = require('path');
var istanbul = require('istanbul');

var REPORTER = './node_modules/grunt-template-jasmine-istanbul/src/main/js/'
		+ 'reporter.js';
var DEFAULT_TEMPLATE = './node_modules/grunt-contrib-jasmine/tasks/jasmine/'
		+ 'templates/DefaultRunner.tmpl';

/**
 * Gets the istanbul reports created from the specified options.
 *
 * @private
 * @method getReports
 *
 * @param {Object} options The options describing the reports
 *
 * @return {Array} The istanbul reports created from the options
 */
var getReports = function (options) {
	var reports = [];
	if (typeof options == 'string' || options instanceof String) {
		// default to html report at options directory
		reports.push(istanbul.Report.create('html', {
			dir: options
		}));
	} else if (options instanceof Array) {
		// multiple reports
		for (var i = 0; i < options.length; i = i + 1) {
			var report = options[i];
			reports.push(istanbul.Report.create(report.type, report.options));
		}
	} else {
		// single report
		reports.push(istanbul.Report.create(options.type, options.options));
	}
	return reports;
};

/**
 * Instruments the sources, generates reports and cleans up after tests.
 *
 * @method process
 *
 * @param {Object} grunt The grunt object
 * @param {Object} task Provides utility methods to register listeners and
 *     handle temporary files
 * @param {Object} context Contains all options
 *
 * @return {String} The template HTML source
 */
exports.process = function (grunt, task, context) {
	// prepare reports
	var reports = getReports(context.options.report);
	// prepend coverage reporter
	context.scripts.reporters.unshift(REPORTER);
	// instrument sources
	var instrumenter = new istanbul.Instrumenter();
	var instrumentedSrc = [];
	context.scripts.src.forEach(function (src) {
		var tmpSrc = path.join(context.temp, src);
		grunt.file.write(tmpSrc, instrumenter.instrumentSync(
				grunt.file.read(src), src));
		instrumentedSrc.push(tmpSrc);
	});
	// replace sources
	if (context.options.replace == null || context.options.replace) {
		context.scripts.src = instrumentedSrc;
	}
	// listen to coverage event dispatched by reporter and write reports
	var collector = new istanbul.Collector();
	var coverageJson = context.options.coverage;
	task.phantomjs.on('jasmine.coverage', function (coverage) {
		grunt.file.write(coverageJson, JSON.stringify(coverage));
		collector.add(coverage);
		for (var i = 0; i < reports.length; i = i + 1) {
			reports[i].writeReport(collector, true);
		}
	});
	// use template options to mix in coverage
	var template = context.options.template;
	context.options = context.options.templateOptions || {};
	if (!template) {
		template = DEFAULT_TEMPLATE;
	}
	if (template.process) {
		return template.process(grunt, task, context);
	} else {
		return grunt.util._.template(grunt.file.read(template), context);
	}
};