const babel = require('babel-core');
const {writeFileSync, createFileSync, removeSync} = require('fs-extra');
const DemoBabelPlugin = require('./plugins/demo');

babel.transformFile('./src/index.js', {
  plugins: [DemoBabelPlugin]
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
