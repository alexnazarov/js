const gulp = require('gulp');
const babel = require('gulp-babel');

const paths = {
  scripts: 'js/*.js'
};

gulp.task('babel', () => {
  return gulp.src(paths.scripts)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('js/dist/'));
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['babel']);
});