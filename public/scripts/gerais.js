var sucessoRequisicao = "OK";
var erroRequisicao = "ERRO";


// Animacoes na tela
// Animacoes de carregamento
function carregamento() {
    document.getElementById("divMensagens").style.display = "flex";
    document.querySelector("#divMensagens").innerHTML = `
        <div id="divCarregamento"></div>
        <p>Carregando...</p>
    `;
}

// Parar animacao de carregamento
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
    }, 3000)
    return;
}

// Envio de emails
// Envio de codigo por email
async function enviarCodigo(para, nomepara) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOSTEMAIL}/enviarcodigo`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    "nomeemail": "Study Maker",
                    "para": para,
                    "nomepara": nomepara
                })
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    return data;
}

// Criptografias
// Criptografar um texto
async function criptografa(codigo) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOSTEMAIL}/criptografa`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    "codigo": codigo
                })
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    return data;
}

// Usuario
// Buscar usuario
async function buscarUsuario(tokenAluno) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/usuario/dadosUsuario.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    "token": tokenAluno
                })
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    return data;
}

// verificar disponibilidade de email
async function disponibilidadeEmail(email) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/usuario/verificarEmail.php?email=${email}`, {
                "method": "GET",
                headers: {
                    'Accept': 'application/json'
                }
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    return data;
}

// Deslogar do site
async function deslogar(tokenAluno) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/usuario/sair.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    "token": tokenAluno
                })
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    return data;
}

// Buscar token
function buscarToken() {
    return localStorage.getItem("tkn");
}

// Verificar se esta logado
async function verificarLogado(tkn) {
    if(tkn) {
        var respDadosUsuario = await buscarUsuario(tkn);
        if(respDadosUsuario.status == erroRequisicao && respDadosUsuario.mensagem == "Token expirado") {
            mostrarMensagem(respDadosUsuario.mensagem);
            setTimeout(() => {
                window.location.href = "../../index.html";
            }, 4000);
        } else if(respDadosUsuario.status == sucessoRequisicao && respDadosUsuario.resultados.tipoUsuario != "Aluno") {
            mostrarMensagem("Você não tem autorização para acessar esta pagina!")
            setTimeout(() => {
                window.location.href = "../../index.html";
            }, 4000);
        } else if(respDadosUsuario.status == erroRequisicao) {
            window.location.href = "../../index.html";
        } else if(respDadosUsuario.status == sucessoRequisicao && respDadosUsuario.resultados.tipoUsuario == "Aluno") {
            mostrarDados(respDadosUsuario);
        }
    } else {
        window.location.href = "../../index.html";
    }
}

// Funcao voltar
function voltarPagina() {
    window.history.back();
}