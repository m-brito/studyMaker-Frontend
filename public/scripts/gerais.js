var sucessoRequisicao = "OK";
var erroRequisicao = "ERRO";


// Animacoes de carregamento
function carregamento() {
    document.getElementById("divMensagens").style.display = "flex";
    document.querySelector("#divMensagens").innerHTML = `
        <div id="divCarregamento"></div>
        <p>Carregando...</p>
    `;
}

function pararCarregamento() {
    document.querySelector("#divMensagens").innerHTML = "";
    document.getElementById("divMensagens").style.display = "none";
}

// Mostrar mensagens na tela
function mostrarMensagem(mensagem) {
    document.getElementById("divMensagens").style.display = "flex";
    document.querySelector("#divMensagens").innerHTML = `<p>${mensagem}</p>`;
    setTimeout(() => {
        document.querySelector("#divMensagens").innerHTML = "";
        document.getElementById("divMensagens").style.display = "none";
    }, 4000)
    return;
}