var webpack = require("webpack");

module.exports = {
  devtool: "inline-source-map",
  resolve: {
    extensions: ["", ".js"]
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
  ]
};
