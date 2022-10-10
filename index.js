require('ignore-styles');

require('@babel/register')({
  ignore: [/(node_modules)/],
  plugins: ['@babel/transform-runtime'],
  presets: ['@babel/preset-env', '@babel/preset-react'],
});

require('./server.js');
