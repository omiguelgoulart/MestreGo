// Utilitários de data centralizados
export const toDateOnly = (dateStrOrDate: string | Date) => {
  const d = typeof dateStrOrDate === "string" ? new Date(dateStrOrDate) : dateStrOrDate;
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split("T")[0];
};

export const formatDate = (d: Date) => {
  const pad = (n: number) => `${n}`.padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

export const today = () => new Date();

export const normalize = (s?: string) => (s ?? "").trim().toUpperCase();
