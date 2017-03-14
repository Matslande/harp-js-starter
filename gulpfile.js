var gulp        = require('gulp');
var harp        = require('harp');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var cp          = require('child_process');

/**
 * Serve the Harp Site
 */
gulp.task('serve', function () {
  harp.server(__dirname + '/src', {
    port: 9000
  }, function () {
    browserSync({
      proxy: "localhost:9000",
      open: true,
      /* Hide the notification. It gets annoying */
       notify: {
        styles: ['opacity: 0', 'position: absolute']
      }
    });
    /**
     * Watch for sass changes, tell BrowserSync to refresh main.css
     */
    gulp.watch(["src/**/*.sass", "src/**/*.scss"], function () {
      reload("main.css", {stream: true});
    });
    /**
     * Watch for all other changes, reload the whole page
     */
    gulp.watch(["src/**/*.ejs", "src/**/*.json", "src/**/*.md"], function () {
      reload();
    });
  });
});

/**
 * Build the Harp Site
 */
 gulp.task('build', function (done) {
   cp.exec('harp compile src dist', {stdio: 'inherit'})
     .on('close', done);
 });

 /**
  * Clean dist folder before deploying to gh-pages
  */
gulp.task('clean', function () {
  return gulp.src('dist', {read: false})
    .pipe(clean());
});

/**
 * Default task, running `gulp` will fire up the Harp site,
 * launch BrowserSync & watch files.
 */
gulp.task('default', ['serve']);
