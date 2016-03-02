var gulp = require( 'gulp' );

module.exports = function () {
	var src = './wp-content/themes/' + process.env.THEME + '/',
		assets = './wp-content/assets/';

		watchers = [
			gulp.watch(
				[ src + 'scss/**/*.scss' ],
				[ 'scss-pipeline' ]
			),
			gulp.watch(
				[ assets + 'js/**/*.js' ],
				[ 'fingerprint-assets' ]
			)
		];

	watchers.forEach( function ( watcher ) {
		watcher.on( 'change', function ( event ) {
			console.log( 'File ' + event.path + ' was ' + event.type + ', running tasks...' );
		});
	} );
};
