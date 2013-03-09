/**
 * Nodeunit tests for the basic template functionality.
 *
 * @author Manuel Leuenberger
 */

var grunt = require('grunt');

exports['integration'] = {
	'shouldTransitTemplateOptions': function (test) {
		var file = grunt.config.get(
				'jasmine.integration.options.templateOptions.coverage');
		test.ok(grunt.file.exists(file), 'should have written coverage.json');
		var coverage = grunt.file.readJSON(file);
		test.ok(coverage['integration-helper'],
				'should have added helper to coverage');
		test.done();
	},
	'report': {
		'shouldWriteCoverage': function (test) {
			var file = grunt.config.get(
					'jasmine.integration.options.templateOptions.coverage');
			test.ok(grunt.file.exists(file), 'should write coverage.json');
			test.done();
		},
		'shouldWriteReport': function (test) {
			var file = grunt.config.get(
					'jasmine.integration.options.templateOptions.report')
					 + '/index.html';
			test.ok(grunt.file.exists(file), 'should write index.html');
			test.done();
		}
	}
};