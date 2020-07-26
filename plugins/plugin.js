const {join, resolve} = require('path');
const {exists, existsSync, writeFileSync} = require('fs-extra');
const { addSideEffect, addDefault, addNamed} = require('@babel/helper-module-imports');
const paths = [];
function transCamel(_str, symbol) {
  const str = _str[0].toLowerCase() + _str.substr(1);
  return str.replace(/([A-Z])/g, $1 => `${symbol}${$1.toLowerCase()}`);
}

function winPath(path) {
  return path.replace(/\\/g, '/');
}

function normalizeCustomName(originCustomName) {
  // If set to a string, treat it as a JavaScript source file path.
  if (typeof originCustomName === 'string') {
    // eslint-disable-next-line import/no-dynamic-require
    const customNameExports = require(originCustomName);
    return typeof customNameExports === 'function' ? customNameExports : customNameExports.default;
  }

  return originCustomName;
}


function getPackageJson(path) {
  let pkgPath = '';
  let pkgJson = {};

  try {
    pkgPath = require.resolve(`${path}/package.json`);
    pkgJson = existsSync(pkgPath) && require(pkgPath) || {};
  } catch (err) {
    pkgJson = {};
  }

  return pkgJson;
}

function getStylePath(path) {
  let styleCssPath = '';
  let styleJsPath = '';

  try {
    styleCssPath = require.resolve(`${path}/dist/styles/index.css`);
    styleJsPath = require.resolve(`${path}/dist/styles/index.js`);
  } catch (err) {
    return styleCssPath ? `${path}/dist/styles/index.css`: '';
  }

  return styleJsPath ? `${path}/dist/styles/index.js` : '';
}

function isBlockComponentPackage(path) {
  const pkg = getPackageJson(path);
  return (
    pkg.meta &&
    pkg.meta.type &&
    String(pkg.meta.type).toLowerCase() === 'block'
  );
}

module.exports = class Plugin {
  constructor(
    libraryName,
    libraryDirectory,
    style,
    styleLibraryDirectory,
    customStyleName,
    camel2DashComponentName,
    camel2UnderlineComponentName,
    fileName,
    customName,
    transformToDefaultImport,
    types,
    index = 0,
  ) {
    this.libraryName = libraryName;
    this.libraryDirectory = typeof libraryDirectory === 'undefined' ? 'dist' : libraryDirectory;
    this.camel2DashComponentName =
      typeof camel2DashComponentName === 'undefined' ? true : camel2DashComponentName;
    this.camel2UnderlineComponentName = camel2UnderlineComponentName;
    this.style = style || false;
    this.styleLibraryDirectory = styleLibraryDirectory;
    this.customStyleName = normalizeCustomName(customStyleName);
    this.fileName = fileName || '';
    this.customName = normalizeCustomName(customName);
    this.transformToDefaultImport =
      typeof transformToDefaultImport === 'undefined' ? true : transformToDefaultImport;
    this.types = types;
    this.pluginStateKey = `importPluginState${index}`;
  }

  getPluginState(state) {
    if (!state[this.pluginStateKey]) {
      state[this.pluginStateKey] = {}; // eslint-disable-line
    }
    return state[this.pluginStateKey];
  }

  importStyleMethod(componentName, stylePath, file, pluginState) {
    if (!pluginState.selectedComponentName[componentName]) {
      pluginState.selectedComponentName[componentName] = stylePath;
      paths.push(stylePath);
      addSideEffect(file.path, stylePath);
    }
  }
  // ===============
  // 从这里分开，以上是内部使用方法，一下是visitor实际会调用的方法

  ProgramEnter(path, state) {
    const pluginState = this.getPluginState(state);
    pluginState.selectedComponentName = Object.create(null);
  }

  ProgramExit(path, state) {
    writeFileSync('style.js', paths.toString());
    // process.exit(222)
    // this.getPluginState(state).pathsToRemove.forEach(p => !p.removed && p.remove());

  }

  // 第一步
  // ImportDeclaration（import声明）
  // 这里做了分析以及初始化state
  ImportDeclaration(path, state) {
    const { node } = path;
    const file = (path && path.hub && path.hub.file) || (state && state.file);

    // path maybe removed by prev instances.
    if (!node) return;

    const { value } = node.source;
    const { types } = this;
    const pluginState = this.getPluginState(state);

    // 检查是否是block component
    console.log('value', value);
    const isBlockComponent = isBlockComponentPackage(value);

    // 如果不是block component，则跳过
    if (!isBlockComponent) return;

    // 检查是否有styles, styles/index.js, styles/index.css

    const stylePath = getStylePath(value);

    // 如果没有styles目录, 以及styles/index.js 或者 styles/index.css, 则跳过
    if (!stylePath) return;

    node.specifiers.forEach(spec => {
      this.importStyleMethod(spec.local.name, stylePath, file, pluginState);
    });
  }
}
