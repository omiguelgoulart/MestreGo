import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";

type Produto = {
  id: string;
  nome: string;
  preco: number;
  imagem: string;
};

type Item = {
  produtoId: string;
  nome: string;
  preco: number;
  quantidade: number;
  imagem: string;
};

const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function ComandaDetalhe() {
  // mock do cardápio (substitua por GET /produtos)
  const cardapio: Produto[] = useMemo(() => [
    {
      id: "p1",
      nome: "X-Salada",
      preco: 28.5,
      imagem: "https://img.icons8.com/color/96/hamburger.png",
    },
    {
      id: "p2",
      nome: "Refrigerante Lata 350ml",
      preco: 6,
      imagem: "https://img.icons8.com/color/96/soda-can.png",
    },
    {
      id: "p3",
      nome: "Batata Frita",
      preco: 18.9,
      imagem: "https://img.icons8.com/color/96/french-fries.png",
    },
  ], []);

  const [itens, setItens] = useState<Item[]>([
    {
      produtoId: "p1",
      nome: "X-Salada",
      preco: 28.5,
      quantidade: 2,
      imagem: "https://img.icons8.com/color/96/hamburger.png",
    },
    {
      produtoId: "p2",
      nome: "Refrigerante Lata 350ml",
      preco: 6,
      quantidade: 1,
      imagem: "https://img.icons8.com/color/96/soda-can.png",
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [busca, setBusca] = useState("");

  const subtotal = useMemo(
    () => itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0),
    [itens]
  );
  const taxa = subtotal * 0.1;
  const total = subtotal + taxa;

  function alterarQtd(produtoId: string, delta: number) {
    setItens((prev) => {
      const novo = prev
        .map((i) =>
          i.produtoId === produtoId
            ? { ...i, quantidade: i.quantidade + delta }
            : i
        )
        .filter((i) => i.quantidade > 0);
      return novo;
    });
  }

  function adicionarItem(p: Produto) {
    setItens((prev) => {
      const existe = prev.find((i) => i.produtoId === p.id);
      if (existe) {
        return prev.map((i) =>
          i.produtoId === p.id ? { ...i, quantidade: i.quantidade + 1 } : i
        );
      }
      return [
        ...prev,
        {
          produtoId: p.id,
          nome: p.nome,
          preco: p.preco,
          quantidade: 1,
          imagem: p.imagem,
        },
      ];
    });
    setModalVisible(false);
    setBusca("");
  }

  const resultados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return cardapio;
    return cardapio.filter((p) => p.nome.toLowerCase().includes(q));
  }, [busca, cardapio]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Comanda 123</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>ABERTA</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <Text style={[styles.tab, styles.tabActive]}>Itens</Text>
        <Text style={styles.tab}>Pagamento</Text>
        <Text style={styles.tab}>Histórico</Text>
      </View>



      <ScrollView style={{ flex: 1 }}>
        {/* Lista de Itens */}
        {itens.map((item) => (
          <View key={item.produtoId} style={styles.itemCard}>
            <Image source={{ uri: item.imagem }} style={styles.itemImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.itemNome}>{item.nome}</Text>
              <Text style={styles.itemPreco}>
                {formatBRL(item.preco * item.quantidade)}
              </Text>
            </View>
            <View style={styles.qtdContainer}>
              <Pressable
                style={styles.qtdButton}
                onPress={() => alterarQtd(item.produtoId, -1)}
              >
                <Text style={styles.qtdText}>-</Text>
              </Pressable>
              <Text style={styles.qtdValue}>{item.quantidade}</Text>
              <Pressable
                style={styles.qtdButton}
                onPress={() => alterarQtd(item.produtoId, +1)}
              >
                <Text style={styles.qtdText}>+</Text>
              </Pressable>
            </View>
          </View>
        ))}

        {/* Adicionar item */}
        <Pressable
          onPress={() => setModalVisible(true)}
          style={styles.addRow}
          android_ripple={{ color: "#1f2937" }}
        >
          <View style={styles.addIcon}>
            <Text style={styles.addIconText}>＋</Text>
          </View>
          <Text style={styles.addRowText}>Adicionar item</Text>
        </Pressable>

        {/* Resumo */}
        <View style={styles.resumo}>
          <View style={styles.row}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>{formatBRL(subtotal)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Taxa de serviço (10%)</Text>
            <Text style={styles.value}>{formatBRL(taxa)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Desconto</Text>
            <Text style={styles.value}>{formatBRL(0)}</Text>
          </View>
          <View style={styles.rowTotal}>
            <Text style={styles.total}>Total</Text>
            <Text style={styles.total}>{formatBRL(total)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Ações */}
      <View style={styles.footer}>
        <Pressable style={styles.botaoFechar}>
          <Text style={styles.botaoTexto}>Fechar comanda</Text>
        </Pressable>
        <Pressable style={styles.botaoImprimir}>
          <Text style={styles.botaoTexto}>Imprimir</Text>
        </Pressable>
      </View>

      {/* MODAL ADICIONAR ITEM */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adicionar item</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.fechar}>Fechar</Text>
              </Pressable>
            </View>

            <TextInput
              placeholder="Buscar no cardápio..."
              placeholderTextColor="#9CA3AF"
              value={busca}
              onChangeText={setBusca}
              style={styles.search}
            />

            <ScrollView style={{ maxHeight: 420 }}>
              {resultados.map((p) => (
                <View key={p.id} style={styles.prodCard}>
                  <Image source={{ uri: p.imagem }} style={styles.prodImg} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.prodNome}>{p.nome}</Text>
                    <Text style={styles.prodPreco}>{formatBRL(p.preco)}</Text>
                  </View>
                  <Pressable
                    style={styles.prodAddBtn}
                    onPress={() => adicionarItem(p)}
                  >
                    <Text style={styles.prodAddTxt}>Adicionar</Text>
                  </Pressable>
                </View>
              ))}

              {resultados.length === 0 && (
                <Text style={styles.vazio}>Nada encontrado</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ====== estilos ====== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D0D", padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  statusBadge: { backgroundColor: "#166534", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  statusText: { color: "#fff", fontWeight: "600" },
  tabs: { flexDirection: "row", marginTop: 16, marginBottom: 8 },
  tab: { color: "#A1A1AA", marginRight: 20, fontSize: 16 },
  tabActive: { color: "#fff", borderBottomWidth: 2, borderBottomColor: "#fff" },
  info: { color: "#A1A1AA", marginBottom: 16 },

  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#18181b",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemImage: { width: 40, height: 40, marginRight: 12, borderRadius: 8 },
  itemNome: { color: "#fff", fontSize: 16, fontWeight: "500" },
  itemPreco: { color: "#A1A1AA", marginTop: 4 },
  qtdContainer: { flexDirection: "row", alignItems: "center" },
  qtdButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
  },
  qtdText: { color: "#fff", fontSize: 18, lineHeight: 18 },
  qtdValue: { color: "#fff", marginHorizontal: 10, fontSize: 16 },

  /* adicionar item */
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  addIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  addIconText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  addRowText: { color: "#E5E7EB", fontSize: 16, fontWeight: "600" },

  resumo: { marginTop: 12, padding: 12, borderTopWidth: 1, borderTopColor: "#2A2A2A" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  rowTotal: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  label: { color: "#A1A1AA" },
  value: { color: "#fff" },
  total: { color: "#fff", fontWeight: "bold", fontSize: 18 },

  footer: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  botaoFechar: {
    flex: 1,
    backgroundColor: "#166534",
    padding: 14,
    borderRadius: 10,
    marginRight: 8,
    alignItems: "center",
  },
  botaoImprimir: {
    flex: 1,
    backgroundColor: "#2A2A2A",
    padding: 14,
    borderRadius: 10,
    marginLeft: 8,
    alignItems: "center",
  },
  botaoTexto: { color: "#fff", fontWeight: "600" },

  /* modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#0F0F0F",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  modalTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  fechar: { color: "#9CA3AF", fontWeight: "600" },
  search: {
    backgroundColor: "#18181b",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#fff",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#262626",
  },
  prodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#151515",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#262626",
  },
  prodImg: { width: 40, height: 40, marginRight: 12, borderRadius: 8 },
  prodNome: { color: "#fff", fontSize: 16, fontWeight: "600" },
  prodPreco: { color: "#A1A1AA", marginTop: 4 },
  prodAddBtn: {
    backgroundColor: "#1f5f3a",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  prodAddTxt: { color: "#fff", fontWeight: "700" },
  vazio: { color: "#9CA3AF", textAlign: "center", paddingVertical: 20 },
});
