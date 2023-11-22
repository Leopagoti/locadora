function showSection(sectionId) {
    var sections = document.getElementsByClassName('form-section');

    // Oculta todas as seções, a menos que não haja uma seleção (sectionId vazio ou nulo)
    if (sectionId) {
        for (var i = 0; i < sections.length; i++) {
            sections[i].style.display = 'none';
        }
    }

    // Exibe a seção selecionada, se ela existir
    var section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
        if (sectionId === 'listar-veiculos') {
            carregarVeiculosDisponiveis();
        }
        else if (sectionId === 'listar-alugueis') {
            carregarVeiculosAlugados();
        }
    }
}

function carregarVeiculosDisponiveisPorTipo(tipoCarteira) {
    fetch('http://localhost:3000/listar-veiculos-disponiveis')
        .then(response => response.json())
        .then(data => {
            const selecaoVeiculoSelect = document.getElementById('selecao-veiculo');
            selecaoVeiculoSelect.innerHTML = ''; // Limpa as opções anteriores

            data.forEach(veiculo => {
                // Filtra os veículos pelo tipo de carteira selecionado
                if ((tipoCarteira === 'A' && veiculo.tipo === 'moto') || (tipoCarteira === 'B' && veiculo.tipo === 'carro')) {
                    const option = document.createElement('option');
                    option.value = veiculo.placa; // Aqui você coloca a placa como valor
                    option.textContent = `Placa: ${veiculo.placa}, Diária: ${veiculo.valorDiaria}`;
                    selecaoVeiculoSelect.appendChild(option);
                }
            });
        })
        .catch(error => console.error('Erro ao carregar veículos:', error));
}


document.addEventListener('DOMContentLoaded', () => {
    const tipoCarteiraSelect = document.getElementById('tipo-carteira');

    tipoCarteiraSelect.addEventListener('change', function() {
        carregarVeiculosDisponiveisPorTipo(this.value);
    });

    // Carrega inicialmente todos os veículos disponíveis
    carregarVeiculosDisponiveisPorTipo('');
});




function carregarVeiculosDisponiveis() {
fetch('http://localhost:3000/listar-veiculos-disponiveis')
    .then(response => response.json())
    .then(data => {
        const lista = document.getElementById('lista-veiculos-disponiveis');
        lista.innerHTML = ''; // Limpa a lista atual
        data.forEach(veiculo => {
            const item = document.createElement('div');
            item.innerText = `Placa: ${veiculo.placa}, Tipo: ${veiculo.tipo}, Diária: ${veiculo.valorDiaria}`;
            lista.appendChild(item);
        });
    })
    .catch(error => console.error('Erro ao carregar veículos:', error));
}

function carregarVeiculosAlugados() {
fetch('http://localhost:3000/listar-veiculos-alugados')
    .then(response => response.json())
    .then(data => {
        const lista = document.getElementById('lista-veiculos-alugados');
        lista.innerHTML = ''; // Limpa a lista atual
        data.forEach(veiculo => {
            const item = document.createElement('div');
            item.innerText = `Placa: ${veiculo.placa}, Tipo: ${veiculo.tipo}, Diária: ${veiculo.valorDiaria}`;
            lista.appendChild(item);
        });
    })
    .catch(error => console.error('Erro ao carregar veículos:', error));
}

document.addEventListener('DOMContentLoaded', (event) => {
    const cadastrarVeiculoForm = document.getElementById('cadastrar-veiculo-form');
    const messageContainer = document.getElementById('message-container');

    if (cadastrarVeiculoForm && messageContainer) {
        cadastrarVeiculoForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Impede o envio padrão do formulário

            // Limpa a mensagem anterior
            messageContainer.textContent = '';
            messageContainer.style.color = '';

            // Validação dos campos
            const placa = this.querySelector('[name="placa"]').value.trim();
            const tipo = this.querySelector('[name="tipo-veiculo"]').value.trim();
            const valorDiaria = this.querySelector('[name="valor-diaria"]').value.trim();

            if (!placa || !tipo || !valorDiaria) {
                messageContainer.textContent = 'Todos os campos são obrigatórios.';
                messageContainer.style.color = 'red';
                setTimeout(limparMensagem, 3000)
                return;
            }

            // Prepara os dados para enviar
            const veiculoData = { placa, tipo, valorDiaria };

            // Faz a requisição para o servidor
            fetch('http://localhost:3000/cadastrar-veiculo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(veiculoData)
            })
            .then(response => {
                const isResponseOk = response.ok;
                return response.json().then(data => ({ data, isResponseOk }));
            })
            .then(({ data, isResponseOk }) => {
                messageContainer.textContent = data.message;
                messageContainer.style.color = isResponseOk ? 'green' : 'red';
                if (isResponseOk) {
                    this.reset();                    
                    document.getElementById('menu-options').value = "";
                }
                setTimeout(limparMensagem, 3000)
            })
            .catch(error => {
                console.error('Erro:', error);
                messageContainer.textContent = 'Falha na comunicação com o servidor.';
                messageContainer.style.color = 'red';
                setTimeout(limparMensagem, 3000)
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    
    const alugarVeiculoForm = document.getElementById('alugar-veiculo-form');
    const messageContainer = document.getElementById('message-container');
    if (alugarVeiculoForm) {
        alugarVeiculoForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Limpa a mensagem anterior
            messageContainer.textContent = '';
            messageContainer.style.color = '';

            // Validação dos campos
            const nomeCliente = this.querySelector('[name="nome-cliente"]').value.trim();
            const cpfCliente = this.querySelector('[name="cpf-cliente"]').value.trim();
            const tipoCarteira = this.querySelector('[name="tipo-carteira"]').value;
            const placaVeiculo = this.querySelector('[name="selecao-veiculo"]').value;
            const diasAluguel = this.querySelector('[name="dias-aluguel"]').value;


            if (!nomeCliente || !cpfCliente || !tipoCarteira || !placaVeiculo) {
                messageContainer.textContent = 'Todos os campos são obrigatórios.';
                messageContainer.style.color = 'red';
                setTimeout(limparMensagem, 3000)
                return;
            }

            if (!diasAluguel || diasAluguel < 1) {
                messageContainer.textContent = 'Informe a quantidade de dias para o aluguel.';
                messageContainer.style.color = 'red';
                setTimeout(limparMensagem, 3000)
                return;
            }

            // Prepara os dados para enviar
            const aluguelData = { nomeCliente, cpfCliente, tipoCarteira, placaVeiculo, dias: diasAluguel };

            // Faz a requisição para o servidor
            fetch('http://localhost:3000/alugar-veiculo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(aluguelData)
            })
            .then(response => {
                const isResponseOk = response.ok;
                return response.json().then(data => ({ data, isResponseOk }));
            })
            .then(({ data, isResponseOk }) => {
                messageContainer.textContent = data.message;
                messageContainer.style.color = isResponseOk ? 'green' : 'red';
                if (isResponseOk) {
                    this.reset();                    
                    document.getElementById('menu-options').value = "";
                }
                setTimeout(limparMensagem, 3000)
            })
            .catch(error => {
                console.error('Erro:', error);
                messageContainer.textContent = 'Falha na comunicação com o servidor.';
                messageContainer.style.color = 'red';
                setTimeout(limparMensagem, 3000)
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const devolverVeiculoForm = document.getElementById('devolver-veiculo-form');
    const messageContainer = document.getElementById('message-container');

    if (devolverVeiculoForm) {
        devolverVeiculoForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const cpfCliente = this.querySelector('[name="cpf-cliente-devolucao"]').value.trim();
            if (!cpfCliente) {
                messageContainer.textContent = 'Por favor, informe o CPF do cliente.';
                messageContainer.style.color = 'red';
                return;
            }

            fetch('http://localhost:3000/devolver-veiculo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cpfCliente })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message || 'Erro desconhecido');
                    });
                }
                return response.json();
            })
            .then(data => {
                messageContainer.textContent = data.message || 'Operação realizada com sucesso';
                messageContainer.style.color = 'green';
                setTimeout(limparMensagem, 3000)
            })
            .catch(error => {
                console.error('Erro:', error);
                messageContainer.textContent = error.message;
                messageContainer.style.color = 'red';
                setTimeout(limparMensagem, 3000)
            });
        });
    }
});

function limparMensagem() {
    const messageContainer = document.getElementById('message-container');
    messageContainer.textContent = '';
    messageContainer.style.color = '';
}

