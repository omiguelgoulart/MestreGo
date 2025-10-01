import React from "react";
import { FlatList, StyleSheet, Text, View, Pressable } from "react-native";
import { ComandaItf } from "@/app/types/comandaItf";
import { COLORS } from "@/app/lib/status";
import { ComandaCard } from "./ComandaCard";

type Props = {
  data: ComandaItf[];
  loading: boolean;
  onRefresh: () => Promise<void> | void;
  onItemPress?: (item: ComandaItf) => void; // <- novo
};

export function ComandaLista({ data, loading, onRefresh, onItemPress }: Props) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <Pressable onPress={() => onItemPress?.(item)}>
          <ComandaCard comanda={item} />
        </Pressable>
      )}
      ItemSeparatorComponent={() => <View />}
      showsVerticalScrollIndicator={false}
      onRefresh={onRefresh}
      refreshing={loading}
      contentContainerStyle={styles.content}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Sem resultados neste filtro</Text>
          <Text style={styles.emptyDesc}>Ajuste o status ou a data acima, ou crie uma nova comanda.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 96 },
  empty: { alignItems: "center", justifyContent: "center", paddingTop: 40 },
  emptyTitle: { color: COLORS.text, fontWeight: "700", fontSize: 16 },
  emptyDesc: { color: COLORS.textMuted, fontSize: 14, marginTop: 4, textAlign: "center" },
});
