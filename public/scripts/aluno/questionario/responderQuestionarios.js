var parametrosJsonResponderQuestionarios;

async function iniciarResponderQuestionarios(parametros) {
    parametrosJsonResponderQuestionarios = parametros;
    await verificarLogado(buscarToken());
    mostrarQuestionarioRQ();

    document.querySelector("#voltarPagina").addEventListener("click", () => {
        voltarPagina();
    });

    document.querySelector("div#responderQuestionarios form#responderQuestionariosForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        let respostasForm = [];
        const perguntas = document.querySelectorAll("div#responderQuestionarios form#responderQuestionariosForm div.responderQuestionariosConteudoPerguntas div.pergunta");
        for(let x=0; x<perguntas.length; x++) {
            let alternativaCorreta;
            const opcoesRadio = perguntas[x].querySelectorAll(`input[name=pergunta${perguntas[x].id}]`);
            for (var i=0;i<opcoesRadio.length;i++){
                if (opcoesRadio[i].checked) {
                    alternativaCorreta = opcoesRadio[i].value.replaceAll(",", "&#44;");
                }
            }
            respostasForm.push({
                idPergunta: perguntas[x].id,
                alternativaAssinalada: alternativaCorreta
            })
        }
        let perguntasQuest = {};
        const respBuscarQuestionario = await buscarQuestionarioCompletoAPI(parametrosJsonResponderQuestionarios["idQuestionario"]);
        for(let z=0; z<respBuscarQuestionario["resultados"][0]["perguntas"].length; z++) {
            const pergunta = respBuscarQuestionario["resultados"][0]["perguntas"][z];
            perguntasQuest[`${pergunta["id"]}`] = pergunta["resposta"]["texto"];
        }
        await mostrarResultados(perguntasQuest, respostasForm);
    });
}

async function mostrarResultados(perguntasQuest, respostasForm) {
    carregamento();
    const respResultQuest = await resultadoQuestionario(perguntasQuest, respostasForm, parametrosJsonResponderQuestionarios["idQuestionario"]);
    pararCarregamento();
    window.location.href = `./aluno.html#/revisao/curso/${parametrosJsonResponderQuestionarios["idCurso"]}/materia/${parametrosJsonResponderQuestionarios["idMateria"]}/questionario/${parametrosJsonResponderQuestionarios["idQuestionario"]}/resultado/${respResultQuest["resultados"]["idResultado"]}`;
}

async function mostrarQuestionarioRQ() {
    const respBuscarQuestionario = await buscarQuestionarioCompletoAPI(parametrosJsonResponderQuestionarios["idQuestionario"]);
    const perguntas = embaralharArray(respBuscarQuestionario["resultados"][0]["perguntas"])
    document.querySelector("div#responderQuestionarios form#responderQuestionariosForm h2#nomeQuestionario").innerHTML = respBuscarQuestionario["resultados"][0]["nome"].toString().replaceAll("\n", "<br>");
    document.querySelector("div#responderQuestionarios form#responderQuestionariosForm p#descricaoQuestionario").innerHTML = respBuscarQuestionario["resultados"][0]["descricao"].toString().replaceAll("\n", "<br>");
    document.querySelector("div#responderQuestionarios form#responderQuestionariosForm div.responderQuestionariosConteudoPerguntas").innerHTML = "";
    for(let x=0; x<respBuscarQuestionario["resultados"][0]["perguntas"].length; x++) {
        const pergunta = perguntas[x];
        const alternativa = embaralharArray(pergunta["alternativa"]);
        let cartaoPerguntaMostrar = `
            <div class="pergunta" id="${pergunta["id"]}">
                <p>${x+1}) ${pergunta["texto"].toString().replaceAll("\n", "<br>")}</p>
                <input type="radio" value="${alternativa[0]["texto"]}" name="pergunta${pergunta["id"]}" id="p${pergunta["id"]}x1" required> <label for="p${pergunta["id"]}x1"> - ${alternativa[0]["texto"].toString().replaceAll("\n", "<br>")}</label> <br>
                <input type="radio" value="${alternativa[1]["texto"]}" name="pergunta${pergunta["id"]}" id="p${pergunta["id"]}x2" required> <label for="p${pergunta["id"]}x2"> - ${alternativa[1]["texto"].toString().replaceAll("\n", "<br>")}</label> <br>
                <input type="radio" value="${alternativa[2]["texto"]}" name="pergunta${pergunta["id"]}" id="p${pergunta["id"]}x3" required> <label for="p${pergunta["id"]}x3"> - ${alternativa[2]["texto"].toString().replaceAll("\n", "<br>")}</label> <br>
                <input type="radio" value="${alternativa[3]["texto"]}" name="pergunta${pergunta["id"]}" id="p${pergunta["id"]}x4" required> <label for="p${pergunta["id"]}x4"> - ${alternativa[3]["texto"].toString().replaceAll("\n", "<br>")}</label> <br>
                <input type="radio" value="${alternativa[4]["texto"]}" name="pergunta${pergunta["id"]}" id="p${pergunta["id"]}x5" required> <label for="p${pergunta["id"]}x5"> - ${alternativa[4]["texto"].toString().replaceAll("\n", "<br>")}</label> <br>
            </div>
        `;
        document.querySelector("div#responderQuestionarios form#responderQuestionariosForm div.responderQuestionariosConteudoPerguntas").innerHTML += cartaoPerguntaMostrar;
    }
}