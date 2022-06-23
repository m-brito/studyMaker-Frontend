var parametrosJsonAnalisarQuestionario;

async function iniciarAnalisarQuestionario(parametrosJson) {
    parametrosJsonAnalisarQuestionario = parametrosJson;

    document.querySelector("#voltarPagina").addEventListener("click", () => {
        voltarPagina();
    });

    document.querySelector("#analisarQuestionarios form#analisarQuestionariosForm").addEventListener("submit", async(event) => {
        event.preventDefault();
        window.location.href=`./administrador.html#/administrador/requisicoes/aluno/${parametrosJsonAnalisarQuestionario["idAluno"]}`;
    });

    carregamento();

    const respBuscarQuestionario = await buscarQuestionarioCompletoAPI(parametrosJsonAnalisarQuestionario["idQuestionario"]);
    if(respBuscarQuestionario["status"] == erroRequisicao) {
        mensagemPopUp.show({
            mensagem: "Tivemos problemas ao acessar esse questionario!",
            cor: "red"
        });
        voltarPagina();
    } else {
        const perguntas = respBuscarQuestionario["resultados"][0]["perguntas"];

        document.querySelector("#analisarQuestionarios form#analisarQuestionariosForm h2#nomeQuestionarioAnalisar").innerHTML = respBuscarQuestionario["resultados"][0]["nome"];
        document.querySelector("#analisarQuestionarios form#analisarQuestionariosForm p#descricaoQuestionarioAnalisar").innerHTML = respBuscarQuestionario["resultados"][0]["descricao"];
        document.querySelector("#analisarQuestionarios form#analisarQuestionariosForm div.analisarQuestionariosConteudoPerguntas").innerHTML = "";

        const imagemCorreta = '<img src="../../../../public/assets/Imagens/correto.png" class="imgAnalisarCorretoIncorreto" alt="Alternativa Correta">';
        for(let x=0; x<perguntas.length; x++) {
            const alternativas = perguntas[x]["alternativa"];
            const alternativaCorreta = perguntas[x]["resposta"]["texto"]
            const cartaoAnalisarPergunta = `
                <div class="pergunta">
                    <p>${x+1}) ${perguntas[x]["texto"].toString().replaceAll("\n", "<br>")}</p>
                    <div class="alternativa">${alternativaCorreta == alternativas[0]["texto"] ? imagemCorreta : ""} <label class="${alternativaCorreta == alternativas[0]["texto"] ? "alternativaCorreta" : ''}">${alternativas[0]["texto"].toString().replaceAll("\n", "<br>")}</label></div>
                    <div class="alternativa">${alternativaCorreta == alternativas[1]["texto"] ? imagemCorreta : ""} <label class="${alternativaCorreta == alternativas[1]["texto"] ? "alternativaCorreta" : ''}">${alternativas[1]["texto"].toString().replaceAll("\n", "<br>")}</label></div>
                    <div class="alternativa">${alternativaCorreta == alternativas[2]["texto"] ? imagemCorreta : ""} <label class="${alternativaCorreta == alternativas[2]["texto"] ? "alternativaCorreta" : ''}">${alternativas[2]["texto"].toString().replaceAll("\n", "<br>")}</label></div>
                    <div class="alternativa">${alternativaCorreta == alternativas[3]["texto"] ? imagemCorreta : ""} <label class="${alternativaCorreta == alternativas[3]["texto"] ? "alternativaCorreta" : ''}">${alternativas[3]["texto"].toString().replaceAll("\n", "<br>")}</label></div>
                    <div class="alternativa">${alternativaCorreta == alternativas[4]["texto"] ? imagemCorreta : ""} <label class="${alternativaCorreta == alternativas[4]["texto"] ? "alternativaCorreta" : ''}">${alternativas[4]["texto"].toString().replaceAll("\n", "<br>")}</label></div>
                </div>
            `;
            document.querySelector("#analisarQuestionarios form#analisarQuestionariosForm div.analisarQuestionariosConteudoPerguntas").innerHTML += cartaoAnalisarPergunta;
        }
    }

    pararCarregamento();
}