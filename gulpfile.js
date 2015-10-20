var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");

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
      new webpack.optimize.UglifyJsPlugin()
    ]
  }, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
    }));
    callback();
  });
});
