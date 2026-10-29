# Trechos de código

Excertos isolados do projeto "Cidade em Dia" — cada um resolve um problema específico. Não são arquivos completos do projeto (imports e tipos auxiliares foram simplificados/removidos de propósito); o contexto de cada um está explicado no [README principal](../README.md#destaques-de-engenharia).

| Arquivo | O que mostra |
|---|---|
| [`01-validacao-cpf.ts`](./01-validacao-cpf.ts) | Validação de dígito verificador de CPF, sem API externa |
| [`02-avatar-anonimo.ts`](./02-avatar-anonimo.ts) | Avatar "identicon" gerado por hash, determinístico, sem serviço externo |
| [`03-verificacao-gps.ts`](./03-verificacao-gps.ts) | Distância real (Haversine) pra validar GPS dentro do raio da cidade |
| [`04-deteccao-duplicados.ts`](./04-deteccao-duplicados.ts) | Busca geoespacial pra detectar chamados duplicados |
| [`05-cores-de-prazo-sla.ts`](./05-cores-de-prazo-sla.ts) | Cálculo das cores de prazo (SLA) do painel administrativo |
