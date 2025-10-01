import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { ComandaItf } from "@/app/types/comandaItf";
import { timeBR, moneyBRL } from "@/app/lib/format";
import { Card } from "../ui/card";
import { Badge, BadgeVariant } from "../ui/badge";
import { calcularValor } from "@/app/lib/somaTotal";

type Props = {
  comanda: ComandaItf;
  onPress?: () => void;
};

function mapBadge(status: ComandaItf["status"]): {
  variant: BadgeVariant;
  style?: any;
  textStyle?: any;
  label: string;
} {
  switch (status) {
    case "ABERTA":
      return {
        variant: "secondary",
        style: { backgroundColor: "#2E5951", borderColor: "#2E5951" },
        textStyle: { color: "#ffffff" },
        label: "ABERTA",
      };
    case "FECHADA":
      return {
        variant: "default",
        label: status,
      };
    case "CANCELADA":
      return {
        variant: "destructive",
        label: "CANCELADA",
      };
    case "PENDENTE":
    default:
      return {
        variant: "outline",
        label: status ?? "—",
      };
  }
}

export function ComandaCard({ comanda, onPress }: Props) {
  const itensCount = Array.isArray(comanda.pedidos)
    ? comanda.pedidos.length
    : 0;
  const badge = mapBadge(comanda.status);

  return (
    <Card onPress={onPress}>
      <Card.Header>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Comanda {comanda.numero}</Text>
          <Badge
            variant={badge.variant}
            style={badge.style}
            textStyle={badge.textStyle}
            size="sm"
          >
            {badge.label}
          </Badge>
        </View>
        <View style={styles.subtitleRow}>
          <Text style={styles.subtitleText}>{timeBR(comanda.data)}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.itemCount}>
            {itensCount} {itensCount === 1 ? "item" : "itens"}
          </Text>
        </View>
      </Card.Header>
      <Card.Footer>
        <View style={styles.footerRow}>
          <Text style={styles.totalText}>
            {moneyBRL(calcularValor(comanda))}
          </Text>
        </View>
      </Card.Footer>
    </Card>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 16, fontWeight: "600", color: "#fff" },
  subtitleRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    marginTop: 4,
  },
  subtitleText: { fontSize: 12, color: "#aaa", marginTop: 2 },
  dot: { fontSize: 12, color: "#ccc" },
  itemCount: { fontSize: 12, color: "#ccc" },
  footerRow: { flexDirection: "row", justifyContent: "flex-end" },
  totalText: { color: "#fff", fontWeight: "500", fontSize: 13 },
});
