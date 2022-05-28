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
}

function mostrarSalvarPergunta(pergunta) {
    perguntas.push(pergunta);
    let cartaoMostrarPergunta = `
        <div class="mostraPergunta">
            <hr>
            <p class="textoPerguntaMostrar" style="font-size: 20px;">${pergunta.id+1}) ${pergunta.pergunta}</p>
            <p ${pergunta.alternativas[0] == pergunta.resposta ? "style='color: green; font-weight: bold;'" : ""}>${pergunta.alternativas[0] == pergunta.resposta ? "C" : "X"} - ${pergunta.alternativas[0]}</p>
            <p ${pergunta.alternativas[1] == pergunta.resposta ? "style='color: green; font-weight: bold;'" : ""}>${pergunta.alternativas[1] == pergunta.resposta ? "C" : "X"} - ${pergunta.alternativas[1]}</p>
            <p ${pergunta.alternativas[2] == pergunta.resposta ? "style='color: green; font-weight: bold;'" : ""}>${pergunta.alternativas[2] == pergunta.resposta ? "C" : "X"} - ${pergunta.alternativas[2]}</p>
            <p ${pergunta.alternativas[3] == pergunta.resposta ? "style='color: green; font-weight: bold;'" : ""}>${pergunta.alternativas[3] == pergunta.resposta ? "C" : "X"} - ${pergunta.alternativas[3]}</p>
            <p ${pergunta.alternativas[4] == pergunta.resposta ? "style='color: green; font-weight: bold;'" : ""}>${pergunta.alternativas[4] == pergunta.resposta ? "C" : "X"} - ${pergunta.alternativas[4]}</p>
            <div class="opcoesMostrarPerguntas">
                <div class="meusquestionariosPerguntaEditar" onclick="editarPergunta(${pergunta.id})">
                    <img src="../../public/assets/Imagens/Icone-editar-branco.svg" alt="Editar">
                </div>
                <div class="meusquestionariosPerguntaDeletar" onclick="deletarPergunta(${pergunta.id})">
                    <img src="../../public/assets/Imagens/Icone-deletar.svg" alt="Deletar">
                </div>
            </div>
        </div>
    `;
    document.querySelector("#meusquestionariosCadastrar form#meusquestionariosCadastrarForm .meusquestionariosConteudoPerguntas").innerHTML += cartaoMostrarPergunta;
    qtdePerguntasJaCadastradas++;
}

// Janela Criar Pergunta
const CriarPergunta = {
    open (options) {
        options = Object.assign({}, {
            numero: "",
            textoOK: "Confirmar",
            textoCancelar: "Cancelar",
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
                    alternativas.push(opcoesRadios[i].value)
                    if ( opcoesRadios[i].checked ) {
                        alternativaCorreta = opcoesRadios[i].value;
                    }
                }
                options.onok({"excluido": false, "id": options.numero, "texto": textoPergunta, "resposta": alternativaCorreta, "alternativas": alternativas});
                this._close(criarPerguntaEl);   
            }
        });

        bttCancelar.addEventListener("click", () => {
            options.oncancel();
            this._close(criarPerguntaEl);
        })
    },
    _close (criarPerguntaEl) {
        criarPerguntaEl.classList.add("fecharConfirmar")

        criarPerguntaEl.addEventListener("animationend", () => {
            document.body.removeChild(criarPerguntaEl);
        })
    },
}