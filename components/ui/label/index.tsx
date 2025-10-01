import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";

type LabelProps = TextProps & {
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
};

export function Label({ children, error, disabled, required, style, ...props }: LabelProps) {
  return (
    <Text
      style={[
        styles.label,
        error
          ? { color: "#E5484D" } // vermelho erro
          : disabled
          ? { color: "#6D6D73" } // cinza desabilitado
          : {},
        style,
      ]}
      {...props}
    >
      {children}
      {required && <Text style={{ color: "#E5484D" }}> *</Text>}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#B9B9C0", // texto neutro
    marginBottom: 4,
  },
});
