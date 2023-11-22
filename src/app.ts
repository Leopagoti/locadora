import http from 'http';
import url from 'url';
import { JsonDB } from './utils/JsonDB';
import { cadastrarVeiculo, listarVeiculosAlugados, listarVeiculosDisponiveis } from './services/VeiculoService';
import { alugarVeiculo, devolverVeiculo } from './services/AluguelService';

const veiculosDB = new JsonDB('data/veiculos.json');

const server = http.createServer(async (req, res) => {

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
    
    const parsedUrl = url.parse(req.url || '', true);

    if (parsedUrl.pathname === '/cadastrar-veiculo' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
            const result = await cadastrarVeiculo(body);
            res.writeHead(result.status, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: result.message }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Dados de veículo inválidos.' }));
            }
        });
    } else if (parsedUrl.pathname === '/listar-veiculos-disponiveis' && req.method === 'GET') {
        const result = await listarVeiculosDisponiveis();
        res.writeHead(result.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.veiculos));
    } else if (parsedUrl.pathname === '/listar-veiculos-alugados' && req.method === 'GET') {
        const result = await listarVeiculosAlugados();
        res.writeHead(result.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.veiculos));
    } else if (parsedUrl.pathname === '/alugar-veiculo' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const result = await alugarVeiculo(body);
                
                console.log('Dados recebidos:', body);

                res.writeHead(result.status, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: result.message, valorTotal: result.valorTotal }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Erro ao processar o aluguel.' }));
            }
        });
    } else if (parsedUrl.pathname === '/devolver-veiculo' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const result = await devolverVeiculo(body);
                res.writeHead(result.status, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: result.message }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Erro ao processar a devolução.' }));
            }
        });
    } 
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Endpoint não encontrado' }));
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
