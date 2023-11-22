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
      } else if (sectionId === 'listar-alugueis') {
        carregarVeiculosAlugados();
      }
    }
  }
  
  function carregarVeiculosDisponiveisPorTipo(tipoCarteira) {
    fetch('http://localhost:3000/listar-veiculos-disponiveis')
      .then(response => response.json())
      .then(data => {
        const selecaoVeiculoSelect = document.getElementById('selecao-veiculo');
        // Limpa as opções anteriores
        selecaoVeiculoSelect.innerHTML = '';
  
        data.forEach(veiculo => {
          // Filtra os veículos pelo tipo de carteira selecionado
          if ((tipoCarteira === 'A' && veiculo.tipo === 'moto') || (tipoCarteira === 'B' && veiculo.tipo === 'carro')) {
            const option = document.createElement('option');
            option.value = veiculo.placa;
            option.textContent = `Placa: ${veiculo.placa}, Diária: R$ ${parseFloat(veiculo.valorDiaria).toFixed(2)}`;
            option.setAttribute('data-valor-diaria', veiculo.valorDiaria);
            option.setAttribute('data-tipo-veiculo', veiculo.tipo);
            selecaoVeiculoSelect.appendChild(option);
          }
        });
      })
      .catch(error => console.error('Erro ao carregar veículos:', error));
  }
  
  
  document.addEventListener('DOMContentLoaded', () => {
    const tipoCarteiraSelect = document.getElementById('tipo-carteira');
  
    tipoCarteiraSelect.addEventListener('change', function () {
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
        // Limpa a lista atual
        lista.innerHTML = '';
        data.forEach(veiculo => {
          const item = document.createElement('div');
          item.innerText = `Placa: ${veiculo.placa}, Tipo: ${veiculo.tipo}, Diária: R$ ${veiculo.valorDiaria}`;
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
        lista.innerHTML = '';
        data.forEach(veiculo => {
          const item = document.createElement('div');
          item.innerText = `Placa: ${veiculo.placa}, Tipo: ${veiculo.tipo}, Diária: R$ ${veiculo.valorDiaria}`;
          lista.appendChild(item);
        });
      })
      .catch(error => console.error('Erro ao carregar veículos:', error));
  }
  
  document.getElementById('valor-diaria-formatado').addEventListener('input', function (e) {
    let valor = e.target.value.replace(/\D/g, '');
    valor = (valor / 100).toFixed(2) + '';
    valor = valor.replace('.', ',');
    e.target.value = 'R$ ' + valor;
    document.getElementById('valor-diaria').value = valor.replace(',', '.');
  });
  
  document.addEventListener('DOMContentLoaded', (event) => {
    const cadastrarVeiculoForm = document.getElementById('cadastrar-veiculo-form');
    const messageContainer = document.getElementById('message-container');
  
    if (cadastrarVeiculoForm && messageContainer) {
      cadastrarVeiculoForm.addEventListener('submit', function (e) {
        // Impede o envio padrão do formulário
        e.preventDefault();
  
        // Limpa a mensagem anterior
        messageContainer.textContent = '';
        messageContainer.style.color = '';
  
        // Validação dos campos
        const placa = this.querySelector('[name="placa"]').value.trim();
        const tipo = this.querySelector('[name="tipo-veiculo"]').value.trim();
        const valorDiaria = this.querySelector('[name="valor-diaria"]').value;
  
        if (!placa || !tipo || !valorDiaria) {
          messageContainer.textContent = 'Todos os campos são obrigatórios.';
          messageContainer.style.color = 'red';
          setTimeout(limparMensagem, 3000)
          return;
        }
  
        const valorDiariaNumerico = parseFloat(valorDiaria);
  
        if (isNaN(valorDiariaNumerico) || valorDiariaNumerico < 1.0) {
          messageContainer.textContent = 'O valor da diária deve ser pelo menos R$ 1,00.';
          messageContainer.style.color = 'red';
          setTimeout(limparMensagem, 3000);
          return;
        }
  
        // Prepara os dados para enviar
        const veiculoData = {placa, tipo, valorDiaria};
  
        // Faz a requisição para o servidor
        fetch('http://localhost:3000/cadastrar-veiculo', {
          method: 'POST', headers: {
            'Content-Type': 'application/json'
          }, body: JSON.stringify(veiculoData)
        })
          .then(response => {
            const isResponseOk = response.ok;
            return response.json().then(data => ({data, isResponseOk}));
          })
          .then(({data, isResponseOk}) => {
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
      alugarVeiculoForm.addEventListener('submit', function (e) {
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

        if (!validaCPF(cpfCliente)) {
            messageContainer.textContent = 'CPF inválido.';
            messageContainer.style.color = 'red';
            setTimeout(limparMensagem, 3000);
            return;
        }
  
        if (!diasAluguel || diasAluguel < 1) {
          messageContainer.textContent = 'Informe a quantidade de dias para o aluguel.';
          messageContainer.style.color = 'red';
          setTimeout(limparMensagem, 3000)
          return;
        }
  
        // Prepara os dados para enviar
        const aluguelData = {nomeCliente, cpfCliente, tipoCarteira, placaVeiculo, dias: diasAluguel};
  
        // Faz a requisição para o servidor
        fetch('http://localhost:3000/alugar-veiculo', {
          method: 'POST', headers: {
            'Content-Type': 'application/json'
          }, body: JSON.stringify(aluguelData)
        })
          .then(response => {
            const isResponseOk = response.ok;
            return response.json().then(data => ({data, isResponseOk}));
          })
          .then(({data, isResponseOk}) => {
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
      devolverVeiculoForm.addEventListener('submit', function (e) {
        e.preventDefault();
  
        const cpfCliente = this.querySelector('[name="cpf-cliente-devolucao"]').value.trim();
        if (!cpfCliente) {
          messageContainer.textContent = 'Por favor, informe o CPF do cliente.';
          messageContainer.style.color = 'red';
          return;
        }

        if (!validaCPF(cpfCliente)) {
            messageContainer.textContent = 'CPF inválido. Por favor, verifique.';
            messageContainer.style.color = 'red';
            setTimeout(limparMensagem, 3000)
            return;
        }
  
        fetch('http://localhost:3000/devolver-veiculo', {
          method: 'POST', headers: {
            'Content-Type': 'application/json'
          }, body: JSON.stringify({cpfCliente})
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
  
  document.addEventListener('DOMContentLoaded', () => {
  
    const selecaoVeiculoSelect = document.getElementById('selecao-veiculo');
    const diasAluguelInput = document.getElementById('dias-aluguel');
    const precoPrevia = document.getElementById('preco-previa');
  
    function atualizarPreviaValor() {
      const veiculoSelecionado = selecaoVeiculoSelect.selectedOptions[0];
      const dias = diasAluguelInput.value;
  
      if (veiculoSelecionado && dias) {
        const valorDiaria = parseFloat(veiculoSelecionado.getAttribute('data-valor-diaria'));
        const acrescimo = veiculoSelecionado.getAttribute('data-tipo-veiculo') === 'carro' ? 0.10 : 0.05;
        const valorTotal = valorDiaria * dias * (1 + acrescimo);
        precoPrevia.textContent = `Valor do aluguel: R$ ${valorTotal.toFixed(2)}`;
      } else {
        precoPrevia.textContent = 'Valor do aluguel: R$ 0,00';
      }
    }
  
    selecaoVeiculoSelect.addEventListener('change', atualizarPreviaValor);
    diasAluguelInput.addEventListener('change', atualizarPreviaValor);
  });
  
  
  function limparMensagem() {
    const messageContainer = document.getElementById('message-container');
    messageContainer.textContent = '';
    messageContainer.style.color = '';
  }

  function validaCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g,'');    
    if(cpf == '') return false; 
    
    if (cpf.length != 11 || 
        cpf == "00000000000" || 
        cpf == "11111111111" || 
        cpf == "22222222222" || 
        cpf == "33333333333" || 
        cpf == "44444444444" || 
        cpf == "55555555555" || 
        cpf == "66666666666" || 
        cpf == "77777777777" || 
        cpf == "88888888888" || 
        cpf == "99999999999")
            return false;    
    let add = 0;    
    for (let i=0; i < 9; i ++)       
        add += parseInt(cpf.charAt(i)) * (10 - i);  
        let rev = 11 - (add % 11);  
        if (rev == 10 || rev == 11)     
            rev = 0;    
        if (rev != parseInt(cpf.charAt(9)))     
            return false;       
    
    add = 0;    
    for (let i = 0; i < 10; i ++)        
        add += parseInt(cpf.charAt(i)) * (11 - i);  
    rev = 11 - (add % 11);  
    if (rev == 10 || rev == 11) 
        rev = 0;    
    if (rev != parseInt(cpf.charAt(10)))
        return false;       
    return true;   
  }

  function aplicarMascaraCPF(input) {
    let valor = input.value;
    valor = valor.substring(0, 14);
    valor = valor.replace(/\D/g, "");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    input.value = valor;
}

document.getElementById('cpf-cliente-devolucao').addEventListener('input', function() {
    aplicarMascaraCPF(this);
});

document.getElementById('cpf-cliente').addEventListener('input', function() {
    aplicarMascaraCPF(this);
});

