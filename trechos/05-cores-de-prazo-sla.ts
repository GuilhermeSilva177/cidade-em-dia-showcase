/**
 * Trecho de "Cidade em Dia" — cores de prazo (SLA) sempre calculadas,
 * nunca um campo fixo no banco.
 *
 * Contexto: cada categoria de chamado tem um prazo em horas. A cor que a
 * prefeitura vê no painel (vermelho = atrasado, verde = concluído
 * adiantado, neutro = dentro do prazo) é sempre derivada do estado real
 * do chamado no momento da leitura — assim nunca fica desatualizada.
 * A cor sempre vem acompanhada de ícone e texto, nunca só a cor.
 *
 * (Excerpt isolado e simplificado — ver README do repositório.)
 */

type SlaTone = "red" | "green" | "neutral" | "muted";

interface SlaInput {
  status: "ABERTO" | "EM_ANDAMENTO" | "CONCLUIDO" | "IMPROCEDENTE";
  createdAt: Date;
  dueAt: Date;
  completedAt?: Date | null;
}

// earlyThreshold vem da configuração da cidade (ex: 0.75 = concluiu usando até 75% do prazo)
export function slaTone(x: SlaInput, earlyThreshold: number, now = new Date()): { tone: SlaTone; label: string } {
  if (x.status === "IMPROCEDENTE") return { tone: "muted", label: "Improcedente" };

  if (x.status === "CONCLUIDO" && x.completedAt) {
    const ratio = (x.completedAt.getTime() - x.createdAt.getTime()) / (x.dueAt.getTime() - x.createdAt.getTime());
    if (x.completedAt > x.dueAt) return { tone: "red", label: "Concluído com atraso" };
    if (ratio <= earlyThreshold) return { tone: "green", label: "Concluído antes do prazo" };
    return { tone: "neutral", label: "Concluído dentro do prazo" };
  }

  if (now > x.dueAt) return { tone: "red", label: "Atrasado" };
  return { tone: "neutral", label: "Dentro do prazo" };
}
