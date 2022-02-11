/* globals jasmine, window, __coverage__ */
/**
 * Reports the coverage results after the test have run.
 *
 * @module grunt-template-jasmine-istanbul
 * @class reporter
 */
(function () {
	var reporter = {
		/**
		 * Reports the coverage variable by dispatching a message to window.
		 *
		 * @method jasmineDone
		 * @return {void}
		 */
		jasmineDone: function () {
			if (typeof __coverage__ !== 'undefined' && __coverage__) {
				window.sendMessage('jasmine.coverage', __coverage__);
			}
		}
	};
	jasmine.getEnv().addReporter(reporter);
})();
