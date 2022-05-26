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

// poPup confirmar
const Confirm = {
    open (options) {
        options = Object.assign({}, {
            mensagem: "",
            textoOK: "Confirmar",
            textoCancelar: "Cancelar",
            onok: function () {},
            oncancel: function () {}
        }, options);

        const html = `
            <div class="containerConfirmar">
                <div class="janelaConfirmar">
                    <button class="fecharJanelaConfirmar">&times;</button>
                    <p>${options.mensagem}</p>
                    <div class="janelaConfirmarAcoes">
                        <button class="cancelar"><p>${options.textoCancelar}</p></button>
                        <button class="confirmar"><p>${options.textoOK}</p></button>
                    </div>
                </div>
            </div>
        `;

        const template = document.createElement('Template');
        template.innerHTML = html;

        const confirmEl = template.content.querySelector(".containerConfirmar");
        const bttFechar = template.content.querySelector(".fecharJanelaConfirmar");
        const bttOk = template.content.querySelector(".confirmar");
        const bttCancelar = template.content.querySelector(".cancelar");

        document.body.appendChild(template.content);

        confirmEl.addEventListener("click", e => {
            if(e.target === confirmEl) {
                options.oncancel();
                this._close(confirmEl);
            }
        });

        bttOk.addEventListener("click", () => {
            options.onok();
            this._close(confirmEl);
        });

        [bttCancelar, bttFechar].forEach(el => {
            el.addEventListener("click", () => {
                options.oncancel();
                this._close(confirmEl);
            })
        });
    },
    _close (confirmEl) {
        confirmEl.classList.add("fecharConfirmar")

        confirmEl.addEventListener("animationend", () => {
            document.body.removeChild(confirmEl);
        })
    }
}

const mensagemPopUp = {
    show (options) {
        options = Object.assign({}, {
            mensagem: "",
            cor: "",
        }, options);

        const html = `
            <div class="mensagempopup">
                <p style="color: ${options.cor}">${options.mensagem}</p>
                <div class="mensagemPopUpOpcoes">
                    <button class="fecharJanelaMensagemPopUp">&times;</button>
                </div>
            </div>
        `;

        const Template = document.createElement('Template');
        Template.innerHTML = html;

        const mensagemPopUpEl = Template.content.querySelector(".mensagempopup");
        const bttFechar = Template.content.querySelector(".fecharJanelaMensagemPopUp");

        document.querySelector("body").appendChild(Template.content);

        bttFechar.addEventListener("click", () => {
            this._close(mensagemPopUpEl);
        })

        setTimeout(() => {
            this._close(mensagemPopUpEl);
        }, 3500)
    },
    _close (mensagemPopUpEl) {
        mensagemPopUpEl.classList.add("fecharMensagemPopUp")

        mensagemPopUpEl.addEventListener("animationend", () => {
            document.body.removeChild(mensagemPopUpEl);
        })
    }
}