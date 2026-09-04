# Radar de Cursos

Turmas **gratuitas e presenciais** de tecnologia no estado de São Paulo, reunidas de doze
instituições em uma única tabela filtrável — unidade, endereço, datas, vagas e link de inscrição.

### ➜ **[Abrir o Radar](https://al-ramos.github.io/radar-cursos/)**

## As três abas

| Aba | O que é | Escolas |
|---|---|---|
| **Cursos livres** | Cursos livres e de qualificação, do curso de 20 horas à formação técnica curta. É onde ficam as turmas com data e vaga publicadas | SENAI-SP, Senac-SP, AvançaTech, Fundação Bradesco, IFSP, Novotec Expresso |
| **Formação longa** | Técnico das Etecs e superior de tecnologia das Fatecs. A formação é gratuita, mas a entrada é por processo seletivo com prova e **taxa de inscrição** | Etec, Fatec |
| **Programas com seleção** | Programas de ONGs e institutos, com processo seletivo e recorte de público — idade, escolaridade, renda ou gênero. Costumam incluir mentoria e encaminhamento a vagas | Instituto PROA, Escola da Nuvem, Generation Brasil, {reprograma} |

## Escolas cobertas

Cada escola entrega a vaga de um jeito. O campo `mod` define o selo da coluna **Vagas** e o rótulo do botão:

| Escola | O que entra | `mod` | Como a inscrição funciona |
|---|---|---|---|
| **SENAI-SP** | Cursos gratuitos, presenciais, período integral (TI e Informática) | `turma` | A turma já é publicada com data, horário e vagas; **Reservar** abre a reserva daquela turma |
| **Senac-SP** | Cursos com bolsa do PSG, presenciais (área Tecnologia da Informação) | `bolsa` | A bolsa abre 20 dias antes do início, ao meio-dia, por ordem de chegada; **Ver bolsas** abre a página do curso |
| **AvançaTech** | Java, PHP, .NET, React e Games com IA, 120 h, em 7 polos da capital | `continuo` | Matrícula em fluxo contínuo; a turma começa quando o grupo fecha |
| **Fundação Bradesco** | Cisco, Web Design e Desenvolvimento, na unidade de Osasco | `oferta` | Turmas por semestre em manhã, tarde ou noite; **Ver turmas** abre o site da fundação |
| **IFSP** | Cursos FIC, de extensão e do PRONATEC nos câmpus da capital e Grande SP | `edital` | Vagas abertas por edital do câmpus, com prazo próprio a cada oferta |
| **Novotec Expresso** | Qualificação em TIC de 120 h, em Etecs, Fatecs e parceiras | `edital` | Edital periódico do Governo de SP; os municípios mudam a cada rodada |
| **Etec** | Técnico do eixo de Informação e Comunicação | `vestibular` | Vestibulinho semestral, com prova e taxa de inscrição |
| **Fatec** | Superior de tecnologia do eixo de Informação e Comunicação | `vestibular` | Vestibular semestral, com taxa de inscrição |
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

`dados.json` — 225 cursos de 12 instituições, em 12 categorias e 51 subcategorias.

- **SENAI-SP e Senac-SP**: coleta de 01/09/2026, com turma, data e vaga por unidade.
- **Demais escolas**: coleta de 03/09/2026, no nível de oferta — curso, unidade ou polo e link oficial, **sem** data de
  turma, porque essas instituições não publicam calendário fixo.

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

## Build

`index.html` embute uma cópia de `dados.json` para funcionar offline. `dados.json` é a fonte da verdade — depois de
editá-lo, rode:

```bash
node build.js
```

> Vagas e turmas mudam com frequência. Confirme no site da instituição antes de concluir a inscrição.

## Licença

Código sob MIT. Os dados pertencem às instituições listadas acima e são reproduzidos aqui apenas para consulta,
sempre com link para a página oficial de inscrição.
