const gulp = require("gulp");
const connect = require("gulp-connect");
const concat = require("gulp-concat");
const del = require("del");
const uglify = require("gulp-uglify-es").default;
const sass = require("gulp-sass");
const cleanCSS = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const runSequence = require("run-sequence");
const inject = require('gulp-inject');
const jshint = require('gulp-jshint');

const JS_FILES = [
  "./node_modules/moment/moment.js",
  "./src/js/canvasState.js",
  "./src/js/clock.js",
  "./src/js/app.js"
];

const PATH = {
  src: {
    js: "./src/js/**.js",
    css: "./src/sass/**.scss",
    html: "./src/*.html"
  },
  dev: {
    js: "./src/dev/js",
    css: "./src/dev/css",
    html: "./src/dev"
  },
  prod: {
    js: "dist/js",
    css: "dist/css",
    html: "dist"
  }
};

gulp.task("build-js-dev", function () {
  gulp
    .src(JS_FILES)
    .pipe(sourcemaps.init())
    .pipe(concat("app.min.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(PATH.dev.js))
    .pipe(connect.reload());
});

gulp.task("build-js-prod", function () {
  gulp
    .src(JS_FILES)
    .pipe(concat("app.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest(PATH.prod.js));
});



gulp.task("build-css-dev", function () {
  gulp
    .src(PATH.src.css)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(concat("style.min.css"))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(PATH.dev.css))
    .pipe(connect.reload());
});
gulp.task("build-css-prod", function () {
  gulp
    .src(PATH.src.css)
    .pipe(sass().on("error", sass.logError))
    .pipe(concat("style.min.css"))
    .pipe(cleanCSS())
    .pipe(gulp.dest(PATH.prod.css));
});


gulp.task("copy-html", function () {
  gulp
    .src(PATH.src.html)
    .pipe(rename("index.html"))
    .pipe(gulp.dest(PATH.prod.html))
});

gulp.task("connect", function () {
  connect.server({
    root: "src",
    livereload: true,
    port: 8080
  });
});

gulp.task("clean", function () {
  del(["dist", './src/dev']);
});



gulp.task("watch", function () {
  gulp.watch(PATH.src.html, connect.reload());
  gulp.watch(PATH.src.js, ["build-js-dev"]);
  gulp.watch(PATH.src.css, ["build-css-dev"]);
});



gulp.task('jshint', function () {
  return gulp.src(PATH.src.js)
    .pipe(jshint())
});


gulp.task("build", function () {
  runSequence("clean", ["build-js-dev", "build-css-dev"]);
});
gulp.task("build-prod", function () {
  runSequence("clean", ["build-js-prod", "build-css-prod"], 'copy-html');
});

gulp.task("default", function () {
  runSequence("build", "connect", "watch");
});