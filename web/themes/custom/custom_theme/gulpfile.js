// Import required packages.
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-clean-css');

// Define file paths.
const paths = {
  scss:'./scss/**/*.scss',
  css: './css'
};

function compileSass() {
  return gulp.src([
    './scss/main.scss',
    './scss/blog.scss',
    './scss/todo.scss'
  ])
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.css));
}

// Watch SCSS changes.
function watchFiles() {
  gulp.watch(paths.scss, compileSass);
}

// Export tasks.
exports.sass = compileSass;
exports.default = gulp.series(compileSass, watchFiles);
