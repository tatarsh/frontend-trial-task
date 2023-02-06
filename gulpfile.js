'use strict';

const {src, dest, parallel, series } = require('gulp')

const combiner = require('stream-combiner2').obj
const sass = require('gulp-sass')(require('node-sass'))
const notify = require('gulp-notify')
const rename = require('gulp-rename')
const gulpWatch = require('gulp-watch')
const webserver = require('gulp-webserver');

const paths = Object.freeze({
	styles: {
		src: 'src/app.scss',
		dest: 'dist/css'
	},
	assets: {
		src: 'src/assets/**/*.*',
		dest: 'dist/assets'
	}

})


function views(cb) {
	combiner(
		src('src/index.html'),
		dest('dist')
	).on('error', notify.onError())

	cb()
}

function styles() {
	return combiner(
		src(paths.styles.src),
		sass(),
		rename('app.min.css'),
		dest(paths.styles.dest)
	).on('error', notify.onError())
}

function assets() {
	return src(paths.assets.src)
		.pipe(dest(paths.assets.dest))
}

function serve(cb) {
	return src('./dist/').pipe(webserver({
			host: 'localhost',
			port: 3000,
			livereload: true,
			open: true,
			fallback: './dist/index.html'
		}));
}

function watch() {
	gulpWatch('src/**/*.html', series(views))
	gulpWatch('src/assets/**/*.scss', series(styles))
	gulpWatch(['src/assets/**/*.png', 'src/assets/**/*.svg'], series(assets))
}

const build = parallel(views, styles, assets)
const dev = series(build, serve, watch)

exports.views = views
exports.styles = styles
exports.assets = assets
exports.serve = serve
exports.watch = watch
exports.build = build
exports.dev = dev
exports.default = dev