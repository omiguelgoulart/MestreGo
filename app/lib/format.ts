// Formata número em Real brasileiro
export const moneyBRL = (v: number = 0) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(v);

// Formata uma string ISO de data para hora local (hh:mm)
export const timeBR = (iso: string) =>
  new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
