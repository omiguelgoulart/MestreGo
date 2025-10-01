import { useCallback, useEffect, useMemo, useState } from "react";
import { ComandaItf } from "@/app/types/comandaItf";
import { FiltroKey, mapFiltroToStatuses } from "@/app/lib/status";
import { normalize, toDateOnly } from "@/app/lib/date";

type UseComandasArgs = {
  filtro: FiltroKey;
  selectedDate: Date | null;
};

export function useComandas({ filtro, selectedDate }: UseComandasArgs) {
  const [comandas, setComandas] = useState<ComandaItf[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComandas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/comanda`);
      if (!res.ok) throw new Error("Erro na resposta da API");
      const data = await res.json();
      setComandas(data);
    } catch (err) {
      console.error("Erro ao buscar comandas", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchComandas(); }, [fetchComandas]);

  const dataFiltrada = useMemo(() => {
    const allow = mapFiltroToStatuses[filtro];
    const allowSet = allow ? new Set(allow.map(normalize)) : null;
    const dateOnly = selectedDate ? toDateOnly(selectedDate) : null;

    return comandas.filter((c) => {
      const statusOk = !allowSet || allowSet.has(normalize(c.status));
      const dateOk = dateOnly ? (c?.data ? toDateOnly(c.data) === dateOnly : false) : true;
      return statusOk && dateOk;
    });
  }, [comandas, filtro, selectedDate]);

  return { comandas, dataFiltrada, loading, refresh: fetchComandas };
}
