const Plugin = require('./plugin');

let paramName;

const DemoBabelPlugin = (babel) => {
  const {types} = babel;
  let plugins = null;

  // 插件在执行前和执行之后所执行的
  const Program = {
    enter(path, { opts = {} }) {
      console.log('opts', path);
      if (!plugins) {
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
      }
      // applyInstance('ProgramEnter', arguments, this); // eslint-disable-line
    },
    exit() {
      // applyInstance('ProgramExit', arguments, this); // eslint-disable-line
    },
  };

  return {
    visitor: {
      ReferencedIdentifier(path) {
        console.log('ReferencedIdentifier', path.node.name);
      },
      Identifier(path) {
        // console.log("Called!", path.node.name);
      },
      FunctionDeclaration(path) {
      }
      // BinaryExpression(path) {
      //   console.log('here', path.node.operator);
      //   if (path.node.operator !== '===') {
      //     return;
      //   }

      //   path.node.left = types.identifier('hello');
      //   path.node.right = types.identifier('world');
      // },
      // Program
    }
  }
};

module.exports = DemoBabelPlugin;
