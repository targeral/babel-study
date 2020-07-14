const DemoBabelPlugin = (babel) => {
  const {types} = babel;

  return {
    visitor: {
      BinaryExpression(path) {
        console.log('here', path.node.operator);
        if (path.node.operator !== '===') {
          return;
        }

        path.node.left = types.identifier('hello');
        path.node.right = types.identifier('world');
      }
    }
  }
};

module.exports = DemoBabelPlugin;
