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
Type: `String | Object | Array`
Mandatory.

If a `String` is given, it will be used as the path where a HTML report is generated.
If an `Object` is given, it must have the properties `type` and `options`, where `type` is a `String` and `options` an `Object`.
`type` and `options` are used to create the report by passing it to `istanbul`s [`Report.create(type, options)`](http://gotwarlost.github.com/istanbul/public/apidocs/classes/Report.html).
For example, if you want to generate a Cobertura report at `bin/coverage/cobertura`, use this:

````js
report: {
	type: 'cobertura',
	options: {
		dir: 'bin/coverage/cobertura'
	}
}
````

If an `Array` is given, it must consist of `Object`s of the form just described.

### templateOptions.template
Type: `String | Object`
Default: jasmine's default template

The template to mix-in coverage.

### templateOptions.templateOptions
Type: `Object`
Default: `undefined`

The options to pass to the mixed-in template.

## Sample usage

Have a look at
[this example](https://github.com/maenu/grunt-template-jasmine-istanbul-example).

```js
// Example configuration
grunt.initConfig({
	jasmine: {
		coverage: {
			src: ['src/main/js/*.js'],
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
}
```
