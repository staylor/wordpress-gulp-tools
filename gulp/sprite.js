var gulp = require( 'gulp' ),
	gutil = require( 'gulp-util' ),
	gulpif = require( 'gulp-if' ),
	sprity = require( 'sprity' ),
	fs = require( 'fs' ),
	replace = require( 'replace' ),
	Q = require( 'q' ),
	del = require( 'del' ),
	through = require( 'through2' ),

	c = require( './color-log' ),
	fingerprint = require( './fingerprint-assets' ),

	spriteFile = 'sprites/sprite.png',
	spriteFileRegex = /\.\.\/images\/sprite\.png/g,
	THEME = './wp-content/themes/' + process.env.THEME + '/',
	SRC = THEME + 'images/**/*.png',
	DEST = './wp-content/assets/sprites/',
	SCSS_DEST = THEME + 'scss/';

function spritePromise( config ) {
	var deferred = Q.defer(), stream;

	gutil.log( c( 'Building:' ), config.style );

	stream = sprity.src( config )
	.on( 'error', function ( err ) {
		gutil.log( err );
		deferred.reject( err );
	} )
	.pipe( gulpif( '*.png', gulp.dest( DEST ), gulp.dest( SCSS_DEST ) ) )
	.pipe( through.obj( function () {
		this.emit( 'end' );
	} ) );

	stream.on( 'end', function () {
		deferred.resolve();
	} );

	return deferred.promise;
}

function mixinSprites() {
	return spritePromise( {
		src: SRC,
		style: '_sprite.scss',
		processor: 'sass',
		template: './gulp/sprite/scss.hbs',
		margin: 0
	} );
}

function cssSprites() {
	return spritePromise( {
		src: SRC,
		style: '_sprite-rules.scss',
		margin: 0
	} );
}

function saveRev() {
	var json = JSON.parse( fs.readFileSync( './wp-content/rev-manifest.json', 'utf8' ) ),
		rev;

	rev = '/wp-content/public/' + json[ spriteFile ];

	return replace({
		regex: spriteFileRegex,
		replacement: rev,
		paths: [ SCSS_DEST ],
		recursive: true,
		silent: true
	});
}

module.exports = function () {
	return del( DEST )
		.then( mixinSprites )
		.then( cssSprites )
		.then( fingerprint )
		.then( saveRev );
};