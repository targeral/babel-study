const babel = require('@babel/core');
const {writeFileSync, createFileSync, removeSync} = require('fs-extra');
const DemoBabelPlugin = require('./plugins/demo');

babel.transformFile('./src/index.js', {
  presets: ["@babel/preset-react"],
  plugins: [
    [DemoBabelPlugin, {
      libraryName: {
        includes: '@byted-blocks'
      },
      // style(name) {
      //   console.log('style', name);
      //   const stylePath = `${name}/styles/index`;
      //   try {
      //     const style = require.resolve(stylePath);
      //     if (style) {
      //       return stylePath;
      //     }
      //   } catch(err) {
      //     return false;
      //   }
      // }
      style: true
    }]
  ]
}, (err, result) => {
  if (err) {
    throw err;
  }
  const {code, map, ast} = result;
  removeSync('dist/index.js');
  createFileSync('dist/index.js');
  writeFileSync('dist/index.js', code);
  // const astResult = babel.transformFromAst(ast);
  // console.log(astResult);
});
