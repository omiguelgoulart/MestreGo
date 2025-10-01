import React from "react";
import { View, Text, Pressable, StyleSheet, ViewStyle } from "react-native";

// 🔹 Componente principal
type RootProps = {
  onPress?: () => void;
  style?: ViewStyle;
  children: React.ReactNode;
};

const CardRoot = ({ onPress, style, children }: RootProps) => {
  const Container = onPress ? Pressable : View;
  return (
    <Container style={[styles.base, style]} onPress={onPress}>
      {children}
    </Container>
  );
};

// 🔹 Header
const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.header}>{children}</View>
);

// 🔹 Title
const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <Text style={styles.title}>{children}</Text>
);

// 🔹 Subtitle
const CardSubtitle = ({ children }: { children: React.ReactNode }) => (
  <Text style={styles.subtitle}>{children}</Text>
);

// 🔹 Content
export const CardContent = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.content}>{children}</View>
);

// 🔹 Footer
const CardFooter = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.footer}>{children}</View>
);

// 🔹 Exportando tudo em um só objeto (igual shadcn)
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Subtitle: CardSubtitle,
  Content: CardContent,
  Footer: CardFooter,
});

// 🎨 Estilos
const styles = StyleSheet.create({
  base: {
    backgroundColor: "#1F2126",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    marginBottom: 12,
    // 👇 estes dois garantem “full width” quando você quiser
    width: "100%",
    alignSelf: "stretch",
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "#aaa",
  },
  content: {
    marginVertical: 8,
  },
  footer: {
    marginTop: 8,
    paddingTop: 8,
    fontSize: 13,
    color: "#aaa",
  },
});
