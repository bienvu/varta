/*jslint indent: 2 */
"use strict";

var gulp = require("gulp"),
  sass = require("gulp-sass"),
  autoprefixer = require("gulp-autoprefixer"),
  sourcemaps = require("gulp-sourcemaps"),
  shell = require("gulp-shell"),
  browserSync = require("browser-sync"),
  reload = browserSync.reload,
  src = {
    scss: "../scss/**/*.scss",
    css: "../css",
    twigFile: "../pattern-lab/source/_**/**/*.twig",
    jsonFile: "../pattern-lab/source/_**/**/*.json",
    mdFile: "../pattern-lab/source/_**/**/*.md",
    latestChangeFile: "../pattern-lab/public/latest-change.txt",
    javascript: "../js/*.js",
    cssFile: "../css/*.css",
  };

// Build pattern-lab
gulp.task(
  "build",
  shell.task([
    "cd ../pattern-lab/; M | composer install --no-dev; cd ../.npm/;",
  ])
);

// Generate pattern-lab.
gulp.task(
  "pl-generate",
  shell.task(["php ../pattern-lab/core/console --generate"])
);

gulp.task("styles", function () {
  return gulp
    .src("../scss/**/{,*/}*.{scss,sass}")
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({ cascade: true }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(src.css));
});

gulp.task(
  "watch",
  gulp.parallel("styles", function () {
    gulp.watch(src.scss, gulp.series(["styles"]));
  })
);

gulp.task(
  "local-development",
  gulp.parallel(["styles", "pl-generate"], function () {
    browserSync({
      server: {
        baseDir: "../",
      },
    });

    gulp.watch(src.scss, gulp.series(["styles"]));
    gulp.watch(src.javascript, reload);
    gulp.watch(src.cssFile, reload);
    gulp.watch(src.twigFile, gulp.series(["pl-generate"]));
    gulp.watch(src.jsonFile, gulp.series(["pl-generate"]));
    gulp.watch(src.mdFile, gulp.series(["pl-generate"]));
    gulp.watch(src.latestChangeFile).on("change", reload);
  })
);

gulp.task("default", gulp.parallel("local-development"));
