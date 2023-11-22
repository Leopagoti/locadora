import { JsonDB } from '../utils/JsonDB';
import { Veiculo } from '../models/Veiculo';
import { Cliente } from '../models/Cliente';
import { Aluguel } from '../models/Aluguel';

const veiculosDB = new JsonDB('data/veiculos.json');
const alugueisDB = new JsonDB('data/alugueis.json');

export async function alugarVeiculo(dadosAluguel: string) {
    const aluguelData = JSON.parse(dadosAluguel);
    const veiculos = await veiculosDB.readData<Veiculo>();
    const alugueisAtivos = await alugueisDB.readData<Aluguel>();

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
    const cliente = new Cliente(
        aluguelData.nomeCliente,
        aluguelData.cpfCliente,
        aluguelData.tipoCarteira
    );

    // Verifica compatibilidade do tipo de veículo com a carteira do cliente
    if ((cliente.tipoCarteira === 'A' && veiculo.tipo !== 'moto') || 
        (cliente.tipoCarteira === 'B' && veiculo.tipo !== 'carro')) {
        return { status: 400, message: 'Tipo de veículo não compatível com a carteira do cliente.' };
    }

    veiculo.alugado = true;
    await veiculosDB.writeData(veiculos);

    const novoAluguel = new Aluguel(cliente, veiculo, parseInt(aluguelData.dias));
    const valorTotal = novoAluguel.calcularValorTotal();
    const alugueis = await alugueisDB.readData<Aluguel>();
    alugueis.push(novoAluguel);
    await alugueisDB.writeData(alugueis);

    return { status: 200, message: 'Veículo alugado com sucesso!', valorTotal: valorTotal };
}

export async function devolverVeiculo(dadosDevolucao: string) {
    const devolucaoData = JSON.parse(dadosDevolucao);
    const veiculos = await veiculosDB.readData<Veiculo>();
    const alugueis = await alugueisDB.readData<Aluguel>();

    // Encontra o aluguel ativo pelo CPF do cliente
    const aluguel = alugueis.find(aluguel => aluguel.cliente.cpf === devolucaoData.cpfCliente && aluguel.veiculo.alugado);

    if (!aluguel) {
        return { status: 400, message: 'Nenhum aluguel ativo encontrado para este CPF.' };
    }

    // Marca o veículo como disponível
    const veiculo = veiculos.find(v => v.placa === aluguel.veiculo.placa);
    if (veiculo) {
        veiculo.alugado = false;
        await veiculosDB.writeData(veiculos);
    }

    //Remove o aluguel do registro de alugueis ativos
    const index = alugueis.indexOf(aluguel);
    if (index > -1) {
        alugueis.splice(index, 1);
        await alugueisDB.writeData(alugueis);
    }

    return { status: 200, message: 'Veículo devolvido com sucesso.' };
}

