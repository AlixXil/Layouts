let buildFolder = "build"
let sourceFolder = "src"

//пути до файлов
let path = {
  build: { // сборка проекта
    html: "./" + buildFolder + "/",
    css: "./" + buildFolder + "/css/",
    js: "./" + buildFolder + "/js/",
    img: "./" + buildFolder + "/img/",
    fonts: "./" + buildFolder + "/fonts/",
  },
  src: { //исходники
    html: "./" + sourceFolder + "/*.html",
    scss: "./" + sourceFolder + "/scss/style.scss",
    js: "./" + sourceFolder + "/js/script.js",
    img: "./" + sourceFolder + "/img/*", //.[jpg, png, svg, webp, ico]",
    fonts: "./" + sourceFolder + "/fonts/",
  },
  watch: { // отслеживание файлов
    html: "./" + sourceFolder + "/*.html",
    scss: "./" + sourceFolder + "/scss/*.scss",
    js: "./" + sourceFolder + "/js/*.js",
    img: "./" + sourceFolder + "/img/*",
  },
  clean: "./" + buildFolder + "/"
}

// плагины
let { src, dest, watch, series, parallel } = require('gulp'),
  del = require('del'),
  fileinclude = require('gulp-file-include'),
  browsersync = require('browser-sync').create(),
  scss = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  group_media = require('gulp-group-css-media-queries'),
  cleanCss = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify-es').default,
  imagemin = require('gulp-imagemin'),
  ttf2woff = require('gulp-ttf2woff'),
  ttf2woff2 = require('gulp-ttf2woff2'),
  fonter = require('gulp-fonter'),
  fs = require('fs'),
  webp = require('gulp-webp');

// обновление браузера
function browserSync() {
  browsersync.init({
    server: {
      baseDir: "./" + buildFolder + "/"
    },
    port: 3000,
    notify: false,
    open: false
  })
}

//обработка html файлов
function html() {
  return src(path.src.html)
    .pipe(fileinclude())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

//обработка scss файлов
function css() {
  return src(path.src.scss)
    .pipe(scss({ outputStyle: "expanded" }))
    .pipe(group_media())
    .pipe(autoprefixer({
      overrideBrowserslist: ["last 5 versions"],
      cascade: true
    }))
    .pipe(dest(path.build.css))
    .pipe(cleanCss())
    .pipe(rename({ extname: ".min.css" }))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}

//обработка js файлов
function js() {
  return src(path.src.js)
    .pipe(fileinclude())
    .pipe(uglify())
    .pipe(rename({ extname: ".min.js" }))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}

//обработка картинок
function images() {
  return src(path.src.img)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      interlaced: true,
      optimizationLevel: 3
    }))
    .pipe(dest(path.build.img))
    .pipe(webp())
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}

function fontsToBuild() {
  return src([path.src.fonts + '*.woff', path.src.fonts + '*.woff2'])
    .pipe(dest(path.build.fonts))
}

// очистка папки сборки
function clean() {
  return del(path.clean)
}

function watchFiles() {
  watch([path.watch.html], html)
  watch([path.watch.scss], css)
  watch([path.watch.js], js)
  watch([path.watch.img], images)
}


// вспомагательные функции
// конвертация шрифтов
function otf2ttf() {
  return src([sourceFolder + '/fonts/*.otf'])
    .pipe(fonter({ formats: ['ttf'] }))
    .pipe(dest(sourceFolder + '/fonts/'))
}

//обработка шрифтов
function fonts() {
  src(path.src.fonts + '*.ttf')
    .pipe(ttf2woff())
    .pipe(dest(path.src.fonts))
  return src(path.src.fonts + '*.ttf')
    .pipe(ttf2woff2())
    .pipe(dest(path.src.fonts))
}

// добавление шрифтов в стили
function fontStyle() {
  let file_content = fs.readFileSync(sourceFolder + '/scss/fonts.scss')
  if (file_content == '') {
    fs.writeFile(sourceFolder + '/scss/fonts.scss', '', cb)
    return fs.readdir(path.build.fonts, function(err, items) {
      if (items) {
        let c_fontname
        for (var i = 0; i < items.length; i++) {
          let fontname = items[i].split('.')
          fontname = fontname[0]
          if (c_fontname != fontname) {
            fs.appendFile(sourceFolder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb)
          }
          c_fontname = fontname
        }
      }
    })
  }
}

function cb() {}

exports.otf2ttf = otf2ttf
// подготовка шрифтов
exports.fonts = fonts
exports.fontStyle = fontStyle

exports.build = series(clean, parallel(html, css, js, images, fontsToBuild))
exports.default = series(clean, parallel(html, css, js, images, fontsToBuild), parallel(browserSync, watchFiles))