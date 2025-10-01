import { Produto } from "./produtoItf"

export interface Pedido {
  id: string
  comandaId: number
  produtoId: number
  quantidade: string
  precoUnitario: string
  subtotal: string
  observacoes: string
  produto: Produto
}