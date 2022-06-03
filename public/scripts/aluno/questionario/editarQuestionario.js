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
            onok: cadastrarPerguntaAPI
        });
    })

    document.querySelector("#meusquestionariosCadastrar form#meusquestionariosCadastrarForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const respEditarQuestionario = await editarQuestionarioAPI();
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
    })
}

async function mostrarQuestionario() {
    const respQuestionario = await buscarQuestionarioCompletoAPI();
    perguntasQuest = respQuestionario["resultados"][0]["perguntas"];
    if(respQuestionario["status"] && respQuestionario["status"] == sucessoRequisicao) {
        document.querySelector("#meusquestionariosCadastrar form#meusquestionariosCadastrarForm input[name=nomeQuestionario]").value = respQuestionario["resultados"][0]["nome"];
        document.querySelector("#meusquestionariosCadastrar form#meusquestionariosCadastrarForm textarea[name=descricao]").value = respQuestionario["resultados"][0]["descricao"];
        document.querySelector("#meusquestionariosCadastrar form#meusquestionariosCadastrarForm .meusquestionariosConteudoPerguntas").innerHTML = "";
        for(let x=0; x<respQuestionario["resultados"][0]["perguntas"].length; x++) {
            let alternativasQuest = respQuestionario["resultados"][0]["perguntas"][x]["alternativa"];
            let resposta = respQuestionario["resultados"][0]["perguntas"][x]["resposta"]["texto"];
            let cartaoQuestionario = `
                <div class="mostraPergunta">
                    <hr>
                    <p class="textoPerguntaMostrar" style="font-size: 20px;">${x+1}) ${respQuestionario["resultados"][0]["perguntas"][x]["texto"]}</p>
                    <p ${alternativasQuest[0]["texto"] == resposta ? "style='color: green; font-weight: bold;'" : ""}>${alternativasQuest[0]["texto"] == resposta ? "C" : "X"} - ${alternativasQuest[0]["texto"]}</p>
                    <p ${alternativasQuest[1]["texto"] == resposta ? "style='color: green; font-weight: bold;'" : ""}>${alternativasQuest[1]["texto"] == resposta ? "C" : "X"} - ${alternativasQuest[1]["texto"]}</p>
                    <p ${alternativasQuest[2]["texto"] == resposta ? "style='color: green; font-weight: bold;'" : ""}>${alternativasQuest[2]["texto"] == resposta ? "C" : "X"} - ${alternativasQuest[2]["texto"]}</p>
                    <p ${alternativasQuest[3]["texto"] == resposta ? "style='color: green; font-weight: bold;'" : ""}>${alternativasQuest[3]["texto"] == resposta ? "C" : "X"} - ${alternativasQuest[3]["texto"]}</p>
                    <p ${alternativasQuest[4]["texto"] == resposta ? "style='color: green; font-weight: bold;'" : ""}>${alternativasQuest[4]["texto"] == resposta ? "C" : "X"} - ${alternativasQuest[4]["texto"]}</p>
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
    const respQuestionario = await buscarQuestionarioCompletoAPI();
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
                texto: perguntasQuest[z].texto,
                resposta: perguntasQuest[z].resposta.texto,
                alternativas: [perguntasQuest[z].alternativa[0].texto, perguntasQuest[z].alternativa[1].texto, perguntasQuest[z].alternativa[2].texto, perguntasQuest[z].alternativa[3].texto, perguntasQuest[z].alternativa[4].texto],
                onok: editarPerguntaAPI
            });
        }
    }
}

// APIs

async function deletarPerguntaAPI(idPergunta) {
    carregamento();
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/pergunta/deletarPergunta.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "id": idPergunta,
                })
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    pararCarregamento();
    return data;
}

async function cadastrarPerguntaAPI(pergunta) {
    carregamento();
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/pergunta/cadastrarPergunta`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "texto": pergunta["texto"],
                    "idQuestionario": parametrosJsonEQ["idQuestionario"],
                    "resposta": pergunta["resposta"],
                    "alternativas": pergunta["alternativas"],
                })
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    pararCarregamento();
    if(data["status"] && data["status"] == sucessoRequisicao) {
        mensagemPopUp.show({
            mensagem: "Pergunta cadastrada com sucesso!",
            cor: "green"
        });
        await mostrarQuestionario();
    } else {
        mensagemPopUp.show({
            mensagem: data["mensagem"],
            cor: "red"
        });
        await mostrarQuestionario();
    }
    return data;
}

async function editarPerguntaAPI(pergunta) {
    carregamento();
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/pergunta/editarPergunta.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "id": pergunta["idPergunta"],
                    "idQuestionario": parametrosJsonEQ["idQuestionario"],
                    "texto": pergunta["texto"],
                    "resposta": pergunta["resposta"],
                    "alternativas": pergunta["alternativas"]
                })
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    pararCarregamento();
    if(data["status"] && data["status"] == sucessoRequisicao) {
        mensagemPopUp.show({
            mensagem: "Pergunta editada com sucesso!",
            cor: "green"
        });
        await mostrarQuestionario();
    } else {
        mensagemPopUp.show({
            mensagem: data["mensagem"],
            cor: "red"
        });
        await mostrarQuestionario();
    }
    return data;
}

async function buscarQuestionarioCompletoAPI() {
    carregamento();
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/questionario/dadosQuestionarioCompleto?id=${parametrosJsonEQ["idQuestionario"]}&token=${buscarToken()}`, {
                "method": "GET",
                headers: {
                    'Accept': 'application/json',
                }
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    pararCarregamento();
    return data;
}

async function editarQuestionarioAPI() {
    carregamento();
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/questionario/editarQuestionario.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "nome": document.querySelector("#meusquestionariosCadastrar form#meusquestionariosCadastrarForm input[name=nomeQuestionario]").value,
                    "descricao": document.querySelector("#meusquestionariosCadastrar form#meusquestionariosCadastrarForm textarea[name=descricao]").value,
                    "id": parametrosJsonEQ["idQuestionario"],
                })
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    pararCarregamento();
    return data;
}