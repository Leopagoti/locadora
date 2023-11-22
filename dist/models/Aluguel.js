"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aluguel = void 0;
class Aluguel {
    constructor(cliente, veiculo, dias) {
        this.cliente = cliente;
        this.veiculo = veiculo;
        this.dias = dias;
        this.valorTotal = this.calcularValorTotal();
    }
    calcularValorTotal() {
        let acrescimo = this.veiculo.tipo === 'carro' ? 0.10 : 0.05;
        return this.veiculo.valorDiaria * this.dias * (1 + acrescimo);
    }
}
exports.Aluguel = Aluguel;
