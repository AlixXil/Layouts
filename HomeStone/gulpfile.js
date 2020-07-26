//настрока для обновления браузера
const browserSyncConfig = {
	server: {
		baseDir: './build'
	},
	host: 'localhost',
	open: 'external',
	port: 3000,
	logPrefix: "server"
};
// пути к фалам
const path = {
	build: {
		html: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		img: 'build/img/',
		fonts: 'build/fonts/',
		libs: 'build/libs/'
	},
	src: {
		html: 'src/*.html',
		pug: 'src/*.pug',
		js: [
			'src/js/main.js', 		//сперва берем main.js 
			'src/js/*.js'					//далее все остальные по алфавиту
		],
		scss: 'src/scss/*.scss',	// sttyle.scss - главный файл стилей
		img: 'src/img/**/*.*',
		fonts: 'src/fonts/**/*.*',
		libs: 'src/libs/**/*.*'
	},
	watch: {
		html: 'src/*.html',
		pug: ['src/*.pug', 'src/_partianHtml/*.pug', 'src/layout/*.pug'],
		js: 'src/js/*.js',
		// sass: 'src/sass/*.sass',
		scss: 'src/scss/*.scss',
		// css: 'src/css/*.css',
		img: 'src/img/**/*.*',
		fonts: 'src/fonts/**/*.*'
	},
	clean: './build/*'
};

// модули
const { src, dest, watch, parallel, series } = require('gulp'),
	pug = require('gulp-pug'),
	sass = require('gulp-sass'),
	browser_sync = require('browser-sync').create(),
	concat = require('gulp-concat'),
	del = require('del'),
	cleanCss = require('gulp-clean-css'),
	uglify = require('gulp-uglify'),
	prefix = require('gulp-autoprefixer'),
	browsersList = require('browserslist');

// задачи

// browser-sync
function bs() {
	browser_sync.init(browserSyncConfig);
}

// собираем pug файлы
function html_pug() {
	return src(path.src.pug)
	.pipe(pug())
	.pipe(dest(path.build.html))
	.pipe(browser_sync.stream());
}

// собираем html файлы 
function html() {
	return src(path.src.html)
	.pipe(dest(path.build.html));
}

// собираем scss файлы
function scssToCss() {
	return src(path.src.scss)
	.pipe(sass())
	.pipe(prefix({
		browsersList,
		cascade: false
	}))
	.pipe(cleanCss({compatibility: 'ie8'}))
	.pipe(dest(path.build.css))
	.pipe(browser_sync.stream());
}
// собираем scss файлы dev
function scssToCss_dev() {
	return src(path.src.scss)
	.pipe(sass())
	.pipe(dest(path.build.css))
	.pipe(browser_sync.stream());
}

// собираем js файлы
function js() {
	return src(path.src.js)
	.pipe(concat('script.js'))
	.pipe(uglify())
	.pipe(dest(path.build.js))
	.pipe(browser_sync.stream());
}
// собираем js файлы dev
function js_dev() {
	return src(path.src.js)
	.pipe(concat('script.js'))
	.pipe(dest(path.build.js))
	.pipe(browser_sync.stream());
}
// собираем шрифты
function fonts() {
	return src(path.src.fonts)
	.pipe(dest(path.build.fonts));
}
// собираем картинки
function images() {
	return src(path.src.img)
	.pipe(dest(path.build.img));
}
// собираем библиотеки
function libs() {
	return src(path.src.libs)
	.pipe(dest(path.build.libs));
}

//watch
function watchFiles() {
	bs();
	
	watch(path.watch.html, html);
	watch(path.watch.pug, html_pug);
	watch(path.watch.scss, scssToCss_dev);
	watch(path.watch.js, js_dev);

	watch(path.watch.html).on('change', browser_sync.reload);
}
// очистка проекта
function clean() {
	return del(path.clean);
}


// экпорт 
exports.clean = clean;
exports.build = series(clean, parallel(scssToCss, html, html_pug, js, fonts, images, libs));
exports.build_dev = series(clean, parallel(scssToCss_dev, html, html_pug, js_dev, fonts, images, libs));
exports.default = series(exports.build_dev, watchFiles);