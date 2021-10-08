const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass")(require('sass'));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const htmlmin = require("gulp-htmlmin");
const terser = require("gulp-terser-js");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require('gulp-avif');
const svgstore = require("gulp-svgstore");
const concat = require("gulp-concat");
const order = require("gulp-order");
const sync = require("browser-sync").create();
const del= require("del");

// HTML
const html = () => {
  return gulp.src("source/**/*.html")
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("build"));
};
exports.html = html;

// Styles
const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(rename("styleControl.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
};
exports.styles = styles;

// Scripts
const scripts = () => {
  return gulp.src("source/js/*.js")
    .pipe(order([
      "_*.js",
      "*.js",
    ]))
    .pipe(concat("script.js"))
    .pipe(gulp.dest("build/js/"))
    .pipe(terser({
      mangle: {
        toplevel: true
      }
    }))
    .on('error', function (error) {
      this.emit('end')
    })
    .pipe(rename("script.min.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
}
exports.scripts = scripts;

// Images
const optimizeImages = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
  .pipe(imagemin([
    imagemin.mozjpeg({progressive: true}),
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.svgo()
  ]))
  .pipe(gulp.dest("build/img"))
};
exports.optimizeImages = optimizeImages;

// WebP
const createWebp = () => {
  return gulp.src("source/img/**/*.{jpg,png}")
  .pipe(webp({quality: 80}))
  .pipe(gulp.dest("build/img"))
};
exports.createWebp = createWebp;

// Avif
const createAvif = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
  .pipe(avif({quality: 80}))
  .pipe(gulp.dest('build/img'));
};
exports.createAvif = createAvif;

// Sprite
const sprite = () => {
return gulp.src("build/img/svg/sprite/*.svg")
.pipe(svgstore({
  inlineSvg: true
}))
.pipe(rename("sprite.svg"))
.pipe(gulp.dest("build/img/svg/"));
};
exports.sprite = sprite;

// Copy
const copy = (done) => {
  gulp.src([
    "source/fonts/*.{woff,woff2}",
    "source/*.{xml,png,ico,webmanifest}"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"))
  done();
};
exports.copy = copy;

// Server
const server = (done) => {
  sync.init({
    server: {
      baseDir: "build"
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};
exports.server = server;

// Reload
const reload = done => {
  sync.reload();
  done();
};

// Watcher
const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series(styles));
  gulp.watch("source/*.html", gulp.series(html, reload));
};

// Clean
const clean = () => {
  return del("build");
};
exports.clean = clean;

// simpleClean
const simpleClean = () => {
  return del(["build/css", "build/js", "build/index.html"]);
}
exports.clean = simpleClean;

// Build
const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    sprite,
    scripts,
    createWebp,
    createAvif
  ),
);
exports.build = build;

// Default
exports.default = gulp.series(
  simpleClean,
  gulp.parallel(
    styles,
    html,
    scripts,
  ),
  gulp.series(
    server,
    watcher
  )
);
