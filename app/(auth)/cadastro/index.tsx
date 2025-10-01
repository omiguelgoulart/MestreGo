import { COLORS } from "@/app/lib/status";
import CadastroForm from "../../../components/CadastroForm";
import { Card } from "../../../components/ui/card";
import React, { useState } from "react";

import {
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

export default function PageCadastro() {
  const { height: screenH } = useWindowDimensions();
  const [boxH, setBoxH] = useState(0);

  const onMeasure = (e: LayoutChangeEvent) => {
    setBoxH(e.nativeEvent.layout.height);
  };

  // divide o espaço livre igualmente (topo/baixo). mínimo de 16.
  const verticalPad = Math.max((screenH - boxH) / 2, 16);

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80} // ajusta conforme altura do header
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: verticalPad, paddingBottom: verticalPad },
          ]}
        >
          {/* Wrapper medido */}
          <View style={styles.box} onLayout={onMeasure}>
            <Card style={styles.card}>
              <Card.Header>
                <Card.Title>Cadastro</Card.Title>
              </Card.Header>
              <Card.Content>
                <CadastroForm />
              </Card.Content>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    paddingHorizontal: 16,
  },
  box: {
    // controla a largura e permite medir o bloco todo (card + conteúdo)
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },
  card: {
    // estilização do card em si
    width: "100%",
    padding: 16,
  },
});
