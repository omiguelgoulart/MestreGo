import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

type Align = "left" | "center" | "right";

export type TableColumn<T> = {
  key: keyof T;
  title: string;
  width?: number; // largura fixa da coluna (px). Padrão 120
  align?: Align;  // alinhamento do texto
  render?: (value: any, row: T, rowIndex: number) => React.ReactNode; // célula custom
};

type TableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  style?: ViewStyle;
  zebra?: boolean;
  onRowPress?: (row: T, index: number) => void;
};

export default function Table<T extends Record<string, any>>({
  columns,
  data,
  style,
  zebra = true,
  onRowPress,
}: TableProps<T>) {
  const defaultColWidth = 120;
  const totalWidth = columns.reduce(
    (acc, col) => acc + (col.width ?? defaultColWidth),
    0
  );

  return (
    <ScrollView horizontal style={[styles.wrapper, style]} contentContainerStyle={{ width: totalWidth }}>
      <View>
        {/* Header */}
        <View style={styles.headerRow}>
          {columns.map((col, i) => (
            <View
              key={String(col.key) + i}
              style={[
                styles.cell,
                { width: col.width ?? defaultColWidth },
              ]}
            >
              <Text style={[styles.headerText, alignStyle(col.align)]}>
                {col.title}
              </Text>
            </View>
          ))}
        </View>

        {/* Body */}
        {data.map((row, rowIndex) => {
          const RowContainer = onRowPress ? TouchableOpacity : View;
          return (
            <RowContainer
              key={rowIndex}
              onPress={onRowPress ? () => onRowPress(row, rowIndex) : undefined}
              activeOpacity={0.7}
              style={[
                styles.row,
                zebra && rowIndex % 2 === 1 && styles.zebra,
              ]}
            >
              {columns.map((col, colIndex) => {
                const value = row[col.key];
                return (
                  <View
                    key={String(col.key) + colIndex}
                    style={[
                      styles.cell,
                      { width: col.width ?? defaultColWidth },
                    ]}
                  >
                    {col.render ? (
                      col.render(value, row, rowIndex)
                    ) : (
                      <Text style={[styles.cellText, alignStyle(col.align)]}>
                        {String(value ?? "")}
                      </Text>
                    )}
                  </View>
                );
              })}
            </RowContainer>
          );
        })}
      </View>
    </ScrollView>
  );
}

function alignStyle(align: Align = "left") {
  return { textAlign: align as any };
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 12,
    backgroundColor: "#0f1115",
    borderWidth: 1,
    borderColor: "#22252b",
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#171a20",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#2a2f37",
  },
  row: {
    flexDirection: "row",
  },
  zebra: {
    backgroundColor: "#12151a",
  },
  cell: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: "center",
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: "#252a33",
  },
  headerText: {
    color: "#e7e7ea",
    fontWeight: "700",
    fontSize: 13,
  },
  cellText: {
    color: "#c9cbd1",
    fontSize: 13,
  },
});
