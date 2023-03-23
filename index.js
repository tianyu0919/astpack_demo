/*
 * @Author: tianyu
 * @Date: 2023-03-14 17:35:05
 * @Description: https://juejin.cn/post/6854573217336541192
 */
// * 获取主入口文件
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const babel = require("@babel/core");
const ejs = require("ejs");
const entry = "./src/index.js";

// * 递归获取所有依赖
const parseModules = (file) => {
  const entry = getModuleInfo(file);
  const temp = [entry];
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

  temp.forEach((moduleInfo) => {
    depsGraph[moduleInfo.file] = {
      deps: moduleInfo.deps,
      code: moduleInfo.code,
    };
  });
  // console.log(depsGraph);

  return depsGraph;
};

// * 获取模块的路径、模块的依赖、模块转为es5的代码。
const getModuleInfo = (file) => {
  const body = fs.readFileSync(file, "utf-8");

  // * 转换为代码树
  const ast = parser.parse(body, {
    sourceType: "module",
  });

  const deps = {};

  traverse(ast, {
    ImportDeclaration({ node }) {
      // console.log(node);
      const dirname = path.dirname(file);
      const abspath = `./${path.join(dirname, node.source.value)}`;
      deps[node.source.value] = abspath;
    },
  });

  // * 将ES6代码转换为ES5
  const { code } = babel.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"],
  });
  // console.log(code);

  // * 返回了一个对象，包括模块的路径、模块的依赖、模块转为es5的代码。
  const moduleInfo = { file, deps, code };
  return moduleInfo;
};

// * 获取模块的路径、模块的依赖、模块转为es5的代码。
const bundle = (file) => {
  const depsGraph = parseModules(file);
  // console.log(depsGraph);
  const data = Buffer.from(JSON.stringify(depsGraph, null, 2));
  // console.log(data);

  fs.writeFile("./data.json", data, (err) => {
    if (err) {
      // console.log(err);
    }
  });

  let template = ejs.render(fs.readFileSync("./bundle.ejs").toString(), {
    modules: depsGraph,
    entry,
  });
  console.log(template);
  fs.writeFile("./bundle.js", template, (err) => {
    if (err) {
      // console.log(err);
    }
  });

  // return `(function (graph) {
  //   function require(file) {
  //     function absRequire(relPath) {
  //       return require(graph[file].deps[relPath]);
  //     }
  //     var exports = {};
  //     (function (require, code) {
  //       eval(code);
  //     })(absRequire, graph[file].code);
  //     return exports;
  //   }
  //   require(file);
  // })(depsGraph);`
  return "xx";
};

const file = bundle(entry);
console.log(file);
