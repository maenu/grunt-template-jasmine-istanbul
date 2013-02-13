Code coverage template mix-in for grunt-contrib-jasmine, using istanbul
-----------------------------------------

## Installation

```
npm install grunt-template-jasmine-istanbul --save-dev
```

## Template Options

### templateOptions.coverage
Type: `String`
Mandatory.

The file path where to store the `coverage.json`.

### templateOptions.report
Type: `String`
Mandatory.

The directory path where to store the coverage report.

### templateOptions.template
Type: `String` `Object`
Default: jasmine's default template

The template to mix-in coverage.

### templateOptions.templateOptions
Type: `Object`
Default: `undefined`

The options to pass to the mixed-in template.

## Sample usage

```js
// Example configuration
grunt.initConfig({
	jasmine: {
		coverage: ['src/main/js/*.js'],
		options: {
			specs: ['src/test/js/*.js'],
			template: require('grunt-template-jasmine-istanbul'),
			templateOptions: {
				coverage: 'bin/coverage/coverage.json',
				report: 'bin/coverage',
			}
		}
	}
}
```
