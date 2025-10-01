import React from "react";
import { FlatList, Text, StyleSheet, Pressable } from "react-native";
import type { FiltroKey } from "@/app/lib/filtros";

interface FiltrosProps {
  value: FiltroKey;
  onChange: (val: FiltroKey) => void;
  items: { key: FiltroKey; title: string }[];
}

export function Filtros({ value, onChange, items }: FiltrosProps) {
  return (
    <FlatList
      horizontal
      data={items}
      keyExtractor={(item) => item.key}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => {
        const isActive = value === item.key;
        return (
          <Pressable
            onPress={() => onChange(item.key)}
            style={[styles.chip, isActive ? styles.chipAtivo : styles.chipInativo]}
          >
            <Text style={[styles.texto, isActive ? styles.textoAtivo : styles.textoInativo]}>
              {item.title}
            </Text>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  chip: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    marginHorizontal: 4,
  },
  chipAtivo: { backgroundColor: "#2E5951" },
  chipInativo: { backgroundColor: "#1F2126" },
  texto: { fontSize: 13, fontWeight: "600" },
  textoAtivo: { color: "#fff" },
  textoInativo: { color: "#ccc" },
});
