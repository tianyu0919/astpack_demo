(function(module){
  console.log(module);

})({

    "./src/index.js": [
    JSON.stringify("use strict";

var _add = _interopRequireDefault(require("./add.js"));
var _minus = require("./minus.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var sum = (0, _add["default"])(1, 2);
var division = (0, _minus.minus)(2, 1);
console.log(sum);
console.log(division);)
    ]

    "./src/add.js": [
    JSON.stringify("use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = function _default(a, b) {
  return a + b;
};
exports["default"] = _default;)
    ]

    "./src/minus.js": [
    JSON.stringify("use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.minus = void 0;
var minus = function minus(a, b) {
  return a - b;
};
exports.minus = minus;)
    ]

})