import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { router } from "expo-router";

// ✅ Schema com Zod
const schema = z
  .object({
    nome: z.string().trim().min(1, "Informe seu nome"),
    email: z.string().trim().email("E-mail inválido"),
    senha: z.string().min(6, "Mínimo de 6 caracteres"),
    confirmarSenha: z.string().min(1, "Confirme a senha"),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    path: ["confirmarSenha"],
    message: "As senhas não coincidem",
  });

type FormCadastro = z.infer<typeof schema>;

export default function CadastroForm() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormCadastro>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
    },
  });

  async function onSubmit(data: FormCadastro) {
    // monta objeto sem confirmarSenha
    const novoUsuario = {
      nome: data.nome,
      email: data.email,
      senha: data.senha,
    };

    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/usuario`,
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(novoUsuario),
      }
    );

    if (response.status === 201) {
      console.log("Ok! Usuário cadastrado com sucesso");
      reset();
      router.replace("/login");
    } else {
      console.error("Erro no cadastro do usuário...");
    }
  }

  return (
    <View>
      <View style={styles.field}>
        <Label>Nome</Label>
        <Controller
          control={control}
          name="nome"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Digite seu nome"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.nome && <Text style={styles.error}>{errors.nome.message}</Text>}
      </View>

      <View style={styles.field}>
        <Label>E-mail</Label>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="voce@exemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
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
            />
          )}
        />
        {errors.senha && (
          <Text style={styles.error}>{errors.senha.message}</Text>
        )}
      </View>

      <View style={styles.field}>
        <Label>Confirmar Senha</Label>
        <Controller
          control={control}
          name="confirmarSenha"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="••••••"
              secureTextEntry
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.confirmarSenha && (
          <Text style={styles.error}>{errors.confirmarSenha.message}</Text>
        )}
      </View>

      <Button onPress={handleSubmit(onSubmit)}>Cadastrar</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 14 },
  error: { color: "red", fontSize: 12, marginTop: 4 },
});
