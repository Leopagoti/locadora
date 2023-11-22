"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Veiculo = void 0;
class Veiculo {
    constructor(placa, tipo, valorDiaria, alugado = false) {
        this.placa = placa;
        this.tipo = tipo;
        this.valorDiaria = valorDiaria;
        this.alugado = alugado;
    }
}
exports.Veiculo = Veiculo;
