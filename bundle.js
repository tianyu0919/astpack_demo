/*
 * @Author: tianyu
 * @Date: 2023-03-14 17:35:05
 * @Description:
 */
// * 获取主入口文件
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
console.log(traverse);

const getModuleInfo = (file) => {
  const body = fs.readFileSync(file, "utf-8");

  // * 转换为代码树
  const ast = parser.parse(body, {
    sourceType: "module",
  });

  const deps = {};

  traverse(ast, {
    ImportDeclaration({ node }) {
      console.log(node);
      const dirname = path.dirname(file);
      const abspath = `./${path.join(dirname, node.source.value)}`;
      deps[node.source.value] = abspath;
    },
  });

  console.log(deps);

  // console.log(body);
  // console.log(ast.program.body);
};

getModuleInfo("./src/index.js");
