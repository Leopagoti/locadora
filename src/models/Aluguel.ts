import { Cliente } from "./Cliente";
import { Veiculo } from "./Veiculo";

export class Aluguel {

    valorTotal: number;

    constructor(
        public cliente: Cliente,
        public veiculo: Veiculo,
        public dias: number
    ) {
        this.valorTotal = this.calcularValorTotal();
    }

    calcularValorTotal(): number {
        let acrescimo = this.veiculo.tipo === 'carro' ? 0.10 : 0.05;
        return this.veiculo.valorDiaria * this.dias * (1 + acrescimo);
    }
}
