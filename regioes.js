// Cidade → região, do jeito que o Radar filtra: Capital, Grande SP, Litoral,
// Interior. Compartilhado pelos coletores para que duas fontes nunca discordem
// sobre a mesma cidade.

// Os 39 municípios da Região Metropolitana de São Paulo, menos a capital.
const RMSP = new Set(["Arujá", "Barueri", "Biritiba Mirim", "Biritiba-Mirim", "Caieiras", "Cajamar",
  "Carapicuíba", "Carapicuiba", "Cotia", "Diadema", "Embu das Artes", "Embu-Guaçu",
  "Ferraz de Vasconcelos", "Francisco Morato", "Franco da Rocha", "Guararema", "Guarulhos",
  "Itapecerica da Serra", "Itapevi", "Itaquaquecetuba", "Jandira", "Juquitiba", "Mairiporã", "Mauá",
  "Mogi das Cruzes", "Osasco", "Pirapora do Bom Jesus", "Poá", "Ribeirão Pires",
  "Rio Grande da Serra", "Salesópolis", "Santa Isabel", "Santana de Parnaíba", "Santo André",
  "São Bernardo do Campo", "São Caetano do Sul", "São Lourenço da Serra", "Suzano",
  "Taboão da Serra", "Vargem Grande Paulista"]);

// Baixada Santista, litoral norte e litoral sul.
const LITORAL = new Set(["Bertioga", "Caraguatatuba", "Cananéia", "Guarujá", "Ilha Comprida",
  "Ilhabela", "Iguape", "Itanhaém", "Mongaguá", "Peruíbe", "Praia Grande", "Santos",
  "São Sebastião", "São Vicente", "Ubatuba"]);

// Câmpus e polos que ficam na capital mas são nomeados pelo distrito.
const DISTRITOS_SP = new Set(["Jardim Angela", "Jardim Ângela", "Pirituba", "São Miguel Paulista",
  "Cidade Tiradentes", "Interlagos", "Freguesia do Ó", "Carrão", "Cidade Líder", "Heliópolis",
  "Cantinho do Céu", "Jardim São Luís", "Zona Leste", "Itaquera", "Sapopemba"]);

// `conhecidas` é o mapa cidade → região que o dados.json já usa. Ele vem
// primeiro para o filtro de região não contradizer as linhas do SENAI e do
// Senac que já estão no arquivo.
function regiaoDe(cidade, conhecidas) {
  if (conhecidas && conhecidas.has(cidade)) return conhecidas.get(cidade);
  if (cidade === "São Paulo" || DISTRITOS_SP.has(cidade)) return "Capital";
  if (RMSP.has(cidade)) return "Grande SP";
  if (LITORAL.has(cidade)) return "Litoral";
  return "Interior";
}

// Constrói o mapa cidade → região a partir do que já está coletado.
function regioesConhecidas(dados) {
  const m = new Map();
  for (const c of dados) for (const u of c.u) if (u[1] && !m.has(u[1])) m.set(u[1], u[0]);
  return m;
}

module.exports = { regiaoDe, regioesConhecidas, RMSP, LITORAL, DISTRITOS_SP };
