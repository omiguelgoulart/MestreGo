import React, { useMemo } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "@/app/lib/status";
import { Calendar, LocaleConfig } from "react-native-calendars";

// Config de localização (pt-BR) uma vez:
LocaleConfig.locales["pt-br"] = {
  monthNames: ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],
  monthNamesShort: ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],
  dayNames: ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"],
  dayNamesShort: ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"],
};
LocaleConfig.defaultLocale = "pt-br";

type Props = {
  visible: boolean;
  selectedYmd?: string;
  onClose: () => void;
  onPick: (ymd: string) => void; // yyyy-mm-dd
};

export function Calendario({ visible, selectedYmd, onClose, onPick }: Props) {
  const marked = useMemo(
    () =>
      selectedYmd
        ? {
            [selectedYmd]: {
              selected: true,
              selectedColor: COLORS.accent,
              selectedTextColor: "#fff",
            },
          }
        : {},
    [selectedYmd]
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.calendarCard}>
          <Calendar
            onDayPress={(day) => onPick(day.dateString)}
            markedDates={marked}
            theme={{
              backgroundColor: COLORS.card,
              calendarBackground: COLORS.card,
              dayTextColor: COLORS.text,
              monthTextColor: COLORS.text,
              textSectionTitleColor: COLORS.textMuted,
              selectedDayBackgroundColor: COLORS.accent,
              selectedDayTextColor: "#fff",
              todayTextColor: COLORS.accent,
              arrowColor: COLORS.accent,
            }}
          />
          <View style={styles.footer}>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={{ color: COLORS.text }}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  calendarCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  footer: { flexDirection: "row", justifyContent: "flex-end", marginTop: 8 },
  closeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});
