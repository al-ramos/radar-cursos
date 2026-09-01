# Turmas SENAI-SP — Tecnologia da Informação

Tabela filtrável das turmas **gratuitas, presenciais e em período integral** dos cursos de
Tecnologia da Informação e Informática do SENAI-SP, em todo o estado de São Paulo.

**[Abrir a tabela](index.html)** — página única, sem dependências, funciona offline.

## O que a página traz

| Coluna | Conteúdo |
|---|---|
| Curso | nome e objetivo do curso |
| Região | Capital, Grande SP ou Interior |
| Tipo | Livre, Técnico ou Aprendiz |
| Duração | carga horária |
| Local | unidade, bairro, endereço e telefone |
| Início / Término | datas da turma |
| Horário | período e faixa de horário |
| Vagas | vagas em aberto na coleta |
| Inscrição | link oficial de reserva daquela turma |

Filtros por região, cidade, unidade, tipo e mês de início, busca livre e ordenação por qualquer coluna.

## Dados

`dados.json` — 70 cursos, 127 turmas, 1.783 vagas. Coleta de 01/09/2026 a partir de
[sp.senai.br](https://www.sp.senai.br/cursos/0/tecnologia-da-informacao-e-informatica)
com os filtros Gratuitos · Presencial · Integral.

Formato de cada curso:

```json
{
  "n": "nome", "t": "tipo", "ch": 40, "d": "descrição",
  "u": [["Região","Cidade","Bairro","Endereço","Telefone",
         [["início","fim","horário", vagas, "caminho-da-reserva"]]]]
}
```

O link de reserva é `https://www.sp.senai.br/` + o caminho.

> Vagas e turmas mudam com frequência. Confirme no site do SENAI antes de concluir a inscrição.

## Licença

Código sob MIT. Os dados pertencem ao SENAI-SP e são reproduzidos aqui apenas para consulta.
