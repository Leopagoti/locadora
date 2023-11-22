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
exports.listarVeiculosAlugados = exports.listarVeiculosDisponiveis = exports.cadastrarVeiculo = void 0;
const JsonDB_1 = require("../utils/JsonDB");
const Veiculo_1 = require("../models/Veiculo");
const veiculosDB = new JsonDB_1.JsonDB('data/veiculos.json');
function cadastrarVeiculo(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const veiculoData = JSON.parse(body);
        const novoVeiculo = new Veiculo_1.Veiculo(veiculoData.placa, veiculoData.tipo, veiculoData.valorDiaria);
        // Ler dados atuais
        const veiculos = yield veiculosDB.readData();
        // Verificar se a placa já existe
        if (veiculos.some(v => v.placa === novoVeiculo.placa)) {
            return { status: 400, message: 'Veículo com esta placa já cadastrado.' };
        }
        // Adicionar novo veículo
        veiculos.push(novoVeiculo);
        yield veiculosDB.writeData(veiculos);
        return { status: 200, message: 'Veículo cadastrado com sucesso!' };
    });
}
exports.cadastrarVeiculo = cadastrarVeiculo;
function listarVeiculosDisponiveis() {
    return __awaiter(this, void 0, void 0, function* () {
        const veiculos = yield veiculosDB.readData();
        const veiculosDisponiveis = veiculos.filter(veiculo => !veiculo.alugado);
        return { status: 200, veiculos: veiculosDisponiveis };
    });
}
exports.listarVeiculosDisponiveis = listarVeiculosDisponiveis;
function listarVeiculosAlugados() {
    return __awaiter(this, void 0, void 0, function* () {
        const veiculos = yield veiculosDB.readData();
        const veiculosAlugados = veiculos.filter(veiculo => veiculo.alugado);
        return { status: 200, veiculos: veiculosAlugados };
    });
}
exports.listarVeiculosAlugados = listarVeiculosAlugados;
