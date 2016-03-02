var gulp = require( 'gulp' ),
	rev = require( 'gulp-rev' ),
	gutil = require( 'gulp-util' ),
	del = require( 'del' ),
	Q = require( 'q' ),
	path = require( 'path' ),
	c = require( './color-log' ),

	rootDir = path.dirname( __dirname ),
	assetsDir = path.join( rootDir, 'wp-content/assets' ),
	fingerprintDir = path.join( rootDir, 'wp-content/public' );

function fingerprintAssets() {
	var stream, deferred = Q.defer();

	stream = gulp.src( assetsDir + '/**/*' )
		.pipe( rev() )
		.on( 'end', function () {
			gutil.log( 'Fingerprinting assets...' );
		} )
		.pipe( gulp.dest( fingerprintDir ) )
		.on( 'end', function () {
			gutil.log( 'Assets saved in:', c( fingerprintDir ) );
		} )
		.pipe( rev.manifest({
			path: 'wp-content/rev-manifest.json'
		}) )
		.on( 'end', function () {
			gutil.log( 'Asset manifest created.' );
		} )
		.pipe( gulp.dest( rootDir ) )
		.on( 'end', function () {
			gutil.log( 'Asset manifest saved in:', c( rootDir ) );
		} )	;

	stream.on( 'end', function () {
		deferred.resolve();
	} );

	return deferred.promise;
}

module.exports = function () {
	return del( fingerprintDir ).then( fingerprintAssets );
};