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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const url_1 = __importDefault(require("url"));
const JsonDB_1 = require("./utils/JsonDB");
const VeiculoService_1 = require("./services/VeiculoService");
const AluguelService_1 = require("./services/AluguelService");
const veiculosDB = new JsonDB_1.JsonDB('data/veiculos.json');
const server = http_1.default.createServer((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Configurações CORS para todas as respostas
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    // Tratamento da requisição OPTIONS para CORS
    if (req.method === 'OPTIONS') {
        res.writeHead(204); // 204 No Content
        res.end();
        return;
    }
    const parsedUrl = url_1.default.parse(req.url || '', true);
    if (parsedUrl.pathname === '/cadastrar-veiculo' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const result = yield (0, VeiculoService_1.cadastrarVeiculo)(body);
                res.writeHead(result.status, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: result.message }));
            }
            catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Dados de veículo inválidos.' }));
            }
        }));
    }
    else if (parsedUrl.pathname === '/listar-veiculos-disponiveis' && req.method === 'GET') {
        const result = yield (0, VeiculoService_1.listarVeiculosDisponiveis)();
        res.writeHead(result.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.veiculos));
    }
    else if (parsedUrl.pathname === '/listar-veiculos-alugados' && req.method === 'GET') {
        const result = yield (0, VeiculoService_1.listarVeiculosAlugados)();
        res.writeHead(result.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.veiculos));
    }
    else if (parsedUrl.pathname === '/alugar-veiculo' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const result = yield (0, AluguelService_1.alugarVeiculo)(body);
                console.log('Dados recebidos:', body);
                res.writeHead(result.status, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: result.message, valorTotal: result.valorTotal }));
            }
            catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Erro ao processar o aluguel.' }));
            }
        }));
    }
    else if (parsedUrl.pathname === '/devolver-veiculo' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const result = yield (0, AluguelService_1.devolverVeiculo)(body);
                res.writeHead(result.status, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: result.message }));
            }
            catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Erro ao processar a devolução.' }));
            }
        }));
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Endpoint não encontrado' }));
    }
}));
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
