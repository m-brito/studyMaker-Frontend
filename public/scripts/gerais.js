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

// verificar disponibilidade de email
async function disponibilidadeEmail(email) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/usuario/verificarEmail.php?email=${email}`, {
                "method": "POST",
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

// Envio de emails

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
    console.log(data)
    return data;
}