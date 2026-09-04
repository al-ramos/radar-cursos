// Coletor do Centro Paula Souza: Etec (vestibulinho) e Fatec (vestibular).
//
// Os dois portais têm a mesma estrutura. A página de cada unidade
// (`escola.asp?c=ID`) traz endereço, cidade, telefone e uma tabela de cursos
// com período e vagas — ou seja, dado de turma de verdade, não só o link. Por
// isso o coletor é dirigido pela unidade, e não pelo curso:
//
//   1. abre a página de cada curso de TI da lista abaixo e anota que unidades
//      o oferecem;
//   2. abre cada uma dessas unidades uma única vez;
//   3. lê da tabela da unidade o período e as vagas de cada curso de TI.
//
// Uso:
//   node coletor-cps.js          coleta e reescreve as entradas Etec/Fatec
//   node coletor-cps.js --dry    coleta e só mostra o resumo
//
// As páginas ficam em cache no diretório .cache/ para não repetir requisição
// entre execuções; apague-o para forçar coleta nova. Depois de rodar, use
// `node build.js` para reembutir os dados no index.html.

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { regiaoDe, regioesConhecidas } = require("./regioes");

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/128.0 Safari/537.36";
const CACHE = ".cache";
const PAUSA = 200; // ms entre requisições, para não martelar o portal

// ── o que coletar ────────────────────────────────────────────────────────────
// Eixo tecnológico de Informação e Comunicação. O id é o `c=` do portal.
// EAD fica de fora: o Radar só lista curso presencial.
const FONTES = [
  {
    inst: "Etec",
    tipo: "Técnico",
    base: "https://vestibulinho.etec.sp.gov.br/unidades-cursos/",
    req: "processo seletivo com prova · taxa de inscrição",
    cursos: [
      [26, "Desenvolvimento de Sistemas", "Programação", "Desenvolvimento de Sistemas"],
      [77, "Desenvolvimento de Sistemas - MNP", "Programação", "Desenvolvimento de Sistemas"],
      [116, "Informática", "Suporte & Hardware", "Suporte Técnico"],
      [205, "Informática - MNP", "Suporte & Hardware", "Suporte Técnico"],
      [244, "Informática para Internet", "Web & Design digital", "Sites & CMS"],
      [233, "Informática para Internet - MNP", "Web & Design digital", "Sites & CMS"],
      [57, "Redes de Computadores", "Redes & Infraestrutura", "Redes locais & Wireless"],
      [64, "Ciência de Dados", "Dados & BI", "Análise de Dados"],
      [247, "Programação de Jogos Digitais", "Jogos", "Programação de Jogos"],
      [89, "Design Gráfico", "Design gráfico & Vídeo", "Editoração & Impressos"],
      [354, "Design Gráfico - MNP", "Design gráfico & Vídeo", "Editoração & Impressos"],
      // ensino médio integrado ao técnico
      [252, "Informática - M-Tec", "Suporte & Hardware", "Suporte Técnico", "Médio Técnico"],
      [110, "Informática - M-Tec - MNP", "Suporte & Hardware", "Suporte Técnico", "Médio Técnico"],
      [167, "Informática - M-Tec - PI", "Suporte & Hardware", "Suporte Técnico", "Médio Técnico"],
      [144, "Informática - M-Tec-N", "Suporte & Hardware", "Suporte Técnico", "Médio Técnico"],
      [226, "Redes de Computadores - M-Tec", "Redes & Infraestrutura", "Redes locais & Wireless", "Médio Técnico"],
      [194, "Multimídia - M-Tec", "Design gráfico & Vídeo", "Multimídia & Animação", "Médio Técnico"],
      [346, "Multimídia - M-Tec-PI", "Design gráfico & Vídeo", "Multimídia & Animação", "Médio Técnico"],
      [90, "Design Gráfico - M-Tec", "Design gráfico & Vídeo", "Editoração & Impressos", "Médio Técnico"],
      [83, "Design Gráfico - M-Tec - MNP", "Design gráfico & Vídeo", "Editoração & Impressos", "Médio Técnico"],
      [5, "Design Gráfico - M-Tec - PI", "Design gráfico & Vídeo", "Editoração & Impressos", "Médio Técnico"],
      [187, "Design Gráfico - M-Tec-N", "Design gráfico & Vídeo", "Editoração & Impressos", "Médio Técnico"],
    ],
  },
  {
    inst: "Fatec",
    tipo: "Superior",
    base: "https://vestibular.fatec.sp.gov.br/unidades-cursos/",
    req: "ensino médio completo · vestibular com taxa de inscrição",
    cursos: [
      [194, "Análise e Desenvolvimento de Sistemas", "Programação", "Desenvolvimento de Sistemas"],
      [275, "Desenvolvimento de Software Multiplataforma", "Programação", "Desenvolvimento de Sistemas"],
      [197, "Sistemas para Internet", "Web & Design digital", "Sites & CMS"],
      [221, "Banco de Dados", "Dados & BI", "Banco de Dados"],
      [270, "Ciência de Dados", "Dados & BI", "Análise de Dados"],
      [286, "Ciência de Dados para Negócios", "Dados & BI", "Análise de Dados"],
      [295, "Ciência de Dados para o Agronegócio", "Dados & BI", "Análise de Dados"],
      [302, "Ciência de Dados e Inteligência em Saúde", "Dados & BI", "Análise de Dados"],
      [198, "Segurança da Informação", "Cibersegurança", "Segurança da Informação"],
      [278, "Defesa Cibernética", "Cibersegurança", "Cibersegurança essencial"],
      [222, "Redes de Computadores", "Redes & Infraestrutura", "Redes locais & Wireless"],
      [273, "Sistemas Embarcados", "IoT & Eletrônica", "Automação & IoT"],
      [287, "Sistemas Inteligentes", "Inteligência Artificial", "IA Aplicada"],
      [199, "Jogos Digitais", "Jogos", "Game Design"],
      [265, "Design de Mídias Digitais", "Design gráfico & Vídeo", "Multimídia & Animação"],
      [97, "Gestão da Tecnologia da Informação", "Office & Produtividade", "Gestão de Projetos"],
      [100, "Informática para Negócios", "Office & Produtividade", "Gestão de Projetos"],
    ],
  },
];

// ── rede ─────────────────────────────────────────────────────────────────────
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

// O WAF dos dois portais devolve 403 para o cliente HTTP do Node — ele recusa
// pela impressão digital do TLS, não pelos cabeçalhos, então mandar
// User-Agent de navegador no fetch() não resolve. O curl passa, e vem com o
// Windows 10+ e com o macOS, então é ele que busca as páginas aqui.
async function pega(url) {
  const chave = path.join(CACHE, url.replace(/[^a-z0-9]+/gi, "_").slice(-120) + ".html");
  if (fs.existsSync(chave)) return fs.readFileSync(chave, "utf8");
  await espera(PAUSA);
  const buf = execFileSync("curl", ["-sS", "--fail", "--max-time", "30", "-A", UA, "-L", url],
    { maxBuffer: 32 * 1024 * 1024 });
  // o cabeçalho anuncia ISO-8859-1, mas o corpo vem em UTF-8
  const txt = new TextDecoder("utf-8").decode(buf);
  fs.mkdirSync(CACHE, { recursive: true });
  fs.writeFileSync(chave, txt, "utf8");
  return txt;
}

// ── parsing ──────────────────────────────────────────────────────────────────
const limpa = (s) => s
  .replace(/<!--[\s\S]*?-->/g, "")            // o <address> traz a foto comentada
  .replace(/<[^>]+>/g, "")
  .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
  .replace(/&#40;/g, "(").replace(/&#41;/g, ")")
  .replace(/&([lr]s?quo|#8217|#39);/g, "'")
  .replace(/\s+/g, " ").trim();

// ids de unidade citados na página de um curso
const unidadesDoCurso = (html) => {
  const bloco = html.slice(html.indexOf("Escolas que oferecem"));
  return [...new Set([...bloco.matchAll(/escola\.asp\?c=(\d+)/g)].map((m) => m[1]))];
};

// endereço, bairro, cidade e telefone no <address> da página da unidade
function dadosDaUnidade(html) {
  const m = html.match(/<address>([\s\S]*?)<\/address>/i);
  if (!m) return null;
  const nome = limpa((m[1].match(/<h3>([\s\S]*?)<\/h3>/i) || [, ""])[1]);
  const corpo = m[1].replace(/<h3>[\s\S]*?<\/h3>/i, "");
  const linhas = corpo.split(/<br\s*\/?>/i).map(limpa).filter(Boolean);
  const endLinha = linhas[0] || "";
  const telLinha = linhas.find((l) => /^Telefone/i.test(l)) || "";
  // a cidade vem em "CEP 13469-111 - Americana/SP"; algumas unidades não
  // publicam o CEP e deixam só "Americana/SP" na própria linha
  const linhaComCidade = linhas.find((l) => /\/SP\b/i.test(l)) || "";
  const cidade = (linhaComCidade.match(/(?:^|-\s*)([^-\/]+?)\s*\/SP\b/i) || [, ""])[1].trim();
  const tel = limpa(telLinha.replace(/^Telefone:?\s*/i, "").split("/")[0]);
  // O Radar usa o campo de bairro para nomear a unidade no filtro. Numa cidade
  // com mais de uma Etec o nome da escola identifica melhor que o bairro, então
  // o bairro fica junto do endereço, que é onde ele ajuda a chegar lá.
  return { nome, end: endLinha, cidade, tel: formataTel(tel) };
}

// o portal publica "(11) 40539400"; o Radar mostra "(11) 4053-9400"
function formataTel(t) {
  const d = t.replace(/\D/g, "");
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  return t;
}

// Período e vagas por curso na página da unidade. Os dois portais publicam a
// mesma informação em marcações diferentes: a Etec numa tabela com <span
// class="badge-…">, a Fatec numa <ul> em que cada <br> é uma turma.
function ofertasDaUnidade(html) {
  return html.includes("cursos-table") ? ofertasEmTabela(html) : ofertasEmLista(html);
}

function ofertasEmTabela(html) {
  const tab = html.slice(html.indexOf("cursos-table"));
  const fim = tab.indexOf("</table>");
  const por = {};
  for (const tr of (fim > 0 ? tab.slice(0, fim) : tab).split(/<tr[^>]*>/i).slice(1)) {
    const id = (tr.match(/curso\.asp\?c=(\d+)/) || [])[1];
    if (!id) continue;
    const per = limpa((tr.match(/badge-periodo[^>]*>([\s\S]*?)<\/span>/i) || [, ""])[1]);
    const vag = (tr.match(/badge-vagas[^>]*>\s*(\d+)/i) || [])[1];
    guarda(por, id, per, vag);
  }
  return por;
}

function ofertasEmLista(html) {
  const i = html.indexOf('id="cursos-lista"');
  if (i < 0) return {};
  const bloco = html.slice(i, html.indexOf("</ul>", i));
  const por = {};
  for (const li of bloco.split(/<li[^>]*>/i).slice(1)) {
    const id = (li.match(/curso\.asp\?c=(\d+)/) || [])[1];
    if (!id) continue;
    // depois do <a> do curso, cada <br> traz uma turma:
    // "Noite - 25 vagas - Período letivo: Semestral"
    for (const turma of li.replace(/[\s\S]*?<\/a>/i, "").split(/<br\s*\/?>/i)) {
      const t = limpa(turma);
      const m = t.match(/^(.*?)\s+-\s+(\d+)\s+vagas?\b/i);
      if (!m) continue;
      guarda(por, id, m[1], m[2]);
    }
  }
  return por;
}

// o Radar só lista curso presencial, então turma a distância não entra
const guarda = (por, id, per, vag) => {
  if (/\b(ead|a dist[âa]ncia|online|on-line)\b/i.test(per)) return;
  (por[id] = por[id] || []).push({ per: per.trim(), vagas: vag ? +vag : null });
};

// ── coleta ───────────────────────────────────────────────────────────────────
async function coleta(fonte, conhecidas) {
  const unidades = new Map();   // id -> dados da unidade
  const oferta = new Map();     // id da unidade -> { idCurso: [{per,vagas}] }
  const querem = new Set();

  for (const [id] of fonte.cursos) {
    const html = await pega(`${fonte.base}curso.asp?c=${id}`);
    unidadesDoCurso(html).forEach((u) => querem.add(u));
  }
  process.stdout.write(`${fonte.inst}: ${querem.size} unidades a ler`);

  let n = 0;
  for (const u of querem) {
    const html = await pega(`${fonte.base}escola.asp?c=${u}`);
    const d = dadosDaUnidade(html);
    if (d && d.cidade) { unidades.set(u, d); oferta.set(u, ofertasDaUnidade(html)); }
    if (++n % 25 === 0) process.stdout.write(".");
  }
  console.log(` — ${unidades.size} lidas`);

  const saida = [];
  for (const [id, nome, cat, sub, tipo] of fonte.cursos) {
    const us = [];
    for (const [u, d] of unidades) {
      const turmas = (oferta.get(u) || {})[id];
      if (!turmas) continue;
      us.push([regiaoDe(d.cidade, conhecidas), d.cidade, d.nome, d.end, d.tel,
        turmas.map((t) => ["", "", t.per, t.vagas, `${fonte.base}curso.asp?c=${id}`])]);
    }
    if (!us.length) continue;
    us.sort((a, b) => a[1].localeCompare(b[1], "pt"));
    saida.push({
      inst: fonte.inst, n: nome, t: tipo || fonte.tipo, cat, sub, ch: null,
      d: descreve(fonte.inst, nome, us.length),
      sec: "longa", mod: "vestibular", req: fonte.req, src: fonte.base, l: fonte.base + `curso.asp?c=${id}`,
      u: us,
    });
  }
  return saida;
}

const descreve = (inst, nome, n) =>
  inst === "Etec"
    ? `Curso técnico gratuito de ${nome.replace(/ - (MNP|M-Tec.*|PI)$/, "")}, oferecido em ${n} ${n === 1 ? "Etec" : "Etecs"} do estado. A entrada é pelo Vestibulinho, com prova e taxa de inscrição.`
    : `Curso superior de tecnologia gratuito em ${nome}, oferecido em ${n} ${n === 1 ? "Fatec" : "Fatecs"} do estado. A entrada é pelo Vestibular das Fatecs, com taxa de inscrição.`;

// ── main ─────────────────────────────────────────────────────────────────────
(async () => {
  const dados = JSON.parse(fs.readFileSync("dados.json", "utf8"));

  const conhecidas = regioesConhecidas(dados);

  const novos = [];
  for (const f of FONTES) novos.push(...await coleta(f, conhecidas));

  const linhas = novos.reduce((a, c) => a + c.u.reduce((b, u) => b + u[5].length, 0), 0);
  const vagas = novos.reduce((a, c) => a + c.u.reduce((b, u) => b + u[5].reduce((s, t) => s + (t[3] || 0), 0), 0), 0);
  const cidades = new Set(novos.flatMap((c) => c.u.map((u) => u[1])));
  console.log(`\n${novos.length} cursos · ${linhas} linhas curso-unidade · ${cidades.size} cidades · ${vagas} vagas`);

  if (process.argv.includes("--dry")) { console.log("--dry: dados.json não foi tocado"); return; }

  const resto = dados.filter((c) => c.inst !== "Etec" && c.inst !== "Fatec");
  fs.writeFileSync("dados.json", JSON.stringify(resto.concat(novos)), "utf8");
  console.log(`dados.json: ${resto.length} + ${novos.length} = ${resto.length + novos.length} cursos`);
  console.log("rode `node build.js` para reembutir no index.html");
})();
