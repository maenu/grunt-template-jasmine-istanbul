module.exports = function(grunt) {
	grunt.initConfig({
		meta: {
			package: grunt.file.readJSON('package.json'),
			src: {
				main: 'src/main',
				test: 'src/test',
			},
			bin: {
				coverage: 'bin/coverage'
			}
		},
		nodeunit: {
			template: '<%= meta.src.test %>/js/template.js',
			reporter: '<%= meta.src.test %>/js/reporter.js'
		},
		jasmine: {
			coverage: {
				src: [],
				options: {
					specs: [],
					template: require('./src/main/js/template.js'),
					templateOptions: {
						coverage: '<%= meta.bin.coverage %>/coverage.json',
						report: '<%= meta.bin.coverage %>',
						template: 'node_modules/grunt-contrib-jasmine/tasks/jasmine/templates/DefaultRunner.tmpl'
					}
				}
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	
	grunt.registerTask('coverage', ['jasmine:coverage']);
};