# 手写webpack打包工具

相关链接：[手写webpack核心原理](https://juejin.cn/post/6854573217336541192)

## 分析模块

### @babel/parser

使用 `@babel/parser` 转换代码成为语法树。AST。

```js
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
  console.log(ast);
};

getModuleInfo("./src/index.js");
```

## 收集依赖

### @babel/traverse

遍历AST，将用到的依赖收集起来。什么意思呢？就是将用 `import` 语句引入的文件路径收集起来。将收集起来的路径放进 `deps` 里面。

