import { useMemo, useState } from "react";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Filtros } from "@/components/listaComanda/Filtros";
import { NovaComanda } from "@/components/listaComanda/AdicionaComanda";
import { NovaComandaModal } from "@/components/listaComanda/NovaComandaModal";
import { FiltroItems, FiltroKey } from "./lib/filtros";
import { formatDate, toDateOnly, today } from "./lib/date";
import { useComandas } from "./hooks/useComandas";
import { Calendario } from "../components/listaComanda/Calendario";
import { ComandaLista } from "@/components/listaComanda/ComandaLista";
import { COLORS } from "./lib/status";
import { Logout } from "@/components/auth/BotaoLogout";

export default function AppComanda() {
  const [filtro, setFiltro] = useState<FiltroKey>("Todas");
  const [selectedDate, setSelectedDate] = useState<Date | null>(today());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [openNova, setOpenNova] = useState(false);
  const router = useRouter();

  const { dataFiltrada, loading, refresh } = useComandas({
    filtro,
    selectedDate,
  });

  const selectedYmd = useMemo(
    () => (selectedDate ? toDateOnly(selectedDate) : undefined),
    [selectedDate]
  );

  const setHoje = () => setSelectedDate(today());
  const limparData = () => setSelectedDate(null);

  return (
    <View style={styles.safe}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.titulo}>Comandas</Text>
        <Logout />
      </View>

      <View style={[styles.filtro, { gap: 8 }]}>
        <Filtros value={filtro} onChange={setFiltro} items={FiltroItems} />

        <View style={styles.dateRow}>
          <Pressable
            style={[styles.dateBtn, styles.datePrimary]}
            onPress={() => setCalendarOpen(true)}
          >
            <Text style={styles.dateBtnText}>
              {selectedDate ? formatDate(selectedDate) : "Selecionar data"}
            </Text>
          </Pressable>

          <Pressable style={styles.dateBtn} onPress={setHoje}>
            <Text style={styles.dateBtnTextMuted}>Hoje</Text>
          </Pressable>

          <Pressable style={styles.dateBtn} onPress={limparData}>
            <Text style={styles.dateBtnTextMuted}>Limpar</Text>
          </Pressable>
        </View>
      </View>

      <Calendario
        visible={calendarOpen}
        selectedYmd={selectedYmd}
        onClose={() => setCalendarOpen(false)}
        onPick={(ymd) => {
          setSelectedDate(new Date(`${ymd}T00:00:00`));
          setCalendarOpen(false);
        }}
      />

      <ComandaLista
        data={dataFiltrada}
        loading={loading}
        onRefresh={refresh}
        onItemPress={(item) => router.push(`/detalheComanda/${item.id}`)}
      />

      <NovaComandaModal
        open={openNova}
        onOpenChange={(v) => {
          setOpenNova(v);
          if (!v) refresh();
        }}
        useApi
        onCreated={() => {}}
      />

      <View style={styles.novaComanda}>
        <NovaComanda onPress={() => setOpenNova(true)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg, gap: 8 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  titulo: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  filtro: { paddingHorizontal: 16, paddingBottom: 12 },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dateBtn: {
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  datePrimary: { borderColor: COLORS.accent },
  dateBtnText: { color: COLORS.text, fontWeight: "700" },
  dateBtnTextMuted: { color: COLORS.textMuted, fontWeight: "700" },
  novaComanda: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 18,
  },
});
