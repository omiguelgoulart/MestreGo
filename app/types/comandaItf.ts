import { Pedido } from "./pedidoItf"

export interface ComandaItf {
  id: number
  numero: number
  data: string // ou Date se você já converter
  status: "ABERTA" | "FECHADA" | "CANCELADA" | "PENDENTE"
  pedidos: Pedido[]
}