import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "../ui/button";

type NovaComandaProps = {
  onPress?: () => void;
};

export function NovaComanda({ onPress }: NovaComandaProps) {
  
  return (
    <View style={styles.container}>
      <Button variant="default" onPress={onPress} style={styles.botao}>Nova comanda</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  botao: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
});
