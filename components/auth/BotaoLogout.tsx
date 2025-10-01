import React from "react";
import { router } from "expo-router";
import { useAuth } from "@/app/contexts/AuthContext";
import { Button } from "../ui/button";

export function Logout() {
  const { logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();       // limpa token do AsyncStorage/contexto
      router.replace("/login"); // volta para a tela de login
    } catch (err) {
      console.error("Erro no logout:", err);
    }
  }

  return (
    <Button variant="outline" onPress={handleLogout}>
      Sair
    </Button>
  );
}
