import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline";
export type BadgeSize = "sm" | "md" | "lg";

export type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export function Badge({
  children,
  variant = "default",
  size = "md",
  iconLeft,
  iconRight,
  onPress,
  disabled,
  style,
  textStyle,
}: BadgeProps) {
  const Container: any = onPress ? TouchableOpacity : View;
  const sizeS = getSizeStyles(size);
  const variantS = getVariantStyles(variant);

  return React.createElement(
    Container,
    {
      onPress,
      activeOpacity: onPress ? 0.75 : undefined,
      disabled,
      style: [
        styles.base,
        sizeS.container,
        variantS.container,
        disabled ? styles.disabled : undefined,
        style,
      ],
    },
    [
      iconLeft
        ? React.createElement(
            View,
            { key: "iconLeft", style: [styles.icon, { marginRight: sizeS.gap }] },
            iconLeft
          )
        : null,
      React.createElement(
        Text,
        {
          key: "text",
          style: [styles.text, sizeS.text, variantS.text, textStyle],
          numberOfLines: 1,
        },
        children
      ),
      iconRight
        ? React.createElement(
            View,
            { key: "iconRight", style: [styles.icon, { marginLeft: sizeS.gap }] },
            iconRight
          )
        : null,
    ]
  );
}


function getSizeStyles(size: BadgeSize) {
  switch (size) {
    case "sm":
      return { container: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 999 }, text: { fontSize: 12, fontWeight: "700" as const }, gap: 4 };
    case "lg":
      return { container: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999 }, text: { fontSize: 14, fontWeight: "700" as const }, gap: 8 };
    case "md":
    default:
      return { container: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999 }, text: { fontSize: 13, fontWeight: "700" as const }, gap: 6 };
  }
}

function getVariantStyles(variant: BadgeVariant) {

  const palette = {
    border: "#252a33",
    text: "#e7e7ea",
    mutedText: "#c9cbd1",

    defaultBg: "#3B82F6", // sky-500
    defaultText: "#ffffff",

    secondaryBg: "#171a20", // header da tabela
    secondaryText: "#e7e7ea",

    destructiveBg: "#EF4444",
    destructiveText: "#ffffff",

    outlineBg: "transparent",
  } as const;

  switch (variant) {
    case "secondary":
      return {
        container: { backgroundColor: palette.secondaryBg, borderColor: palette.border, borderWidth: 1 },
        text: { color: palette.secondaryText },
      };
    case "destructive":
      return {
        container: { backgroundColor: palette.destructiveBg, borderColor: palette.destructiveBg, borderWidth: 1 },
        text: { color: palette.destructiveText },
      };
    case "outline":
      return {
        container: { backgroundColor: palette.outlineBg, borderColor: palette.border, borderWidth: 1 },
        text: { color: palette.mutedText },
      };
    case "default":
    default:
      return {
        container: { backgroundColor: palette.defaultBg, borderColor: palette.defaultBg, borderWidth: 1 },
        text: { color: palette.defaultText },
      };
  }
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    // cor/tamanho definidos por size e variant helpers
  },
  disabled: {
    opacity: 0.6,
  },
});

// --- Exemplos de uso ---
// <Badge>Default</Badge>
// <Badge variant="secondary">Rascunho</Badge>
// <Badge variant="destructive">Erro</Badge>
// <Badge variant="outline">Outline</Badge>
// <Badge size="sm">Pequeno</Badge>
// <Badge size="lg" onPress={() => {}}>Tocável</Badge>
