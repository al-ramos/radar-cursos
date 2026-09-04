// Coletor do catálogo de cursos do IFSP.
//
// O portal do IFSP renderiza o catálogo por JavaScript, mas os dados não vêm
// de uma API: a página `/cursos` traz um `const cursos=[…]` embutido, com
// nome, eixo, tipo, duração, turno, vagas, descrição e — o mais útil — um link
// oficial por câmpus. É esse array que este coletor lê.
//
// Só entram os cursos da lista CURSOS abaixo, que é o recorte de TI. O
// catálogo agrupa técnico por eixo tecnológico ("Informação e Comunicação") e
// superior por grau ("Tecnólogo", "Bacharelado"), então não dá para filtrar só
// pelo eixo — o recorte é por nome mesmo.
//
// Uso:
//   node coletor-ifsp.js          coleta e reescreve as entradas do IFSP
//   node coletor-ifsp.js --dry    coleta e só mostra o resumo
//
// Depois de rodar, use `node build.js` para reembutir os dados no index.html.

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { regiaoDe, regioesConhecidas } = require("./regioes");

const URL = "https://www.ifsp.edu.br/cursos";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/128.0 Safari/537.36";
const CACHE = ".cache";

// ── recorte de TI ────────────────────────────────────────────────────────────
// nome no catálogo → categoria e subcategoria do Radar
const CURSOS = new Map([
  ["Técnico em Desenvolvimento de Sistemas", ["Programação", "Desenvolvimento de Sistemas"]],
  ["Técnico em Informática", ["Suporte & Hardware", "Suporte Técnico"]],
  ["Técnico em Informática para Internet", ["Web & Design digital", "Sites & CMS"]],
  ["Técnico em Manutenção e Suporte em Informática", ["Suporte & Hardware", "Manutenção de Computadores"]],
  ["Técnico em Operador de Computador", ["Office & Produtividade", "Pacote Office"]],
  ["Técnico em Redes de Computadores", ["Redes & Infraestrutura", "Redes locais & Wireless"]],
  ["Técnico em Telecomunicações", ["Redes & Infraestrutura", "Telecomunicações"]],
  ["Tecnologia em Análise e Desenvolvimento de Sistemas", ["Programação", "Desenvolvimento de Sistemas"]],
  ["Tecnologia em Sistemas para Internet", ["Web & Design digital", "Sites & CMS"]],
  ["Ciência da Computação", ["Programação", "Desenvolvimento de Sistemas"]],
  ["Engenharia de Computação", ["Programação", "Desenvolvimento de Sistemas"]],
  ["Engenharia de Software", ["Programação", "Desenvolvimento de Sistemas"]],
  ["Sistemas de Informação", ["Programação", "Desenvolvimento de Sistemas"]],
]);

// grau no catálogo → tipo do Radar
const TIPO = {
  "Integrado": "Médio Técnico",
  "Concomitante/Subsequente": "Técnico",
  "Subsequente": "Técnico",
  "EJA": "Médio Técnico",
  "Tecnólogo": "Superior",
  "Bacharelado": "Superior",
  "Licenciatura": "Superior",
};

// o que o candidato precisa ter, conforme a forma de ingresso
const REQ = {
  "Integrado": "ensino fundamental completo · processo seletivo do câmpus",
  "Concomitante/Subsequente": "ensino médio em curso ou concluído · processo seletivo do câmpus",
  "Subsequente": "ensino médio completo · processo seletivo do câmpus",
  "EJA": "para quem não concluiu o ensino médio na idade regular · processo seletivo do câmpus",
  "Tecnólogo": "ensino médio completo · processo seletivo do IFSP",
  "Bacharelado": "ensino médio completo · processo seletivo do IFSP",
  "Licenciatura": "ensino médio completo · processo seletivo do IFSP",
};

// ── busca ────────────────────────────────────────────────────────────────────
function pega() {
  const chave = path.join(CACHE, "ifsp-cursos.html");
  if (fs.existsSync(chave)) return fs.readFileSync(chave, "utf8");
  const buf = execFileSync("curl", ["-sS", "--fail", "--max-time", "60", "-A", UA, "-L", URL],
    { maxBuffer: 64 * 1024 * 1024 });
  const txt = new TextDecoder("utf-8").decode(buf);
  fs.mkdirSync(CACHE, { recursive: true });
  fs.writeFileSync(chave, txt, "utf8");
  return txt;
}

// ── leitura do array ─────────────────────────────────────────────────────────
// O array é literal de JavaScript, não JSON: as chaves vêm sem aspas e há
// comentários de linha entre os blocos. Em vez de executar o código da página,
// converte-se para JSON num único passe que respeita o conteúdo das strings.
function leCatalogo(html) {
  const i = html.indexOf("const cursos=[");
  if (i < 0) throw new Error("não achei `const cursos=[` na página do IFSP");
  const bruto = html.slice(i + "const cursos=".length);

  let fim = -1, aspas = null;
  for (let k = 0; k < bruto.length; k++) {
    const c = bruto[k];
    if (aspas) { if (c === "\\") k++; else if (c === aspas) aspas = null; continue; }
    if (c === '"' || c === "'") { aspas = c; continue; }
    if (c === "]" && /^\s*[;\n]/.test(bruto.slice(k + 1))) { fim = k + 1; break; }
  }
  if (fim < 0) throw new Error("não achei o fim do array de cursos");

  const arr = bruto.slice(0, fim);
  let out = "";
  aspas = null;
  for (let k = 0; k < arr.length; k++) {
    const c = arr[k];
    if (aspas) {
      out += c;
      if (c === "\\") out += arr[++k];
      else if (c === aspas) aspas = null;
      continue;
    }
    if (c === '"' || c === "'") { aspas = c; out += '"'; continue; }
    if (c === "/" && arr[k + 1] === "/") { while (k < arr.length && arr[k] !== "\n") k++; out += "\n"; continue; }
    const m = arr.slice(k).match(/^([A-Za-z_]\w*)\s*:/);
    if (m) { out += `"${m[1]}":`; k += m[0].length - 1; continue; }
    out += c;
  }
  return JSON.parse(out.replace(/,(\s*[}\]])/g, "$1"));
}

// ── montagem ─────────────────────────────────────────────────────────────────
// O câmpus é nomeado pela cidade, menos na capital, onde leva o nome do
// distrito. O Radar usa o campo de bairro para nomear a unidade no filtro.
const DISTRITOS = { "Jardim Angela": "Jardim Ângela" };
const cidadeDoCampus = (campus) =>
  regiaoDe(DISTRITOS[campus] || campus, null) === "Capital" && campus !== "São Paulo"
    ? "São Paulo" : campus;

// "Manhã,Tarde" e "3 ou 4 anos" viram uma linha só de horário.
// O catálogo às vezes grava o turno como lista, às vezes como texto.
const horario = (turno, duracao) => {
  const t = (Array.isArray(turno) ? turno : String(turno || "").split(","))
    .map((x) => String(x).trim()).filter(Boolean).join(" / ");
  return [t, duracao].filter(Boolean).join(" · ");
};

(function main() {
  const dados = JSON.parse(fs.readFileSync("dados.json", "utf8"));
  const conhecidas = regioesConhecidas(dados);
  const catalogo = leCatalogo(pega());
  console.log(`catálogo do IFSP: ${catalogo.length} cursos`);

  const novos = [];
  for (const c of catalogo) {
    const alvo = CURSOS.get(c.nome);
    if (!alvo) continue;
    // o Radar só lista curso presencial
    if (/^\s*ead\s*$/i.test(c.turno || "")) continue;
    const vagas = /^\d+$/.test(String(c.vagas || "").trim()) ? +c.vagas : null;

    const u = [];
    for (const campus of c.campus) {
      const nome = campus.trim();
      if (!nome) continue;
      const cidade = cidadeDoCampus(nome);
      const link = (c.links || {})[campus] || (c.links || {})[nome] || "https://www.ifsp.edu.br/cursos";
      u.push([regiaoDe(DISTRITOS[cidade] || cidade, conhecidas), cidade, `Câmpus ${nome}`, "", "",
        [["", "", horario(c.turno || "", c.duracao || ""), vagas, link]]]);
    }
    if (!u.length) continue;
    u.sort((a, b) => a[1].localeCompare(b[1], "pt") || a[2].localeCompare(b[2], "pt"));

    novos.push({
      inst: "IFSP", n: c.nome, t: TIPO[c.tipo] || "Técnico", cat: alvo[0], sub: alvo[1], ch: null,
      d: c.descricao || "",
      sec: "longa", mod: "vestibular", req: REQ[c.tipo] || "processo seletivo do IFSP",
      src: URL, l: "https://www.ifsp.edu.br/cursos", u,
    });
  }

  // um mesmo nome aparece em graus diferentes (integrado e subsequente, por
  // exemplo); o Radar conta curso por escola + nome, então junta os dois
  const porNome = new Map();
  for (const c of novos) {
    const j = porNome.get(c.n);
    if (!j) { porNome.set(c.n, c); continue; }
    j.u.push(...c.u);
    if (!j.req.includes(c.req)) j.req = [...new Set([j.req, c.req])].join(" · ou ");
  }
  const saida = [...porNome.values()];
  saida.forEach((c) => c.u.sort((a, b) => a[1].localeCompare(b[1], "pt") || a[2].localeCompare(b[2], "pt")));

  const linhas = saida.reduce((a, c) => a + c.u.length, 0);
  const cidades = new Set(saida.flatMap((c) => c.u.map((u) => u[1])));
  console.log(`${saida.length} cursos · ${linhas} linhas curso-câmpus · ${cidades.size} cidades`);
  saida.forEach((c) => console.log(`  ${c.n} — ${c.u.length} câmpus`));

  if (process.argv.includes("--dry")) { console.log("--dry: dados.json não foi tocado"); return; }

  // as entradas de FIC/extensão do IFSP são curadoria manual e ficam na aba de
  // cursos livres; este coletor só manda na aba de formação longa
  const resto = dados.filter((c) => !(c.inst === "IFSP" && c.sec === "longa"));
  fs.writeFileSync("dados.json", JSON.stringify(resto.concat(saida)), "utf8");
  console.log(`dados.json: ${resto.length} + ${saida.length} = ${resto.length + saida.length} cursos`);
  console.log("rode `node build.js` para reembutir no index.html");
})();
