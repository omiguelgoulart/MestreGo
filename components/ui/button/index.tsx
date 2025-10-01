import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
} from "react-native";

const tokens = {
  radius: 12,
  spacing: { sm: 10, md: 14, lg: 18 },
  font: { sm: 14, md: 16, lg: 18 },
  colors: {
    primary: "#2E5951", // verde
    primaryText: "#FFFFFF",
    border: "#2A2A31",
    bg: "#151518",
    ghost: "transparent",
    mutedText: "#B9B9C0",
    disabledBg: "#1A1A1E",
    disabledText: "#6D6D73",
  },
};

type Variant = "default" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

export type ButtonProps = {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: Variant;
  size?: Size;
  isDisabled?: boolean;
  isLoading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export function Button({
  children,
  onPress,
  variant = "default",
  size = "md",
  isDisabled,
  isLoading,
  style,
  textStyle,
}: ButtonProps) {
  const height = size === "sm" ? 40 : size === "lg" ? 52 : 46;
  const padding = size === "sm" ? tokens.spacing.sm : size === "lg" ? tokens.spacing.lg : tokens.spacing.md;
  const fontSize = size === "sm" ? tokens.font.sm : size === "lg" ? tokens.font.lg : tokens.font.md;

  const baseStyle: ViewStyle = {
    height,
    paddingHorizontal: padding,
    borderRadius: tokens.radius,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  };

  let backgroundColor = tokens.colors.primary;
  let borderColor = tokens.colors.primary;
  let color = tokens.colors.primaryText;

  if (variant === "outline") {
    backgroundColor = "transparent";
    borderColor = tokens.colors.border;
    color = tokens.colors.primaryText;
  }

  if (variant === "ghost") {
    backgroundColor = tokens.colors.ghost;
    borderColor = "transparent";
    color = tokens.colors.mutedText;
  }

  if (isDisabled) {
    backgroundColor = tokens.colors.disabledBg;
    borderColor = tokens.colors.disabledBg;
    color = tokens.colors.disabledText;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled || isLoading}
      style={[
        baseStyle,
        { backgroundColor, borderWidth: variant === "outline" ? 1 : 0, borderColor },
        style,
      ]}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={color} />
      ) : (
        <Text
          style={[
            styles.text,
            { fontSize, color },
            textStyle,
          ]}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Inter_600SemiBold", // usa a fonte moderna carregada no layout
  },
});
