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

// Arredondar
function arredondar(n) {
    return (Math.round(n * 100) / 100).toFixed(2);
}

// Formatar data
function adicionaZero(numero){
    if (numero <= 9) 
        return "0" + numero;
    else
        return numero; 
}

function formatarData(data) {
    let dataAtual = new Date(data);
    let dataAtualFormatada = (adicionaZero((dataAtual.getDate()+1).toString()) + "/" + (adicionaZero(dataAtual.getMonth()+1).toString()) + "/" + dataAtual.getFullYear());
    return(dataAtualFormatada);
}

// Formatar hora

// Embaralhar Array
function embaralharArray(inputArray){
    inputArray.sort(()=> Math.random() - 0.5);
    return inputArray;
}

// Envio de emails
// Envio de codigo por email
async function enviarCodigo(para, nomepara) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOSTEMAIL}enviarcodigo`, {
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

// Verificar se esta logado ADM
async function verificarLogadoAdm(tkn) {
    if(tkn) {
        var respDadosUsuario = await buscarUsuario(tkn);
        if(respDadosUsuario.status == erroRequisicao && respDadosUsuario.mensagem == "Token expirado") {
            mostrarMensagem(respDadosUsuario.mensagem);
            setTimeout(() => {
                window.location.href = "../../index.html";
            }, 4000);
        } else if(respDadosUsuario.status == sucessoRequisicao && respDadosUsuario.resultados.tipoUsuario != "Administrador") {
            mostrarMensagem("Você não tem autorização para acessar esta pagina!")
            setTimeout(() => {
                window.location.href = "../../index.html";
            }, 4000);
        } else if(respDadosUsuario.status == erroRequisicao) {
            window.location.href = "../../index.html";
        } else if(respDadosUsuario.status == sucessoRequisicao && respDadosUsuario.resultados.tipoUsuario == "Administrador") {
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

// poPup confirmar com input mensagem
const ConfirmInput = {
    open (options) {
        options = Object.assign({}, {
            mensagem: "",
            textoOK: "Confirmar",
            textoCancelar: "Cancelar",
            json: {},
            onok: function () {},
            oncancel: function () {}
        }, options);

        const html = `
            <div class="containerConfirmar">
                <div class="janelaConfirmar">
                    <button class="fecharJanelaConfirmar">&times;</button>
                    <p>${options.mensagem}</p>
                    <input type="text" placeholder="Informe uma mensagem ao usuario" id="mensagemExplicativa">
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
            const mensagem = confirmEl.querySelector("input#mensagemExplicativa").value;
            options.onok(options.json, mensagem);
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

// Mensagens PopUp
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

// Janela Criar Pergunta
const CriarPergunta = {
    open (options) {
        options = Object.assign({}, {
            numero: "",
            textoOK: "",
            textoCancelar: "",
            idQuestionario: "",
            onok: function () {},
            oncancel: function () {}
        }, options);

        const html = `
            <div class="containerCadastrarPergunta">
                <form class="janelaCadastroPergunta" action="#">
                    <p>Texto da pergunta ${options.numero+1}</p>
                    <textarea name="textopergunta" class="textopergunta" cols="30" rows="10" required></textarea>
                    <div class="containerCadastrarRespostas">
                        <div class="opcoesCadastrarResposta">
                            <h2>Respostas</h2>
                        </div>
                        <div class="respostasRadios">
                            <div class="resposta" id="resposta-1">
                                <input type="radio" name="respostaPergunta" id="inputRadio-1" value="" required>
                                <textarea name="resposta" id="textarea-1" cols="30" rows="10" required></textarea>
                            </div>
                            <div class="resposta" id="resposta-2">
                                <input type="radio" name="respostaPergunta" id="inputRadio-2" value="" required>
                                <textarea name="resposta" id="textarea-2" cols="30" rows="10" required></textarea>
                            </div>
                            <div class="resposta" id="resposta-3">
                                <input type="radio" name="respostaPergunta" id="inputRadio-3" value="" required>
                                <textarea name="resposta" id="textarea-3" cols="30" rows="10" required></textarea>
                            </div>
                            <div class="resposta" id="resposta-4">
                                <input type="radio" name="respostaPergunta" id="inputRadio-4" value="" required>
                                <textarea name="resposta" id="textarea-4" cols="30" rows="10" required></textarea>
                            </div>
                            <div class="resposta" id="resposta-5">
                                <input type="radio" name="respostaPergunta" id="inputRadio-5" value="" required>
                                <textarea name="resposta" id="textarea-5" cols="30" rows="10" required></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="opcoesEnviarCadastroPergunta">
                        <div id="cancelarPerg"><p>Cancelar</p></div>
                        <button id="cadastrarPerg"><p>Cadastrar</p></button>
                    </div>
                </form>
            </div>
        `;

        const template = document.createElement('Template');
        template.innerHTML = html;

        const criarPerguntaEl = template.content.querySelector(".containerCadastrarPergunta");
        const bttOk = template.content.querySelector("form.janelaCadastroPergunta");
        const bttCancelar = template.content.querySelector("#cancelarPerg");
        const textareasText = template.content.querySelectorAll(".containerCadastrarPergunta form.janelaCadastroPergunta .respostasRadios .resposta textarea[name=resposta]");

        document.body.appendChild(template.content);

        criarPerguntaEl.addEventListener("click", e => {
            if(e.target === criarPerguntaEl) {
                options.oncancel();
                this._close(criarPerguntaEl);
            }
        });

        textareasText.forEach(el => {
            el.addEventListener("keyup", (event) => {
                criarPerguntaEl.querySelector(`.containerCadastrarPergunta form.janelaCadastroPergunta .respostasRadios #inputRadio-${event.target.id.split("-")[1]}`).value = criarPerguntaEl.querySelector(`.containerCadastrarPergunta form.janelaCadastroPergunta .respostasRadios .resposta textarea#${event.target.id}`).value;
            })  
        });

        bttOk.addEventListener("submit", (event) => {
            event.preventDefault();
            const resps = criarPerguntaEl.querySelectorAll(".resposta")
            if(resps.length <=1) {
                mensagemPopUp.show({
                    mensagem: "Para cadastrar uma pergunta é necessário pelo menos duas respostas!",
                    cor: "red"
                });
            } else {
                const opcoesRadios = criarPerguntaEl.querySelectorAll(".containerCadastrarPergunta .respostasRadios input[name=respostaPergunta]");
                let textoPergunta = criarPerguntaEl.querySelector(".containerCadastrarPergunta textarea[name=textopergunta]").value;
                let alternativaCorreta;
                let alternativas = [];
                for (var i=0;i<opcoesRadios.length;i++){
                    alternativas.push(opcoesRadios[i].value);
                    if ( opcoesRadios[i].checked ) {
                        alternativaCorreta = opcoesRadios[i].value;
                    }
                }
                options.onok({
                    "excluido": false, 
                    "id": options.numero,
                    "texto": textoPergunta,
                    "resposta": alternativaCorreta.toString().replaceAll(",", "&#44;"),
                    "alternativas": [alternativas[0].toString().replaceAll(",", "&#44;"), alternativas[1].toString().replaceAll(",", "&#44;"), alternativas[2].toString().replaceAll(",", "&#44;"), alternativas[3].toString().replaceAll(",", "&#44;"), alternativas[4].toString().replaceAll(",", "&#44;")]
                }, options.idQuestionario);
                this._close(criarPerguntaEl);
            }
        });

        bttCancelar.addEventListener("click", () => {
            options.oncancel();
            this._close(criarPerguntaEl);
        })
    },
    _close (criarPerguntaEl) {
        criarPerguntaEl.classList.add("fecharConfirmar");

        criarPerguntaEl.addEventListener("animationend", () => {
            document.body.removeChild(criarPerguntaEl);
        })
    },
}

// Janela Editar Pergunta
const EditarPergunta = {
    open (options) {
        options = Object.assign({}, {
            numero: "",
            texto: "",
            resposta: "",
            alternativas: "",
            idPergunta: "",
            textoOK: "",
            idQuestionario: "",
            textoCancelar: "",
            onok: function () {},
            oncancel: function () {}
        }, options);

        const html = `
            <div class="containerCadastrarPergunta">
                <form class="janelaCadastroPergunta" action="#">
                    <p>Texto da pergunta ${options.numero}</p>
                    <textarea name="textopergunta" class="textopergunta" cols="30" rows="10" required>${options.texto}</textarea>
                    <div class="containerCadastrarRespostas">
                        <div class="opcoesCadastrarResposta">
                            <h2>Respostas</h2>
                        </div>
                        <div class="respostasRadios">
                            <div class="resposta" id="resposta-1">
                                <input type="radio" name="respostaPergunta" id="inputRadio-1" ${options.alternativas[0] == options.resposta ? "checked" : ""} value="${options.alternativas[0]}" required>
                                <textarea name="resposta" id="textarea-1" cols="30" rows="10" required>${options.alternativas[0]}</textarea>
                            </div>
                            <div class="resposta" id="resposta-2">
                                <input type="radio" name="respostaPergunta" id="inputRadio-2" ${options.alternativas[1] == options.resposta ? "checked" : ""} value="${options.alternativas[1]}" required>
                                <textarea name="resposta" id="textarea-2" cols="30" rows="10" required>${options.alternativas[1]}</textarea>
                            </div>
                            <div class="resposta" id="resposta-3">
                                <input type="radio" name="respostaPergunta" id="inputRadio-3" ${options.alternativas[2] == options.resposta ? "checked" : ""} value="${options.alternativas[2]}" required>
                                <textarea name="resposta" id="textarea-3" cols="30" rows="10" required>${options.alternativas[2]}</textarea>
                            </div>
                            <div class="resposta" id="resposta-4">
                                <input type="radio" name="respostaPergunta" id="inputRadio-4" ${options.alternativas[3] == options.resposta ? "checked" : ""} value="${options.alternativas[3]}" required>
                                <textarea name="resposta" id="textarea-4" cols="30" rows="10" required>${options.alternativas[3]}</textarea>
                            </div>
                            <div class="resposta" id="resposta-5">
                                <input type="radio" name="respostaPergunta" id="inputRadio-5" ${options.alternativas[4] == options.resposta ? "checked" : ""} value="${options.alternativas[4]}" required>
                                <textarea name="resposta" id="textarea-5" cols="30" rows="10" required>${options.alternativas[4]}</textarea>
                            </div>
                        </div>
                    </div>
                    <div class="opcoesEnviarCadastroPergunta">
                        <div id="cancelarPerg"><p>Cancelar</p></div>
                        <button id="editarPerg"><p>Editar</p></button>
                    </div>
                </form>
            </div>
        `;

        const template = document.createElement('Template');
        template.innerHTML = html;

        const criarPerguntaEl = template.content.querySelector(".containerCadastrarPergunta");
        const bttOk = template.content.querySelector("form.janelaCadastroPergunta");
        const bttCancelar = template.content.querySelector("#cancelarPerg");
        const textareasText = template.content.querySelectorAll(".containerCadastrarPergunta form.janelaCadastroPergunta .respostasRadios .resposta textarea[name=resposta]");

        document.body.appendChild(template.content);

        criarPerguntaEl.addEventListener("click", e => {
            if(e.target === criarPerguntaEl) {
                options.oncancel();
                this._close(criarPerguntaEl);
            }
        });

        textareasText.forEach(el => {
            el.addEventListener("keyup", (event) => {
                criarPerguntaEl.querySelector(`.containerCadastrarPergunta form.janelaCadastroPergunta .respostasRadios #inputRadio-${event.target.id.split("-")[1]}`).value = criarPerguntaEl.querySelector(`.containerCadastrarPergunta form.janelaCadastroPergunta .respostasRadios .resposta textarea#${event.target.id}`).value;
            })  
        });

        bttOk.addEventListener("submit", (event) => {
            event.preventDefault();
            const resps = criarPerguntaEl.querySelectorAll(".resposta")
            if(resps.length <=1) {
                mensagemPopUp.show({
                    mensagem: "Para cadastrar uma pergunta é necessário pelo menos duas respostas!",
                    cor: "red"
                });
            } else {
                const opcoesRadios = criarPerguntaEl.querySelectorAll(".containerCadastrarPergunta .respostasRadios input[name=respostaPergunta]");
                let textoPergunta = criarPerguntaEl.querySelector(".containerCadastrarPergunta textarea[name=textopergunta]").value;
                let alternativaCorreta;
                let alternativas = [];
                for (var i=0;i<opcoesRadios.length;i++){
                    alternativas.push(opcoesRadios[i].value);
                    if ( opcoesRadios[i].checked ) {
                        alternativaCorreta = opcoesRadios[i].value;
                    }
                }
                options.onok({
                    "idPergunta": options.idPergunta,
                    "excluido": false,
                    "id": options.numero,
                    "texto": textoPergunta,
                    "resposta": alternativaCorreta.toString().replaceAll(",", "&#44;"),
                    "alternativas": [alternativas[0].toString().replaceAll(",", "&#44;"), alternativas[1].toString().replaceAll(",", "&#44;"), alternativas[2].toString().replaceAll(",", "&#44;"), alternativas[3].toString().replaceAll(",", "&#44;"), alternativas[4].toString().replaceAll(",", "&#44;")]
                }, options.idQuestionario);
                this._close(criarPerguntaEl);   
            }
        });

        bttCancelar.addEventListener("click", () => {
            options.oncancel();
            this._close(criarPerguntaEl);
        })
    },
    _close (criarPerguntaEl) {
        criarPerguntaEl.classList.add("fecharConfirmar");

        criarPerguntaEl.addEventListener("animationend", () => {
            document.body.removeChild(criarPerguntaEl);
        })
    },
}