export const COLORS = {
  bg: "#0D0D0D",
  card: "#18181b",
  text: "#FAFAFA",
  textMuted: "#A1A1AA",
  border: "#2A2A2A",
  accent: "#2E5951",
} as const;

export type FiltroKey = "Todas" | "Abertas" | "Pendentes" | "Fechadas" | "Canceladas";

export const mapFiltroToStatuses: Record<FiltroKey, string[] | null> = {
  Todas: null,
  Abertas: ["ABERTA"],
  Pendentes: ["PENDENTE"],
  Fechadas: ["FECHADA"],
  Canceladas: ["CANCELADA"],
};
