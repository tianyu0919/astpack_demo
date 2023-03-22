/*
 * @Author: tianyu
 * @Date: 2023-03-22 10:45:09
 * @Description:
 */
const ejs = require("ejs");
const people = ["John", "neil", "alex"];
const html = ejs.render(
  `
<ul>
  <% people.forEach(item => { %>
    <li><%= item %></li>
  <% }) %>
</ul>
`,
  {
    people: people,
  }
);
console.log(html);

// const template =
//   "<% for(let i=0; i<5; i++) { %><h1>Hello <%= name %></h1><% } %>";
// const data = { name: "World" };
// const html1 = ejs.render(template, data);
// console.log(html1);
