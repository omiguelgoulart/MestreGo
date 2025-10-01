import { ComandaItf } from "../types/comandaItf";

 
export function calcularValor(comanda: ComandaItf): number {
    if (!comanda.pedidos || comanda.pedidos.length === 0) {
        console.log("Total calculado: 0");
        return 0;
    }

    const total = comanda.pedidos.reduce((acumulador, item) => {
        const quantidade = parseFloat(item.quantidade);
        const preco = parseFloat(item.precoUnitario);

        if (isNaN(quantidade) || isNaN(preco) || quantidade < 0 || preco < 0) {
            console.warn(`Aviso: Item inválido encontrado no pedido ${item.id}. Quantidade: '${item.quantidade}', Preço: '${item.precoUnitario}'.`);
            return acumulador;
        }

        const subtotalRecalculado = quantidade * preco;
        return acumulador + subtotalRecalculado;
    }, 0);

    const totalArredondado = parseFloat(total.toFixed(2));
    console.log("Total calculado:", totalArredondado);
    return totalArredondado;
}
