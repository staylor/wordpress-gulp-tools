var gutil = require( 'gulp-util' );

module.exports = function ( log, color ) {
	return gutil.colors[ color || 'yellow' ]( log );
};
