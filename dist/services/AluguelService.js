"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.devolverVeiculo = exports.alugarVeiculo = void 0;
const JsonDB_1 = require("../utils/JsonDB");
const Cliente_1 = require("../models/Cliente");
const Aluguel_1 = require("../models/Aluguel");
const veiculosDB = new JsonDB_1.JsonDB('data/veiculos.json');
const alugueisDB = new JsonDB_1.JsonDB('data/alugueis.json');
function alugarVeiculo(dadosAluguel) {
    return __awaiter(this, void 0, void 0, function* () {
        const aluguelData = JSON.parse(dadosAluguel);
        const veiculos = yield veiculosDB.readData();
        const alugueisAtivos = yield alugueisDB.readData();
        const veiculo = veiculos.find(v => v.placa === aluguelData.placaVeiculo);
        if (!veiculo || veiculo.alugado) {
            return { status: 400, message: 'Veículo não disponível para aluguel.' };
        }
        // Verifica se o cliente já está alugando um veículo
        const clienteJaAlugando = alugueisAtivos.some(aluguel => aluguel.cliente.cpf === aluguelData.cpfCliente && aluguel.veiculo.alugado);
        if (clienteJaAlugando) {
            return { status: 400, message: 'Cliente já está alugando um veículo.' };
        }
        // Cria uma nova instância de Cliente com os dados do formulário
        const cliente = new Cliente_1.Cliente(aluguelData.nomeCliente, aluguelData.cpfCliente, aluguelData.tipoCarteira);
        // Verifica compatibilidade do tipo de veículo com a carteira do cliente
        if ((cliente.tipoCarteira === 'A' && veiculo.tipo !== 'moto') ||
            (cliente.tipoCarteira === 'B' && veiculo.tipo !== 'carro')) {
            return { status: 400, message: 'Tipo de veículo não compatível com a carteira do cliente.' };
        }
        veiculo.alugado = true;
        yield veiculosDB.writeData(veiculos);
        const novoAluguel = new Aluguel_1.Aluguel(cliente, veiculo, parseInt(aluguelData.dias));
        const valorTotal = novoAluguel.calcularValorTotal();
        const alugueis = yield alugueisDB.readData();
        alugueis.push(novoAluguel);
        yield alugueisDB.writeData(alugueis);
        return { status: 200, message: 'Veículo alugado com sucesso!', valorTotal: valorTotal };
    });
}
exports.alugarVeiculo = alugarVeiculo;
function devolverVeiculo(dadosDevolucao) {
    return __awaiter(this, void 0, void 0, function* () {
        const devolucaoData = JSON.parse(dadosDevolucao);
        const veiculos = yield veiculosDB.readData();
        const alugueis = yield alugueisDB.readData();
        // Encontra o aluguel ativo pelo CPF do cliente
        const aluguel = alugueis.find(aluguel => aluguel.cliente.cpf === devolucaoData.cpfCliente && aluguel.veiculo.alugado);
        if (!aluguel) {
            return { status: 400, message: 'Nenhum aluguel ativo encontrado para este CPF.' };
        }
        // Marca o veículo como disponível
        const veiculo = veiculos.find(v => v.placa === aluguel.veiculo.placa);
        if (veiculo) {
            veiculo.alugado = false;
            yield veiculosDB.writeData(veiculos);
        }
        //Remove o aluguel do registro de alugueis ativos
        const index = alugueis.indexOf(aluguel);
        if (index > -1) {
            alugueis.splice(index, 1);
            yield alugueisDB.writeData(alugueis);
        }
        return { status: 200, message: 'Veículo devolvido com sucesso.' };
    });
}
exports.devolverVeiculo = devolverVeiculo;
