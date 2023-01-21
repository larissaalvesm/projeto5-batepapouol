const intervaloChecagemConexao = 5000;
const intervaloCarregarMensagens = 3000;
let nome;
let mensagens = [];

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

    carregarMensagens();
    manterConexao();
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

function carregarMensagens() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(mensagensCarregadas);
    promise.catch(erroCarregarMensagens);

    setTimeout(carregarMensagens, intervaloCarregarMensagens);
}

function mensagensCarregadas(resposta) {
    mensagens = resposta.data;

    exibirMensagens();

}

function erroCarregarMensagens() {
    console.log(erro);
}

function criarTemplateStatus(mensagens, i) {
    return `<div class="${mensagens[i].type}" data-test="message">
                <p>
                    <span class="hora">(${mensagens[i].time})</span>
                    <span class="nome">${mensagens[i].from} </span> ${mensagens[i].text}
                </p>
        </div>`;
}

function criarTemplateMensagem(mensagens, i) {
    return `<div class="${mensagens[i].type}" data-test="message">
            <p>
                <span class="hora">(${mensagens[i].time})</span>
                <span class="nome">${mensagens[i].from} </span> para <span class="nome">${mensagens[i].to} </span>: ${mensagens[i].text}
            </p>
    </div>`;
}

function exibirMensagens() {
    const lista = document.querySelector('.mensagens');

    lista.innerHTML = '';

    for (let i = 0; i < mensagens.length; i++) {

        if (mensagens[i].type === "status") {
            lista.innerHTML = lista.innerHTML + criarTemplateStatus(mensagens, i);

        } else if ((mensagens[i].type === "private_message" && mensagens[i].to === nome) || (mensagens[i].type === "message")) {
            lista.innerHTML = lista.innerHTML + criarTemplateMensagem(mensagens, i);
        }
    }

    document.querySelector(".mensagens").lastChild.scrollIntoView(true);
}

function enviarMensagem() {
    const textoMsg = document.getElementById("textinput").value;

    const msg = {
        from: nome,
        to: "Todos",
        text: textoMsg,
        type: "message"
    };

    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', msg);
    promessa.then(sucessoMsg);
    promessa.catch(erroMsg);
}

function sucessoMsg(resposta) {
    carregarMensagens();
}

function erroMsg(erro) {
    window.location.reload();
}


entrarNaSala();

