let nome;
const intervaloChecagemConexao = 5000;

function entrarNaSala() {
    nome = prompt("Qual seu nome?");
    const dadoNome = {
        name: nome
    };

    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', dadoNome);
    promessa.then(tratarSucesso);
    promessa.catch(tratarErro);
}

function tratarSucesso(resposta) {
    const status = resposta.status;
}

function tratarErro(erro) {
    const status = erro.response.status;

    if (status === 400) {
        alert("Digite outro nome, esse já está sendo usado.")
        entrarNaSala();
    }
}

function manterConexao() {

    const nomeConectado = {
        name: nome
    };

    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nomeConectado);
    promessa.then(conectado);
    promessa.catch(desconectou);

    setTimeout(manterConexao, intervaloChecagemConexao);

}

function conectado(resposta) {
    console.log("Usuário conectado.");
}

function desconectou(erro) {
    console.log("Não foi possível manter o usuário conectado.")
}


entrarNaSala();
manterConexao();