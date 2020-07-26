// import assert from 'assert';
const assert = require('assert');
// import Plugin from './Plugin';
const Plugin = require('./plugin');
const proxy = require('../utils/proxy');

module.exports = function ({ types }) {
  let plugins = null;

  function applyInstance(method, args, context) {
    // eslint-disable-next-line no-restricted-syntax
    for (const plugin of plugins) {
      if (plugin[method]) {
        plugin[method].apply(plugin, [...args, context]);
      }
    }
  }
  // 插件在执行前和执行之后所执行的
  const Program = {
    enter(path, { opts = {} }) {
      // Init plugin instances once.
      plugins = [
        new Plugin(
          opts.libraryName,
          opts.libraryDirectory,
          opts.style,
          opts.styleLibraryDirectory,
          opts.customStyleName,
          opts.camel2DashComponentName,
          opts.camel2UnderlineComponentName,
          opts.fileName,
          opts.customName,
          opts.transformToDefaultImport,
          types,
        ),
      ];

      // magic
      // const _plugin = plugins[0];
      // const predo = methods.reduce((o, key) => {
      //   o[key] = () => {
      //     console.log(`|===============${key}================|`);
      //   }
      //   return o;
      // }, {});
      // const plugin = proxy(_plugin, predo);
      // plugins = [plugin];
      applyInstance('ProgramEnter', arguments, this); // eslint-disable-line
    },
    exit() {
      applyInstance('ProgramExit', arguments, this); // eslint-disable-line
    },
  };

  const methods = [
    'ImportDeclaration',
    // 'ImportDefaultSpecifier',
    // 'CallExpression',
    // 'MemberExpression',
    // 'Property',
    // 'VariableDeclarator',
    // 'ArrayExpression',
    // 'LogicalExpression',
    // 'ConditionalExpression',
    // 'IfStatement',
    // 'ExpressionStatement',
    // 'ReturnStatement',
    // 'ExportDefaultDeclaration',
    // 'BinaryExpression',
    // 'NewExpression',
    // 'ClassDeclaration',
  ];

  const ret = {
    visitor: { Program },
  };

  // eslint-disable-next-line no-restricted-syntax
  for (const method of methods) {
    ret.visitor[method] = function () {
      // eslint-disable-line
      applyInstance(method, arguments, ret.visitor); // eslint-disable-line
    };
  }

  return ret;
}
