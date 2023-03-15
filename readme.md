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
    sourceType: "module", // * 告诉解析器，解析 module 类型
  });

  console.log(body);
  console.log(ast);
};

getModuleInfo("./src/index.js");
```

## 收集依赖

### @babel/traverse

遍历AST，将用到的依赖收集起来。什么意思呢？就是将用 `import` 语句引入的文件路径收集起来。将收集起来的路径放进 `deps` 里面。

```js
const getModuleInfo = (file) => {
  // * pre code
  // * 转换代码树
  traverse(ast, {
    ImportDeclaration({ node }) {
      console.log(node);
      const dirname = path.dirname(file);
      const abspath = `./${path.join(dirname, node.source.value)}`;
      deps[node.source.value] = abspath;
    },
  });

  // * pre code
};
```

## ES6转ES5(AST)

需要 `@babel/core` 和 `@babel/preset-env` 包。先下载下来，然后代码：

```js

// * pre code
// * 传入的 ast 是之前使用 parser.parse 转换的Ast语法树。

const { code } = babel.transformFromAst(ast, null, {
  presets: ['@babel/preset-env']
});
console.log(code); // * 已经编译成了ES5的代码。
```

## 递归获取所有依赖

### 修改原先代码

修改代码：

```js
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

  // * 将ES6代码转换为ES5
  const { code } = babel.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"],
  });
  console.log(code);

  // * 新增代码
  // * 返回了一个对象，包括模块的路径、模块的依赖、模块转为es5的代码。
  const moduleInfo = { file, deps, code };
  return moduleInfo;
};
```

当前完成的是 `getModuleInfo` 方法，此方法传入一个路径，返回 { file(路径), deps(依赖), code(解析的代码) }。

### 新增递归方法

完成递归获取所有依赖的方法

```js
// * 递归获取所有依赖
const parseModules = (files) => {
  const entry = getModuleInfo(file); // * 解析当前文件获取三样东西
  const temp = [entry];
  for (let i = 0; i < temp.length; i++) {
    const deps = temp[i].deps; // * 拿到每个依赖项中的依赖
    if (deps) { // * 如果有依赖的话 { key: value } 格式
      for (const key in deps) { // * 拿到每个 key
        if (deps.hasOwnProperty(key)) { // * 判断是否有当前的依赖项
          temp.push(getModuleInfo(deps[key])); // * 在重新添加依赖到总体依赖中。
        }
      }
    }
  }
}
```

### 修改存储形式

将 `parseModules` 函数中的代码改一下，如下：

```js
// * 递归获取所有依赖
const parseModules = (file) => {
  const entry = getModuleInfo(file);
  const temp = [entry];
  // * 新增 depsGraph 对象
  const depsGraph = {};
  for (let i = 0; i < temp.length; i++) {
    const deps = temp[i].deps;
    if (deps) {
      for (const key in deps) {
        if (deps.hasOwnProperty(key)) {
          temp.push(getModuleInfo(deps[key]));
        }
      }
    }
  }

  // * 循环解析完成的数据，并添加到刚才的对象中。
  temp.forEach((moduleInfo) => {
    depsGraph[moduleInfo.file] = {
      deps: moduleInfo.deps,
      code: moduleInfo.code
    };
  });
  console.log(depsGraph);

  return depsGraph;
};
```