import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";

type ModalBaseProps = {
  open: boolean;
  onOpenChange?: (v: boolean) => void;
  children: React.ReactNode;
  dismissOnOverlayPress?: boolean;
  maxWidth?: number;
  animationDuration?: number;
};

export function ModalBase({
  open,
  onOpenChange,
  children,
  dismissOnOverlayPress = true,
  maxWidth = 520,
  animationDuration = 160,
}: ModalBaseProps) {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: animationDuration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 7,
          tension: 80,
        }),
      ]).start();
    } else {
      fade.setValue(0);
      scale.setValue(0.96);
    }
  }, [open, fade, scale, animationDuration]);

  const handleClose = () => onOpenChange?.(false);

  return (
    <Modal
      visible={open}
      transparent
      statusBarTranslucent
      animationType="none"
      onRequestClose={handleClose} // Android back
    >
      <Animated.View style={[styles.overlay, { opacity: fade }]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={dismissOnOverlayPress ? handleClose : undefined}
          accessibilityLabel="Fechar"
        />
      </Animated.View>

      <View style={styles.centerWrap} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.content,
            { maxWidth, transform: [{ scale }], opacity: fade },
          ]}
          accessibilityViewIsModal
          accessibilityLiveRegion="polite"
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  centerWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  content: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#111111",
    padding: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#2A2A2A",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
});
