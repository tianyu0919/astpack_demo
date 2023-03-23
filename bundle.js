(function(modules){
  const entry = "./src/index.js" // * 找到入口文件

  /**
   * @param {string} path
   * @returns {object}
   * @description 根据入口文件路径拿到对应的模块
   */
  function require(path) {
    const [moduleFunction, dependencies] = modules[path]; // * 在传进来的modules中，根据入口文件路径拿到对一个主模块的[方法, 依赖项]
    const module = { exports: { } } // * 创建一个模块的全局变量，后续将传递给每个模块的方法中。

    /**
     * @param {string} depsPath
     * @description 拿到模块的依赖项，并赋值给module.exports
     */
    function localRequire(depsPath) {
      const modulePath = dependencies[depsPath];
      return require(modulePath);
    }

    /**
     * @param {object} localRequire
     * @param {object} module.exports
     * @description 将模块的方法赋值给module.exports
     */
    moduleFunction(localRequire, module.exports);
    return module.exports;
  }

  require(entry);
})({

    "./src/index.js": [(require, exports) => { 
      "use strict";

var _add = _interopRequireDefault(require("./add.js"));
var _minus = require("./minus.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var sum = (0, _add["default"])(1, 2);
var division = (0, _minus.minus)(2, 1);
console.log(sum);
console.log(division);
    }, 
    {"./add.js":"./src/add.js","./minus.js":"./src/minus.js"}],

    "./src/add.js": [(require, exports) => { 
      "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _other = _interopRequireDefault(require("./other.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
(0, _other["default"])();
var _default = function _default(a, b) {
  return a + b;
};
exports["default"] = _default;
    }, 
    {"./other.js":"./src/other.js"}],

    "./src/minus.js": [(require, exports) => { 
      "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.minus = void 0;
var minus = function minus(a, b) {
  return a - b;
};
exports.minus = minus;
    }, 
    {}],

    "./src/other.js": [(require, exports) => { 
      "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
function _default() {
  console.log('this is other function');
}
    }, 
    {}],

})