var qtdePerguntasJaCadastradas = 0;
var perguntas = [];

async function iniciarCadastrarQuestionario(parametros) {
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
            const respCadastroQuestionario = await cadastrarQuestionario(document.querySelector("#meusquestionariosCadastrar form#meusquestionariosCadastrarForm input[name=nomeQuestionario]").value, document.querySelector("#meusquestionariosCadastrar form#meusquestionariosCadastrarForm textarea[name=descricao]").value, parametros["idMateria"], parametros["idCurso"], perguntas);
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