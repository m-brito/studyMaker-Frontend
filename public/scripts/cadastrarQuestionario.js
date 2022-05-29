var parametrosJsonCQ;
var qtdePerguntasJaCadastradas = 0;
var perguntas = [];

async function iniciarCadastrarQuestionario(parametros) {
    parametrosJsonCQ = parametros;
    await verificarLogado(buscarToken());
    document.querySelector("#meusquestionariosCadastrar .bttCadastrarNovaPergunta").addEventListener("click", async () => {
        CriarPergunta.open({
            numero: qtdePerguntasJaCadastradas,
            onok: mostrarSalvarPergunta
        });
    })

    document.querySelector("#voltarPagina").addEventListener("click", () => {
        voltarPagina();
    });

    document.querySelector("#meusquestionariosCadastrar #meusquestionariosCadastrarForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        if(perguntas.length <= 0) {
            mensagemPopUp.show({
                mensagem: "É necessario pelo menos uma pergunta para cadastrar um questionario!",
                cor: "red"
            });
        } else {
            carregamento();
            const respCadastroQuestionario = await cadastrarQuestionario();
            pararCarregamento();
            if(respCadastroQuestionario["status"] && respCadastroQuestionario["status"] == sucessoRequisicao) {
                mensagemPopUp.show({
                    mensagem: "Questionario cadastrado com sucesso!",
                    cor: "green"
                });
                voltarPagina();
            } else {
                mensagemPopUp.show({
                    mensagem: respCadastroQuestionario["mensagem"],
                    cor: "red"
                });
                voltarPagina();
            }
        }
    })
}

async function cadastrarQuestionario() {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/questionario/cadastrarQuestionario`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "nome": document.querySelector("#meusquestionariosCadastrar form#meusquestionariosCadastrarForm input[name=nomeQuestionario]").value,
                    "descricao": document.querySelector("#meusquestionariosCadastrar form#meusquestionariosCadastrarForm textarea[name=descricao]").value,
                    "idMateria": parametrosJsonCQ["idMateria"],
                    "idCurso": parametrosJsonCQ["idCurso"],
                    "perguntas": perguntas
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

function deletarPergunta(idPergunta) {
    for (let z=0; z<perguntas.length; z++) {
        if(perguntas[z].id == idPergunta) {
            // perguntas[z].excluido = true;
            perguntas.splice(z, 1)
        }
    }
    mostrarPerguntas();
}

function editarPerguntaJson(pergunta) {
    for (let z=0; z<perguntas.length; z++) {
        if(perguntas[z].id == pergunta.idPergunta) {
            perguntas[z].texto = pergunta.texto;
            perguntas[z].resposta = pergunta.resposta;
            perguntas[z].alternativas = pergunta.alternativas;
        }
    }
    mostrarPerguntas();
}

function editarPergunta(idPergunta, numero) {
    for (let z=0; z<perguntas.length; z++) {
        if(perguntas[z].id == idPergunta) {
            EditarPergunta.open({
                numero: numero,
                idPergunta: idPergunta,
                texto: perguntas[z].texto,
                resposta: perguntas[z].resposta,
                alternativas: perguntas[z].alternativas,
                onok: editarPerguntaJson
            });
        }
    }
}

function mostrarPerguntas() {
    document.querySelector("#meusquestionariosCadastrar form#meusquestionariosCadastrarForm .meusquestionariosConteudoPerguntas").innerHTML = "";
    for (let z=0; z<perguntas.length; z++) {
        if(perguntas[z].excluido == false) {
            const pergunta = perguntas[z];
        let cartaoMostrarPergunta = `
            <div class="mostraPergunta">
                <hr>
                <p class="textoPerguntaMostrar" style="font-size: 20px;">${z+1}) ${pergunta.texto}</p>
                <p ${pergunta.alternativas[0] == pergunta.resposta ? "style='color: green; font-weight: bold;'" : ""}>${pergunta.alternativas[0] == pergunta.resposta ? "C" : "X"} - ${pergunta.alternativas[0]}</p>
                <p ${pergunta.alternativas[1] == pergunta.resposta ? "style='color: green; font-weight: bold;'" : ""}>${pergunta.alternativas[1] == pergunta.resposta ? "C" : "X"} - ${pergunta.alternativas[1]}</p>
                <p ${pergunta.alternativas[2] == pergunta.resposta ? "style='color: green; font-weight: bold;'" : ""}>${pergunta.alternativas[2] == pergunta.resposta ? "C" : "X"} - ${pergunta.alternativas[2]}</p>
                <p ${pergunta.alternativas[3] == pergunta.resposta ? "style='color: green; font-weight: bold;'" : ""}>${pergunta.alternativas[3] == pergunta.resposta ? "C" : "X"} - ${pergunta.alternativas[3]}</p>
                <p ${pergunta.alternativas[4] == pergunta.resposta ? "style='color: green; font-weight: bold;'" : ""}>${pergunta.alternativas[4] == pergunta.resposta ? "C" : "X"} - ${pergunta.alternativas[4]}</p>
                <div class="opcoesMostrarPerguntas">
                    <div class="meusquestionariosPerguntaEditar" onclick="editarPergunta(${pergunta.id}, ${z+1})">
                        <img src="../../public/assets/Imagens/Icone-editar-branco.svg" alt="Editar">
                    </div>
                    <div class="meusquestionariosPerguntaDeletar" onclick="deletarPergunta(${pergunta.id})">
                        <img src="../../public/assets/Imagens/Icone-deletar.svg" alt="Deletar">
                    </div>
                </div>
            </div>
        `;
        document.querySelector("#meusquestionariosCadastrar form#meusquestionariosCadastrarForm .meusquestionariosConteudoPerguntas").innerHTML += cartaoMostrarPergunta;
        }
    }
}

function mostrarSalvarPergunta(pergunta) {
    perguntas.push(pergunta);
    qtdePerguntasJaCadastradas++;
    mostrarPerguntas();
}

// Janela Criar Pergunta
const CriarPergunta = {
    open (options) {
        options = Object.assign({}, {
            numero: "",
            textoOK: "",
            textoCancelar: "",
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
                    "resposta": alternativaCorreta,
                    "alternativas": alternativas
                });
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
                    "resposta": alternativaCorreta,
                    "alternativas": alternativas
                });
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