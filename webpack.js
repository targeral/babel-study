const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');

const complier = webpack(config);
const devServerOptions = Object.assign({},{}, {
  open: true,
  stats: {
    colors: true,
  },
});

const devServer = new WebpackDevServer(complier);
devServer.listen(8080, '127.0.0.1', () => {
  console.log('Starting server on http://localhost:8080');
});
