export type FiltroKey = "Todas" | "Abertas" | "Pendentes" | "Fechadas" | "Canceladas";

export const FiltroItems: { key: FiltroKey; title: string }[] = [
  { key: "Todas",      title: "Todas" },
  { key: "Abertas",    title: "Abertas" },
  { key: "Pendentes",  title: "Pendentes" },
  { key: "Fechadas",   title: "Fechadas" },
  { key: "Canceladas", title: "Canceladas" },
];
