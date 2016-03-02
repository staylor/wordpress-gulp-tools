var gulp = require( 'gulp' ),
	watchers = require( './gulp/watchers' );

process.env.THEME = '__THEME_SLUG_GOES_HERE__';

gulp.task( 'sprite', require( './gulp/sprite' ) );

gulp.task( 'scss-pipeline', require( './gulp/sass' ) );

gulp.task( 'fingerprint-assets', require( './gulp/fingerprint-assets' ) );

gulp.task( 'build', require( './gulp/build' ) );

gulp.task( 'default', function () {
	watchers();
} );