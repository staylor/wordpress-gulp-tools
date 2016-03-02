var runSequence = require( 'run-sequence' );

module.exports = function () {
	return runSequence(
		'sprite',
		'scss-pipeline'
	);
};
