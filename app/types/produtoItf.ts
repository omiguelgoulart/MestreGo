export interface Produto {
  id: number
  nome: string
  descricao: string
  preco: string
  estoque: number
  ativo: boolean
  imagem: string | null
  categoriaId: number
  tipo_item: "REFEICAO_FIXO" | string
}