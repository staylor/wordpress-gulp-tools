var gulp = require( 'gulp' ),
	gutil = require( 'gulp-util' ),
	rename = require( 'gulp-rename' ),
	Q = require( 'q' ),
	path = require( 'path' ),

	postcss = require( 'gulp-postcss' ),
	sass = require( 'gulp-sass' ),
	bless = require( 'gulp-bless' ),
	autoprefixer = require( 'autoprefixer' ),
	mqpacker = require( 'css-mqpacker' ),
	csswring = require( 'csswring' ),
	_ = require( 'underscore' ),
	c = require( './color-log' ),
	fingerprint = require( './fingerprint-assets' ),

	processors = [
		autoprefixer({
			browsers: [
				'Android >= 2.1',
				'Chrome >= 21',
				'Explorer >= 7',
				'Firefox >= 17',
				'Opera >= 12.1',
				'Safari >= 6.0'
			],
			cascade: false
		}),
		mqpacker
	],

	scssDir ='wp-content/themes/' + process.env.THEME + '/scss',

	SRC = path.join( scssDir, '*.scss' ),
	DEST = 'wp-content/assets/css';

function compileSCSS() {
	var stream, deferred = Q.defer();

	gutil.log( 'Compiling SCSS templates ...' );

	stream = gulp.src( SRC )
		.pipe( sass( {
			outputStyle: 'expanded'
		} ).on( 'error', sass.logError ) )
		.on( 'end', function () {
			gutil.log( 'Running', c( 'PostCSS' ) , 'tasks...' );
		})
		.pipe( postcss( processors ) )
		.pipe( gulp.dest( DEST ) )
		.on( 'end', function () {
			gutil.log( 'Saved to', DEST );
			gutil.log( 'Minifying...' );
		} )
		.pipe( postcss( [ csswring ] ) )
		.pipe( rename({ extname: '.min.css' }) )
		.pipe( gulp.dest( DEST ) )
		.on( 'end', function () {
			gutil.log( 'Saved to', DEST );
		} )
		.pipe( bless() )
		.pipe( rename( function ( path ) {
			path.basename = path.basename.replace( '.min', '' ) + '-ie';
			path.extname = '.min.css';
		} ) )
		.pipe( gulp.dest( DEST ) )
		.on( 'end', function () {
			gutil.log( 'Saved IE version to', DEST );
		} );

	stream.on( 'end', function () {
		deferred.resolve();
	} );

	return deferred.promise;
}

module.exports = function () {
	return compileSCSS().then( fingerprint );
};
