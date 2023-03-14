/*
 * @Author: tianyu
 * @Date: 2023-03-14 17:35:05
 * @Description:
 */
// * 获取主入口文件
const fs = require("fs");
const parser = require("@babel/parser");
const getModuleInfo = (file) => {
  const body = fs.readFileSync(file, "utf-8");

  // * 转换为代码树
  const ast = parser.parse(body, {
    sourceType: "module",
  });

  console.log(body);
  console.log(ast.program.body);
};

getModuleInfo("./src/index.js");