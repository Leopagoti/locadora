export class Veiculo {

    public alugado: boolean;

    constructor(
        public placa: string,
        public tipo: 'carro' | 'moto',
        public valorDiaria: number,
        alugado: boolean = false 
    ) {
        this.alugado = alugado;
    }
}
