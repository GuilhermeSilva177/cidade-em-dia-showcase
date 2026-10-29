/**
 * Trecho de "Cidade em Dia" — validação de CPF sem dependência externa.
 *
 * Contexto: o cadastro do cidadão exige CPF (pra coibir contas duplicadas),
 * mas o produto não podia depender de uma API paga de consulta à Receita
 * Federal. Esta função confere só os dois dígitos verificadores pelo
 * algoritmo oficial — 100% local, sem rede, sem custo por verificação.
 *
 * (Excerpt isolado para fins de portfólio — ver README do repositório.)
 */

function onlyDigits(s: string): string {
  return s.replace(/\D/g, "");
}

export function isValidCPF(raw: string): boolean {
  const cpf = onlyDigits(raw);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false; // recusa sequências tipo 111.111.111-11

  const calc = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(cpf[i]) * (len + 1 - i);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };

  if (calc(9) !== Number(cpf[9])) return false;
  if (calc(10) !== Number(cpf[10])) return false;
  return true;
}
