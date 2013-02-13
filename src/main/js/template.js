/**
 * Setup coverage via istanbul.
 *
 * @author Manuel Leuenberger
 */

var REPORTER = __dirname + '/reporter.js';
var DEFAULT_TEMPLATE = 'node_modules/grunt-contrib-jasmine/tasks/jasmine/'
		+ 'templates/DefaultRunner.tmpl';
var path = require('path');
var istanbul = require('istanbul');

exports.process = function (grunt, task, context) {
	var instrumenter = new istanbul.Instrumenter();
	var reporter = istanbul.Report.create('html', {
		dir: context.options.report
	});
	var collector = new istanbul.Collector();
	// prepend reporter
	context.scripts.reporters.unshift(REPORTER);
	// instrument sources
	var instrumentedSrc = [];
	context.scripts.src.forEach(function (src) {
		var tmpSrc = path.join(context.temp, src);
		grunt.file.write(tmpSrc, instrumenter.instrumentSync(
				grunt.file.read(src), src));
		instrumentedSrc.push(tmpSrc);
	});
	context.scripts.src = instrumentedSrc;
	// listen to coverage event dispatched by reporter added in helper
	var coverageJson = context.options.coverage;
	task.phantomjs.on('jasmine.coverage', function (coverage) {
		grunt.file.write(coverageJson, JSON.stringify(coverage));
		collector.add(coverage);
		reporter.writeReport(collector, true);
	});
	// use template option to mix in coverage
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