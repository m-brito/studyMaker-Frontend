var parametrosJsonEQ;
var perguntasQuest;

async function iniciarEditarQuestionario(parametros) {
    parametrosJsonEQ = parametros;
    await mostrarQuestionario();

    document.querySelector("#voltarPagina").addEventListener("click", () => {
        voltarPagina();
    });

    document.querySelector("#meusquestionariosCadastrar form#meusquestionariosCadastrarForm .bttCadastrarNovaPergunta").addEventListener("click", async () => {
        CriarPergunta.open({
            numero: perguntasQuest.length,
            idQuestionario: parametrosJsonEQ["idQuestionario"],
            onok: cadastrarPerguntaAPI
        });
    })

    document.querySelector("#meusquestionariosCadastrar form#meusquestionariosCadastrarForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        Confirm.open({
            mensagem: "Caso voce editar, o questionario sera despublicada! <br> Tem certeza que deseja continuar?",
            textoOK: "Sim",
            textoCancelar: "Cancelar",
            onok: async () => {
                const respEditarQuestionario = await editarQuestionarioAPI(document.querySelector("#meusquestionariosCadastrar form#meusquestionariosCadastrarForm input[name=nomeQuestionario]").value, document.querySelector("#meusquestionariosCadastrar form#meusquestionariosCadastrarForm textarea[name=descricao]").value, parametrosJsonEQ["idQuestionario"]);
                if(respEditarQuestionario["status"] && respEditarQuestionario["status"] == sucessoRequisicao) {
                    mensagemPopUp.show({
                        mensagem: "Questionario editado com sucesso!",
                        cor: "green"
                    });
                    voltarPagina();
                } else {
                    mensagemPopUp.show({
                        mensagem: respEditarQuestionario["mensagem"],
                        cor: "red"
                    });
                    voltarPagina();
                }
            }
        })
    })
}

async function mostrarQuestionario() {
    const respQuestionario = await buscarQuestionarioCompletoAPI(parametrosJsonEQ["idQuestionario"]);
    perguntasQuest = respQuestionario["resultados"][0]["perguntas"];
    if(respQuestionario["status"] && respQuestionario["status"] == sucessoRequisicao) {
        document.querySelector("#meusquestionariosCadastrar form#meusquestionariosCadastrarForm input[name=nomeQuestionario]").value = respQuestionario["resultados"][0]["nome"].toString().replaceAll("\n", "\n");
        document.querySelector("#meusquestionariosCadastrar form#meusquestionariosCadastrarForm textarea[name=descricao]").value = respQuestionario["resultados"][0]["descricao"].toString().replaceAll("\n", "\n");
        document.querySelector("#meusquestionariosCadastrar form#meusquestionariosCadastrarForm .meusquestionariosConteudoPerguntas").innerHTML = "";
        for(let x=0; x<respQuestionario["resultados"][0]["perguntas"].length; x++) {
            let alternativasQuest = respQuestionario["resultados"][0]["perguntas"][x]["alternativa"];
            let resposta = respQuestionario["resultados"][0]["perguntas"][x]["resposta"]["texto"];
            let cartaoQuestionario = `
                <div class="mostraPergunta">
                    <hr>
                    <p class="textoPerguntaMostrar" style="font-size: 20px;">${x+1}) ${respQuestionario["resultados"][0]["perguntas"][x]["texto"].toString().replaceAll("\n", "<br>")}</p>
                    <p ${alternativasQuest[0]["texto"] == resposta ? "style='color: green; font-weight: bold;'" : ""}>${alternativasQuest[0]["texto"] == resposta ? "C" : "X"} - ${alternativasQuest[0]["texto"].toString().replaceAll("\n", "<br>")}</p>
                    <p ${alternativasQuest[1]["texto"] == resposta ? "style='color: green; font-weight: bold;'" : ""}>${alternativasQuest[1]["texto"] == resposta ? "C" : "X"} - ${alternativasQuest[1]["texto"].toString().replaceAll("\n", "<br>")}</p>
                    <p ${alternativasQuest[2]["texto"] == resposta ? "style='color: green; font-weight: bold;'" : ""}>${alternativasQuest[2]["texto"] == resposta ? "C" : "X"} - ${alternativasQuest[2]["texto"].toString().replaceAll("\n", "<br>")}</p>
                    <p ${alternativasQuest[3]["texto"] == resposta ? "style='color: green; font-weight: bold;'" : ""}>${alternativasQuest[3]["texto"] == resposta ? "C" : "X"} - ${alternativasQuest[3]["texto"].toString().replaceAll("\n", "<br>")}</p>
                    <p ${alternativasQuest[4]["texto"] == resposta ? "style='color: green; font-weight: bold;'" : ""}>${alternativasQuest[4]["texto"] == resposta ? "C" : "X"} - ${alternativasQuest[4]["texto"].toString().replaceAll("\n", "<br>")}</p>
                    <div class="opcoesMostrarPerguntas">
                        <div class="meusquestionariosPerguntaEditar" onclick="editarPerguntaEQ(${respQuestionario["resultados"][0]["perguntas"][x]["id"]}, ${x+1})">
                            <img src="../../public/assets/Imagens/Icone-editar-branco.svg" alt="Editar">
                        </div>
                        <div class="meusquestionariosPerguntaDeletar" onclick="deletarPerguntaEQ(${respQuestionario["resultados"][0]["perguntas"][x]["id"]})">
                            <img src="../../public/assets/Imagens/Icone-deletar.svg" alt="Deletar">
                        </div>
                    </div>
                </div>
            `;
            document.querySelector("#meusquestionariosCadastrar form#meusquestionariosCadastrarForm .meusquestionariosConteudoPerguntas").innerHTML += cartaoQuestionario;
        }   
    }
}

async function deletarPerguntaEQ(idPergunta) {
    const respQuestionario = await buscarQuestionarioCompletoAPI(parametrosJsonEQ["idQuestionario"]);
    perguntasQuest = respQuestionario["resultados"][0]["perguntas"];
    if(respQuestionario["status"] && respQuestionario["status"] == sucessoRequisicao) {
        if(perguntasQuest.length <= 1) {
            mensagemPopUp.show({
                mensagem: "É necessario pelo menos uma pergunta para o questionario!",
                cor: "red"
            });
        } else {
            Confirm.open({
                mensagem: "Tem certeza que deseja exluir esta pergunta?",
                textoOK: "Sim",
                textoCancelar: "Cancelar",
                onok: async () => {
                    const respExcluirPergunta = await deletarPerguntaAPI(idPergunta);
                    if(respExcluirPergunta["status"] && respExcluirPergunta["status"] == sucessoRequisicao) {
                        mensagemPopUp.show({
                            mensagem: "Pergunta excluida com sucesso!",
                            cor: "green"
                        });
                    } else {
                        mensagemPopUp.show({
                            mensagem: "Erro ao excluir a pergunta!",
                            cor: "red"
                        });
                    }
                    mostrarQuestionario();
                }
            })
        }
    }
}

function editarPerguntaEQ(idPergunta, numero) {
    for (let z=0; z<perguntasQuest.length; z++) {
        if(perguntasQuest[z].id == idPergunta) {
            EditarPergunta.open({
                numero: numero,
                idPergunta: idPergunta,
                idQuestionario: parametrosJsonEQ["idQuestionario"],
                texto: perguntasQuest[z].texto,
                resposta: perguntasQuest[z].resposta.texto,
                alternativas: [perguntasQuest[z].alternativa[0].texto, perguntasQuest[z].alternativa[1].texto, perguntasQuest[z].alternativa[2].texto, perguntasQuest[z].alternativa[3].texto, perguntasQuest[z].alternativa[4].texto],
                onok: editarPerguntaAPI
            });
        }
    }
}