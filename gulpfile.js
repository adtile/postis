var gulp = require("gulp");
var gutil = require("gulp-util");
var eslint = require("gulp-eslint");
var watch = require("gulp-watch");
var batch = require("gulp-batch");
var Server = require("karma")
  .Server;
var webpack = require("webpack");
var connect = require("gulp-connect");

gulp.task("lint", function() {
  // ESLint ignores files with "node_modules" paths.
  // So, it"s best to have gulp ignore the directory as well.
  // Also, Be sure to return the stream from the task;
  // Otherwise, the task may end before the stream has finished.
  return gulp.src(["**/*.js", "!node_modules/**"])
    .pipe(watch("**/*.js"))
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError());
});


gulp.task("webpack", function(callback) {
  webpack({
    entry: "./src/index.js",
    output: {
      path: __dirname + "/dist",
      filename: "postis.js",
      library: "Postis",
      libraryTarget: "var"
    },
    plugins: [
      //new webpack.optimize.UglifyJsPlugin()
    ]
  }, function(err, stats) {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({}));
    callback();
  });
});

/**
 * Run test once and exit
 */
gulp.task("test", function(done) {
  new Server({
      configFile: __dirname + "/karma.conf.js",
      singleRun: true
    }, done)
    .start();
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task("tdd", function(done) {
  new Server({
      configFile: __dirname + "/karma.conf.js"
    }, done)
    .start();
});

gulp.task("connect", function() {
  connect.server({
    root: "."
  });
});

gulp.task("watch", function() {
  watch("src/*.js", function(events, done) {
    gulp.start("webpack", function() {});
  });
});

gulp.task("test-run-once", function(done) {
  connect.server({
    root: "."
  });
  webpack({
    entry: "./src/index.js",
    output: {
      path: __dirname + "/dist",
      filename: "postis.js",
      library: "Postis",
      libraryTarget: "var"
    },
    plugins: [
      //new webpack.optimize.UglifyJsPlugin()
    ]
  }, function(err, stats) {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({}));

    new Server({
        configFile: __dirname + "/karma.conf.js",
        singleRun: true
      }, function() {
        connect.serverClose();
        done();
      })
      .start();
  });
});

gulp.task("ci", ["test-run-once"]);
gulp.task("default", ["webpack", "connect", "tdd", "watch"]);
