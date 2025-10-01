import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  FlatList,
  TextInput,
  ViewStyle,
  Platform,
  TextInputProps,
} from "react-native";

/** ========== TOKENS (compartilhados com Select e Input) ========== */
const tokens = {
  radius: 12,
  spacing: { xs: 6, sm: 8, md: 12, lg: 16 },
  font: { sm: 14, md: 16, lg: 18, label: 14, helper: 12 },
  colors: {
    bg: "#0B0B0C",
    surface: "#151518",
    surfaceAlt: "#1C1C20",
    text: "#EDEDED",
    textMuted: "#B9B9C0",
    border: "#2A2A31",
    borderFocus: "#6E56CF",
    borderError: "#E5484D",
    placeholder: "#8A8A95",
    disabledBg: "#111114",
    disabledText: "#6D6D73",
    success: "#46A758",
    warning: "#F5A524",
    overlay: "rgba(0,0,0,0.5)",
  },
};

type Size = "sm" | "md" | "lg";
type Variant = "outline" | "filled" | "ghost";

/** =================================================================
 *                              INPUT
 * ================================================================= */
type InputProps = Omit<TextInputProps, "style" | "onChange"> & {
  label?: string;
  helperText?: string;
  error?: string | boolean;
  isValid?: boolean;
  size?: Size;
  variant?: Variant;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  containerStyle?: ViewStyle;

  left?: React.ReactNode;
  right?: React.ReactNode;
  secureToggle?: boolean; // mostra/oculta senha
};

export function Input({
  label,
  helperText,
  error,
  isValid,
  size = "md",
  variant = "outline",
  isDisabled,
  isReadOnly,
  containerStyle,
  left,
  right,
  secureTextEntry,
  secureToggle = false,
  value,
  onChangeText,
  placeholder,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(Boolean(secureTextEntry));

  const hasError = Boolean(error);
  const hasLabel = Boolean(label);
  const hasHelper = Boolean(helperText) || hasError;

  const dims = useMemo(() => {
    const paddingY =
      size === "sm" ? tokens.spacing.sm : size === "lg" ? tokens.spacing.lg : tokens.spacing.md;
    const paddingX =
      size === "sm" ? tokens.spacing.md : size === "lg" ? tokens.spacing.lg : tokens.spacing.md;
    const fontSize =
      size === "sm" ? tokens.font.sm : size === "lg" ? tokens.font.lg : tokens.font.md;
    const height = size === "sm" ? 40 : size === "lg" ? 52 : 46;
    return { paddingY, paddingX, fontSize, height };
  }, [size]);

  const variantStyle = useMemo(() => {
    switch (variant) {
      case "filled":
        return { backgroundColor: tokens.colors.surfaceAlt, borderWidth: 0 };
      case "ghost":
        return { backgroundColor: "transparent", borderWidth: 0 };
      default:
        return { backgroundColor: tokens.colors.surface, borderWidth: StyleSheet.hairlineWidth };
    }
  }, [variant]);

  const borderColor = useMemo(() => {
    if (hasError) return tokens.colors.borderError;
    if (focused) return tokens.colors.borderFocus;
    if (isValid) return tokens.colors.success;
    return tokens.colors.border;
  }, [hasError, focused, isValid]);

  const editable = !isDisabled && !isReadOnly;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {hasLabel && (
        <Text
          style={[
            styles.label,
            { color: isDisabled ? tokens.colors.disabledText : tokens.colors.textMuted },
          ]}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputOuter,
          {
            borderColor,
            ...variantStyle,
            minHeight: dims.height,
            borderRadius: tokens.radius,
            opacity: isDisabled ? 0.6 : 1,
          },
        ]}
      >
        {!!left && <View style={styles.adornLeft}>{left}</View>}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          placeholder={placeholder}
          placeholderTextColor={tokens.colors.placeholder}
          style={[styles.input, { fontSize: dims.fontSize, paddingVertical: dims.paddingY }]}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={hidden}
          {...rest}
        />

        {secureToggle ? (
          <Pressable
            onPress={() => setHidden((p) => !p)}
            style={({ pressed }) => [styles.adornRight, pressed && { opacity: 0.8 }]}
            hitSlop={8}
          >
            <Text style={{ color: tokens.colors.textMuted, fontWeight: "600" }}>
              {hidden ? "Mostrar" : "Ocultar"}
            </Text>
          </Pressable>
        ) : (
          !!right && <View style={styles.adornRight}>{right}</View>
        )}
      </View>

      {hasHelper ? (
        <Text
          style={[
            styles.helper,
            {
              color: hasError
                ? tokens.colors.borderError
                : isValid
                ? tokens.colors.success
                : tokens.colors.textMuted,
            },
          ]}
          numberOfLines={2}
        >
          {hasError && typeof error === "string" ? error : helperText}
        </Text>
      ) : null}
    </View>
  );
}

/** =================================================================
 *                              SELECT
 * ================================================================= */
export type SelectOption = {
  label: string;
  value: string | number;
  disabled?: boolean;
  description?: string;
};

type SelectProps = {
  label?: string;
  helperText?: string;
  error?: string | boolean;
  size?: Size;
  variant?: Variant;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isValid?: boolean;
  containerStyle?: ViewStyle;

  placeholder?: string;
  searchable?: boolean;
  options: SelectOption[];
  value?: string | number | null;
  onChange?: (value: string | number, option: SelectOption) => void;

  /** Render custom de opção (opcional) */
  renderOption?: (opt: SelectOption, selected: boolean) => React.ReactNode;
};

export function Select({
  label,
  helperText,
  error,
  size = "md",
  variant = "outline",
  isDisabled,
  isReadOnly,
  isValid,
  containerStyle,
  placeholder = "Selecione...",
  searchable = false,
  options,
  value = null,
  onChange,
  renderOption,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = options.find((o) => o.value === value) || null;
  const hasError = Boolean(error);
  const hasLabel = Boolean(label);
  const hasHelper = Boolean(helperText) || hasError;

  const dims = useMemo(() => {
    const paddingY =
      size === "sm" ? tokens.spacing.sm : size === "lg" ? tokens.spacing.lg : tokens.spacing.md;
    const paddingX =
      size === "sm" ? tokens.spacing.md : size === "lg" ? tokens.spacing.lg : tokens.spacing.md;
    const fontSize =
      size === "sm" ? tokens.font.sm : size === "lg" ? tokens.font.lg : tokens.font.md;
    const height = size === "sm" ? 40 : size === "lg" ? 52 : 46;
    return { paddingY, paddingX, fontSize, height };
  }, [size]);

  const variantStyle = useMemo(() => {
    switch (variant) {
      case "filled":
        return { backgroundColor: tokens.colors.surfaceAlt, borderWidth: 0 };
      case "ghost":
        return { backgroundColor: "transparent", borderWidth: 0 };
      default:
        return { backgroundColor: tokens.colors.surface, borderWidth: StyleSheet.hairlineWidth };
    }
  }, [variant]);

  const borderColor = useMemo(() => {
    if (hasError) return tokens.colors.borderError;
    if (open) return tokens.colors.borderFocus;
    if (isValid) return tokens.colors.success;
    return tokens.colors.border;
  }, [hasError, open, isValid]);

  const editable = !isDisabled && !isReadOnly;

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        String(o.value).toLowerCase().includes(q) ||
        (o.description?.toLowerCase().includes(q) ?? false)
    );
  }, [options, searchable, query]);

  function handlePick(opt: SelectOption) {
    if (opt.disabled) return;
    onChange?.(opt.value, opt);
    setOpen(false);
  }

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {hasLabel && (
        <Text
          style={[
            styles.label,
            { color: isDisabled ? tokens.colors.disabledText : tokens.colors.textMuted },
          ]}
        >
          {label}
        </Text>
      )}

      {/* Campo visível (pressable) */}
      <Pressable
        onPress={() => editable && setOpen(true)}
        disabled={!editable}
        style={({ pressed }) => [
          styles.fieldOuter,
          {
            borderColor,
            ...variantStyle,
            minHeight: dims.height,
            borderRadius: tokens.radius,
            opacity: isDisabled ? 0.6 : 1,
          },
          pressed && editable ? { opacity: 0.9 } : undefined,
        ]}
      >
        <View
          style={[
            styles.valueWrap,
            { paddingVertical: dims.paddingY, paddingHorizontal: dims.paddingX },
          ]}
        >
          {selected ? (
            <Text style={[styles.valueText, { fontSize: dims.fontSize }]}>{selected.label}</Text>
          ) : (
            <Text style={[styles.placeholder, { fontSize: dims.fontSize }]}>{placeholder}</Text>
          )}
        </View>

        {/* “Ícone” de seta (sem libs) */}
        <View style={styles.chevronWrap}>
          <Text style={{ color: tokens.colors.textMuted, fontSize: 16 }}>▾</Text>
        </View>
      </Pressable>

      {hasHelper ? (
        <Text
          style={[
            styles.helper,
            {
              color: hasError
                ? tokens.colors.borderError
                : isValid
                ? tokens.colors.success
                : tokens.colors.textMuted,
            },
          ]}
          numberOfLines={2}
        >
          {hasError && typeof error === "string" ? error : helperText}
        </Text>
      ) : null}

      {/* Modal / Bottom Sheet */}
      <Modal visible={open} animationType="fade" transparent onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)} />

        <View style={styles.sheet}>
          {/* Handle bar */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{label || "Selecionar"}</Text>
            <Pressable onPress={() => setOpen(false)} hitSlop={8}>
              <Text style={{ color: tokens.colors.textMuted, fontWeight: "600" }}>Fechar</Text>
            </Pressable>
          </View>

          {/* Busca usando o novo Input */}
          {searchable && (
            <Input
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar..."
              label={undefined}
              size="md"
              variant="filled"
              left={<Text style={{ color: tokens.colors.textMuted }}>🔎</Text>}
              containerStyle={{ marginBottom: 10 }}
              autoFocus
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
          )}

          {/* Lista de opções */}
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.value)}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 16 }}
            ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
            renderItem={({ item }) => {
              const isSelected = selected?.value === item.value;
              const content = renderOption ? (
                renderOption(item, isSelected)
              ) : (
                <View
                  style={[
                    styles.option,
                    isSelected && { borderColor: tokens.colors.borderFocus },
                    item.disabled && { opacity: 0.5 },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.optionLabel}>{item.label}</Text>
                    {!!item.description && (
                      <Text style={styles.optionDesc}>{item.description}</Text>
                    )}
                  </View>
                  {isSelected ? <Text style={styles.check}>✓</Text> : null}
                </View>
              );

              return (
                <Pressable
                  onPress={() => handlePick(item)}
                  disabled={item.disabled}
                  style={({ pressed }) => [pressed ? { opacity: 0.9 } : null]}
                >
                  {content}
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <View style={{ padding: 16, alignItems: "center" }}>
                <Text style={{ color: tokens.colors.textMuted }}>Nenhuma opção</Text>
              </View>
            }
          />
        </View>
      </Modal>
    </View>
  );
}

/** ===================== ESTILOS ===================== */
const styles = StyleSheet.create({
  wrapper: { width: "100%", gap: 6 },
  label: { fontSize: tokens.font.label, fontWeight: "500" },

  /** Input */
  inputOuter: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: tokens.colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: tokens.spacing.md,
  },
  input: {
    flex: 1,
    color: tokens.colors.text,
    paddingHorizontal: 0,
  },
  adornLeft: {
    marginRight: tokens.spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  adornRight: {
    marginLeft: tokens.spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },

  /** Select */
  fieldOuter: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: tokens.colors.border,
    borderWidth: StyleSheet.hairlineWidth,
  },
  valueWrap: { flex: 1 },
  valueText: { color: tokens.colors.text, fontWeight: "500" },
  placeholder: { color: tokens.colors.placeholder },
  chevronWrap: { paddingHorizontal: tokens.spacing.md, height: "100%", justifyContent: "center" },

  helper: { fontSize: tokens.font.helper, lineHeight: 16 },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: tokens.colors.overlay,
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: tokens.colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 24 : 16,
    paddingHorizontal: 16,
    maxHeight: "70%",
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: tokens.colors.border,
    marginBottom: 8,
  },
  sheetHeader: {
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sheetTitle: { color: tokens.colors.text, fontWeight: "700", fontSize: 16 },

  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: tokens.colors.surfaceAlt,
    borderColor: tokens.colors.border,
    borderWidth: StyleSheet.hairlineWidth,
  },
  optionLabel: { color: tokens.colors.text, fontSize: 16, fontWeight: "500" },
  optionDesc: { color: tokens.colors.textMuted, fontSize: 12, marginTop: 2 },
  check: { color: tokens.colors.borderFocus, fontSize: 16, fontWeight: "800", marginLeft: 8 },
});
