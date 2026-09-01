# Radar de Cursos

Turmas **gratuitas e presenciais** de tecnologia no estado de São Paulo, reunidas de mais de uma
instituição em uma única tabela filtrável — unidade, endereço, datas, vagas e link de inscrição.

### ➜ **[Abrir o Radar](https://al-ramos.github.io/radar-cursos/)**

## Escolas cobertas

| Escola | O que entra | Como a inscrição funciona |
|---|---|---|
| **SENAI-SP** | Cursos gratuitos, presenciais, período integral (TI e Informática) | A turma já é publicada com data, horário e vagas; o botão **Reservar** abre a reserva daquela turma |
| **Senac-SP** | Cursos com bolsa do PSG, presenciais (área Tecnologia da Informação) | A bolsa abre 20 dias antes do início, ao meio-dia, por ordem de chegada; a linha mostra a unidade e o botão **Ver bolsas** |

O PSG do Senac exige renda familiar de até 2 salários mínimos por pessoa.

## A tabela

| Coluna | Conteúdo |
|---|---|
| Curso | nome e objetivo |
| Região | Capital, Grande SP, Litoral ou Interior |
| Tipo | Livre, Técnico, Médio Técnico, Aprendiz ou Qualificação |
| Duração | carga horária, quando publicada |
| Local | cidade, bairro, endereço e telefone da unidade |
| Início / Término | datas da turma (Senac: "a definir" até a bolsa abrir) |
| Horário | período e faixa de horário |
| Vagas | vagas em aberto, ou o selo "bolsa" |
| Inscrição | link oficial — **Reservar** ou **Ver bolsas** |

Filtros por escola, região, cidade, unidade, tipo e mês de início, busca livre e ordenação por
qualquer coluna. A página é um arquivo único, sem dependências, e funciona offline.

## Dados

`dados.json` — 192 cursos e 559 linhas curso-unidade, coletados em 01/09/2026 de
[sp.senai.br](https://www.sp.senai.br/cursos/0/tecnologia-da-informacao-e-informatica) e
[sp.senac.br](https://www.sp.senac.br/bolsas-de-estudo/cursos-com-bolsa).

```json
{
  "inst": "SENAI-SP",              // escola
  "n": "nome", "t": "tipo",
  "ch": 40,                        // carga horária (null quando não publicada)
  "d": "descrição",
  "u": [["Região","Cidade","Bairro","Endereço","Telefone",
         [["início","fim","horário", vagas, "link de inscrição"]]]]
}
```

Um link que começa com `http` é absoluto; os demais são caminhos em `https://www.sp.senai.br/`.
Turma sem data (`""`) e com `vagas: null` é oferta de bolsa ainda não aberta.

> Vagas e turmas mudam com frequência. Confirme no site da instituição antes de concluir a inscrição.

## Licença

Código sob MIT. Os dados pertencem ao SENAI-SP e ao Senac-SP e são reproduzidos aqui apenas para consulta.
