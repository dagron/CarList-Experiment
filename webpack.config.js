module.exports = {
    entry: ["babel-polyfill", "./src/main.js"],
    output: {
        path: __dirname + '/dist/',
        filename: "bundle.js"
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015', 'stage-2']
          }
        }
      ]
    }
};
