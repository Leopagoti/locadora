import { JsonDB } from '../utils/JsonDB';
import { Veiculo } from '../models/Veiculo';

const veiculosDB = new JsonDB('data/veiculos.json');

export async function cadastrarVeiculo(body: string) {
    const veiculoData = JSON.parse(body);
    const novoVeiculo = new Veiculo(
        veiculoData.placa,
        veiculoData.tipo,
        veiculoData.valorDiaria
    );

    // Ler dados atuais
    const veiculos = await veiculosDB.readData<Veiculo>();

    // Verificar se a placa já existe
    if (veiculos.some(v => v.placa === novoVeiculo.placa)) {
        return { status: 400, message: 'Veículo com esta placa já cadastrado.' };
    }

    // Adicionar novo veículo
    veiculos.push(novoVeiculo);
    await veiculosDB.writeData(veiculos);

    return { status: 200, message: 'Veículo cadastrado com sucesso!' };
}

export async function listarVeiculosDisponiveis() {
    const veiculos = await veiculosDB.readData<Veiculo>();
    const veiculosDisponiveis = veiculos.filter(veiculo => !veiculo.alugado);
    return { status: 200, veiculos: veiculosDisponiveis };
}

export async function listarVeiculosAlugados() {
    const veiculos = await veiculosDB.readData<Veiculo>();
    const veiculosAlugados = veiculos.filter(veiculo => veiculo.alugado);
    return { status: 200, veiculos: veiculosAlugados };
}
