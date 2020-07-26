// const a = {
//   b() {
//     console.log('b');
//   }
// };

// const a = {
//   b() {
//     console.log('b');
//   }
// }

// const aProxy = proxy(a, {
//   b(num) {
//     console.log('this is:', num);
//   }
// });

// console.log(aProxy.b(1));

const isFunction = (func) => Object.prototype.toString.call(func) === '[object Function]';


const proxy = (source, predo) => {
  const keys = Object.keys(predo);
  const p = new Proxy(source, {
    get(target, prop, r) {
      if (keys.includes(prop)) {
        return (...rest) => {
          predo[prop](...rest);
          source[prop].call(source, ...rest);
        };
      }
      if (isFunction(source[prop])) {
        return source[prop].bind(source);
      }

      return prop;
    }
  });
  return p;
}

module.exports = proxy;
