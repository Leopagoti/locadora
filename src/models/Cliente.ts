export class Cliente {
    constructor(
        public nome: string,
        public cpf: string,
        public tipoCarteira: 'A' | 'B'
    ) {}
}
