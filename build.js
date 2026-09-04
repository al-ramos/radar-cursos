// Injeta dados.json dentro de index.html.
// A página é um arquivo único e funciona offline, então os dados vivem embutidos
// nela; dados.json é a fonte da verdade. Rode `node build.js` depois de editar
// dados.json para que as duas cópias não saiam do lugar.
const fs = require("fs");

const MARCA = /^const DADOS=.*$/m;

const dados = JSON.parse(fs.readFileSync("dados.json", "utf8"));
const html = fs.readFileSync("index.html", "utf8");

if (!MARCA.test(html)) {
  console.error("erro: não achei a linha `const DADOS=` em index.html");
  process.exit(1);
}

const linha = "const DADOS=" + JSON.stringify(dados) + ";";
const novo = html.replace(MARCA, () => linha);

if (novo === html) {
  console.log("index.html já estava em dia com dados.json");
} else {
  fs.writeFileSync("index.html", novo, "utf8");
  console.log("index.html atualizado");
}

const porSec = {};
const porInst = {};
for (const c of dados) {
  porSec[c.sec || "livres"] = (porSec[c.sec || "livres"] || 0) + 1;
  porInst[c.inst] = (porInst[c.inst] || 0) + 1;
}
const turmas = dados.reduce(
  (a, c) => a + c.u.reduce((b, u) => b + u[5].filter((t) => t[0]).length, 0), 0);
console.log(`${dados.length} cursos · ${turmas} turmas com data`);
console.log("seções:", porSec);
console.log("escolas:", porInst);
