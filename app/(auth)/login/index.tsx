import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/app/contexts/AuthContext";
import { COLORS } from "@/app/lib/status";

const schema = z.object({
  email: z.string().trim().email("E-mail inválido"),
  senha: z.string().min(6, "Mínimo de 6 caracteres"),
});

type FormLogin = z.infer<typeof schema>;

export default function PageLogin() {
  const { login: authLogin, token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormLogin>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", senha: "" },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (token) router.replace("/");
  }, [token]);

  async function doLogin(values: FormLogin) {
    const payload = {
      email: values.email.trim().toLowerCase(),
      senha: values.senha,
    };

    const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    let data: any = null;
    try {
      data = await res.json();
    } catch {
      // pode vir vazio
    }

    if (!res.ok) {
      const msg = data?.message || `Erro ${res.status}`;
      throw new Error(msg);
    }

    // Espera-se algo como { token, user }
    if (!data?.token) {
      throw new Error("Resposta inválida do servidor.");
    }

    return data as { token: string; user?: any };
  }

  const onSubmit = async (form: FormLogin) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorText(null);
    try {
      const resp = await doLogin(form);
      // ✅ salva no contexto (e AsyncStorage via AuthContext)
      await authLogin(resp.token);
      router.replace("/"); // home protegida
    } catch (e: any) {
      const msg = e?.message ?? "Não foi possível entrar. Tente novamente.";
      setErrorText(msg);
      console.error("Falha no login:", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: COLORS.bg }}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* 🔹 Logo separado do Card */}
          <Image
            source={require("@/assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Card style={styles.card}>
            <Card.Header>
              <Card.Title>Login</Card.Title>
              {!!errorText && (
                <Text style={styles.errorTop}>{errorText}</Text>
              )}
            </Card.Header>

            <Card.Content>
              <View style={styles.field}>
                <Label>E-mail</Label>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder="email@exemplo.com"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="email-address"
                      value={value}
                      onChangeText={onChange}
                      returnKeyType="next"
                    />
                  )}
                />
                {errors.email && (
                  <Text style={styles.error}>{errors.email.message}</Text>
                )}
              </View>

              <View style={styles.field}>
                <Label>Senha</Label>
                <Controller
                  control={control}
                  name="senha"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder="••••••"
                      secureTextEntry
                      value={value}
                      onChangeText={onChange}
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit(onSubmit)}
                    />
                  )}
                />
                {errors.senha && (
                  <Text style={styles.error}>{errors.senha.message}</Text>
                )}
              </View>

              <View style={styles.actions}>
                <Button
                  isDisabled={isSubmitting}
                  onPress={handleSubmit(onSubmit)}
                >
                  {isSubmitting ? "Entrando..." : "Entrar"}
                </Button>

                <Link href={{ pathname: "./cadastro" }} asChild>
                  <Button variant="outline">Criar Conta</Button>
                </Link>

                <Link href={{ pathname: "./recuperar-senha" }} asChild>
                  <Button variant="ghost" size="sm">
                    Esqueceu a senha?
                  </Button>
                </Link>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  logo: {
    width: 160,
    height: 160,
    alignSelf: "center",
    marginBottom: 16,
  },
  card: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    padding: 16,
  },
  field: { marginBottom: 14 },
  actions: { paddingTop: 4, gap: 12 },
  error: { color: "red", fontSize: 12, marginTop: 4 },
  errorTop: { color: "red", marginTop: 8, fontSize: 13, textAlign: "center" },
});
