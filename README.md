# Radar de Cursos

Turmas **gratuitas e presenciais** de tecnologia no estado de São Paulo, reunidas de doze
instituições em uma única tabela filtrável — unidade, endereço, datas, vagas e link de inscrição.

### ➜ **[Abrir o Radar](https://al-ramos.github.io/radar-cursos/)**

## As três abas

| Aba | O que é | Escolas |
|---|---|---|
| **Cursos livres** | Cursos livres e de qualificação, do curso de 20 horas à formação técnica curta. É onde ficam as turmas com data e vaga publicadas | SENAI-SP, Senac-SP, AvançaTech, Fundação Bradesco, IFSP, Novotec Expresso |
| **Formação longa** | Técnico e superior das Etecs, Fatecs e do IFSP. A formação é gratuita; a entrada é por processo seletivo, com **taxa de inscrição** no Centro Paula Souza | Etec, Fatec, IFSP |
| **Programas com seleção** | Programas de ONGs e institutos, com processo seletivo e recorte de público — idade, escolaridade, renda ou gênero. Costumam incluir mentoria e encaminhamento a vagas | Instituto PROA, Escola da Nuvem, Generation Brasil, {reprograma} |

## Escolas cobertas

Cada escola entrega a vaga de um jeito. O campo `mod` define o selo da coluna **Vagas** e o rótulo do botão:

| Escola | O que entra | `mod` | Como a inscrição funciona |
|---|---|---|---|
| **SENAI-SP** | Cursos gratuitos, presenciais, período integral (TI e Informática) | `turma` | A turma já é publicada com data, horário e vagas; **Reservar** abre a reserva daquela turma |
| **Senac-SP** | Cursos com bolsa do PSG, presenciais (área Tecnologia da Informação) | `bolsa` | A bolsa abre 20 dias antes do início, ao meio-dia, por ordem de chegada; **Ver bolsas** abre a página do curso |
| **AvançaTech** | Java, PHP, .NET, React e Games com IA, 120 h, em 7 polos da capital | `continuo` | Matrícula em fluxo contínuo; a turma começa quando o grupo fecha |
| **Fundação Bradesco** | Cisco, Web Design e Desenvolvimento, na unidade de Osasco | `oferta` | Turmas por semestre em manhã, tarde ou noite; **Ver turmas** abre o site da fundação |
| **IFSP** | Nos livres: cursos FIC, de extensão e do PRONATEC. Na formação longa: técnico e superior de TI em 25 câmpus | `edital` / `vestibular` | FIC sai por edital do câmpus; técnico e superior, pelo processo seletivo do IFSP |
| **Novotec Expresso** | Qualificação em TIC de 120 h, em Etecs, Fatecs e parceiras | `edital` | Edital periódico do Governo de SP; os municípios mudam a cada rodada |
| **Etec** | Técnico do eixo de Informação e Comunicação, por unidade | `vestibular` | Vestibulinho semestral, com prova e taxa de inscrição |
| **Fatec** | Superior de tecnologia do eixo de Informação e Comunicação, por unidade | `vestibular` | Vestibular semestral, com taxa de inscrição |
| **Instituto PROA** | ProProfissão · Desenvolvimento de Software, 6 meses, semipresencial | `selecao` | Processo seletivo por turma |
| **Escola da Nuvem** | Tech para Todos · Nuvem AWS e IA, presencial na Fundação Julita | `selecao` | Processo seletivo por turma |
| **Generation Brasil** | Bootcamp de Análise de Dados, em São Paulo e Campinas | `selecao` | Processo seletivo por turma |
| **{reprograma}** | Formação em programação para mulheres cis e trans | `selecao` | Processo seletivo por turma |

Os requisitos de cada curso — idade, escolaridade, renda, escola pública, público específico — aparecem na
própria linha, embaixo da descrição. O PSG do Senac exige renda familiar de até 2 salários mínimos por pessoa.

## A tabela

| Coluna | Conteúdo |
|---|---|
| Curso | nome e objetivo |
| Região | Capital, Grande SP, Litoral ou Interior |
| Tipo / Categoria | nível (Livre, Técnico, Médio Técnico, Superior, Aprendiz, Qualificação), a categoria e a subcategoria do curso |
| Duração | carga horária, quando publicada |
| Local | cidade, bairro, endereço e telefone da unidade ou polo |
| Início / Término | datas da turma, ou o motivo de não haver data ainda ("a definir", "ao formar turma", "conforme o edital") |
| Horário | período e faixa de horário |
| Vagas | vagas em aberto, ou o selo do modelo de entrada — bolsa, fluxo contínuo, turmas abertas, por edital, seleção, vestibular |
| Inscrição | link oficial, com o rótulo do modelo — Reservar, Ver bolsas, Inscrever, Ver turmas, Ver edital, Ver seleção, Ver vestibular |

As colunas que ficariam vazias na aba somem: em **Formação longa** sobram Curso, Tipo / Categoria e Inscrição.

Filtros por escola, categoria, subcategoria, região, cidade, unidade, tipo e mês de início, busca livre e ordenação por
qualquer coluna. Cada aba refaz os próprios filtros e esconde os que não têm o que filtrar ali. A página é um arquivo
único, sem dependências, e funciona offline.

## Dados

`dados.json` — 260 cursos de 12 instituições, em 12 categorias e 51 subcategorias.

Três níveis de detalhe, conforme o que a instituição publica:

- **SENAI-SP e Senac-SP** — coleta de 01/09/2026. Turma, data e vaga por unidade.
- **Etec, Fatec e IFSP** — coletados por script (`coletor-cps.js`, `coletor-ifsp.js`). Unidade, endereço, telefone,
  período e vagas, mas **sem data**: o calendário é do processo seletivo, não da turma.
- **Demais escolas** — coleta manual de 03/09/2026, no nível de oferta: curso, unidade ou polo e link oficial. Sem data
  nem vaga, porque essas instituições não publicam nenhum dos dois.

```json
{
  "inst": "SENAI-SP",              // escola
  "n": "nome", "t": "tipo", "cat": "categoria", "sub": "subcategoria",
  "ch": 40,                        // carga horária (null quando não publicada)
  "d": "descrição",
  "sec": "livres",                 // aba: livres | longa | selecao
  "mod": "turma",                  // como a vaga é entregue (tabela acima)
  "req": "",                       // requisitos de elegibilidade, exibidos na linha
  "src": "https://…",              // página oficial de onde o dado saiu
  "l": "",                         // link do curso, usado quando não há unidade
  "u": [["Região","Cidade","Bairro","Endereço","Telefone",
         [["início","fim","horário", vagas, "link de inscrição"]]]]
}
```

Um link que começa com `http` é absoluto; os demais são caminhos em `https://www.sp.senai.br/` — só o SENAI usa
caminho relativo. Turma sem data (`""`) e com `vagas: null` é oferta ainda sem calendário; o selo na coluna **Vagas**
diz por quê (bolsa, fluxo contínuo, por edital, seleção, vestibular).

## Coletores

```bash
node coletor-cps.js     # Etec e Fatec, do vestibulinho e do vestibular
node coletor-ifsp.js    # técnico e superior de TI do catálogo do IFSP
node build.js           # reembute dados.json no index.html
```

Cada coletor reescreve só as próprias entradas do `dados.json` e deixa o resto intacto, então dá para rodar um sem o
outro. Ambos aceitam `--dry`, que coleta e mostra o resumo sem tocar no arquivo. As páginas baixadas ficam em `.cache/`;
apague o diretório para forçar coleta nova.

Duas notas de campo, para quem for mexer:

- Os portais do Centro Paula Souza ficam atrás de um WAF que devolve **403 para o cliente HTTP do Node** — ele recusa
  pela impressão digital do TLS, então mandar `User-Agent` de navegador no `fetch()` não resolve. Os coletores chamam o
  `curl`, que passa e vem junto com o Windows 10+ e o macOS.
- O catálogo do IFSP é um array JavaScript embutido na página, não uma API. O coletor converte esse literal para JSON
  num passe que respeita o conteúdo das strings, em vez de executar o código que veio do site.

## Build

`index.html` embute uma cópia de `dados.json` para funcionar offline. `dados.json` é a fonte da verdade — depois de
editá-lo à mão ou de rodar um coletor, rode `node build.js`.

> Vagas e turmas mudam com frequência. Confirme no site da instituição antes de concluir a inscrição.

## Licença

Código sob MIT. Os dados pertencem às instituições listadas acima e são reproduzidos aqui apenas para consulta,
sempre com link para a página oficial de inscrição.
