const gulp = require('gulp');
const babel = require('gulp-babel');

const paths = {
  scripts: 'projects/**/main.js'
};

gulp.task('babel', () => {
  return gulp.src(paths.scripts)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['babel']);
});

gulp.task('default', ['watch']);