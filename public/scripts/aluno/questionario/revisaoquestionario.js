var parametrosJsonRevisaoQuestionario;

async function iniciarRevisaoQuestionarios(parametrosJson) {
    parametrosJsonRevisaoQuestionario = parametrosJson;

    document.querySelector("#voltarPagina").addEventListener("click", () => {
        voltarPagina();
    });

    document.querySelector("#revisaoQuestionarios form#revisaoQuestionariosForm").addEventListener("submit", async(event) => {
        event.preventDefault();
        window.location.href=`./aluno.html#/aluno/meuscursos/${parametrosJsonRevisaoQuestionario["idCurso"]}/materia/${parametrosJsonRevisaoQuestionario["idMateria"]}`;
    });

    carregamento();

    const respHistorico = await resultadoHistorico(parametrosJsonRevisaoQuestionario["idResultado"]);
    const respBuscarQuestionario = await buscarQuestionarioCompletoAPI(parametrosJsonRevisaoQuestionario["idQuestionario"]);
    const perguntas = respBuscarQuestionario["resultados"][0]["perguntas"];

    document.querySelector("#revisaoQuestionarios form#revisaoQuestionariosForm h2#nomeQuestionarioRevisao").innerHTML = respBuscarQuestionario["resultados"][0]["nome"];
    document.querySelector("#revisaoQuestionarios form#revisaoQuestionariosForm p#descricaoQuestionarioRevisao").innerHTML = respBuscarQuestionario["resultados"][0]["descricao"];
    document.querySelector("#revisaoQuestionarios form#revisaoQuestionariosForm p#notaQuestionarioRevisao").innerHTML = "Nota: "+respHistorico["resultados"]["historico"]["nota"];
    document.querySelector("#revisaoQuestionarios form#revisaoQuestionariosForm p#dataQuestionarioRevisao").innerHTML = "Data: "+respHistorico["resultados"]["historico"]["data"];
    document.querySelector("#revisaoQuestionarios form#revisaoQuestionariosForm p#horaQuestionarioRevisao").innerHTML = "Hora: "+respHistorico["resultados"]["historico"]["hora"];
    document.querySelector("#revisaoQuestionarios form#revisaoQuestionariosForm p#qtdeAcertosQuestionarioRevisao").innerHTML = "Acertos: "+respHistorico["resultados"]["historico"]["qtdAcertos"];
    document.querySelector("#revisaoQuestionarios form#revisaoQuestionariosForm p#qtdeErrosQuestionarioRevisao").innerHTML = "Erros: "+respHistorico["resultados"]["historico"]["qtdErros"];
    document.querySelector("#revisaoQuestionarios form#revisaoQuestionariosForm div.revisaoQuestionariosConteudoPerguntas").innerHTML = "";

    const imagemCorreta = '<img src="../../../../public/assets/Imagens/correto.png" class="imgRevisaoCorretoIncorreto" alt="Alternativa Correta">';
    const imagemIncorreta = '<img src="../../../../public/assets/Imagens/incorreto.png" class="imgRevisaoCorretoIncorreto" alt="Alternativa Incorreta">';
    for(let x=0; x<perguntas.length; x++) {
        if(respHistorico["resultados"]["correcao"].hasOwnProperty(perguntas[x]["id"])) {
            const alternativas = perguntas[x]["alternativa"];
            const alternativaCorreta = respHistorico["resultados"]["correcao"][perguntas[x]["id"]]["alternativaCorreta"];
            const alternativaAssinalada = respHistorico["resultados"]["correcao"][perguntas[x]["id"]]["alternativaAssinalada"];
            const cartaoRevisaoPergunta = `
                <div class="pergunta">
                    <p>${respHistorico["resultados"]["correcao"][perguntas[x]["id"]]["status"] == "correto" ? '<img src="../../../../public/assets/Imagens/correto.png" class="imgRevisaoCorretoIncorreto" alt="Correta">' : '<img src="../../../../public/assets/Imagens/incorreto.png" class="imgRevisaoCorretoIncorreto" alt="Incorreta">'}${x+1}) ${perguntas[x]["texto"].toString().replaceAll("\n", "<br>")}</p>
                    <div class="alternativa">${alternativaCorreta == alternativas[0]["texto"] ? imagemCorreta : ""} ${alternativaAssinalada == alternativas[0]["texto"] ? `${respHistorico["resultados"]["correcao"][perguntas[x]["id"]]["status"] == "correto" ? '' : imagemIncorreta}` : ""}<label class="${alternativaCorreta == alternativas[0]["texto"] ? "alternativaCorreta" : ''} ${alternativaAssinalada == alternativas[0]["texto"] ? `${respHistorico["resultados"]["correcao"][perguntas[x]["id"]]["status"] == "correto" ? '' : "alternativaIncorreta"}` : ""}">${alternativas[0]["texto"].toString().replaceAll("\n", "<br>")}</label></div>
                    <div class="alternativa">${alternativaCorreta == alternativas[1]["texto"] ? imagemCorreta : ""} ${alternativaAssinalada == alternativas[1]["texto"] ? `${respHistorico["resultados"]["correcao"][perguntas[x]["id"]]["status"] == "correto" ? '' : imagemIncorreta}` : ""}<label class="${alternativaCorreta == alternativas[1]["texto"] ? "alternativaCorreta" : ''} ${alternativaAssinalada == alternativas[1]["texto"] ? `${respHistorico["resultados"]["correcao"][perguntas[x]["id"]]["status"] == "correto" ? '' : "alternativaIncorreta"}` : ""}">${alternativas[1]["texto"].toString().replaceAll("\n", "<br>")}</label></div>
                    <div class="alternativa">${alternativaCorreta == alternativas[2]["texto"] ? imagemCorreta : ""} ${alternativaAssinalada == alternativas[2]["texto"] ? `${respHistorico["resultados"]["correcao"][perguntas[x]["id"]]["status"] == "correto" ? '' : imagemIncorreta}` : ""}<label class="${alternativaCorreta == alternativas[2]["texto"] ? "alternativaCorreta" : ''} ${alternativaAssinalada == alternativas[2]["texto"] ? `${respHistorico["resultados"]["correcao"][perguntas[x]["id"]]["status"] == "correto" ? '' : "alternativaIncorreta"}` : ""}">${alternativas[2]["texto"].toString().replaceAll("\n", "<br>")}</label></div>
                    <div class="alternativa">${alternativaCorreta == alternativas[3]["texto"] ? imagemCorreta : ""} ${alternativaAssinalada == alternativas[3]["texto"] ? `${respHistorico["resultados"]["correcao"][perguntas[x]["id"]]["status"] == "correto" ? '' : imagemIncorreta}` : ""}<label class="${alternativaCorreta == alternativas[3]["texto"] ? "alternativaCorreta" : ''} ${alternativaAssinalada == alternativas[3]["texto"] ? `${respHistorico["resultados"]["correcao"][perguntas[x]["id"]]["status"] == "correto" ? '' : "alternativaIncorreta"}` : ""}">${alternativas[3]["texto"].toString().replaceAll("\n", "<br>")}</label></div>
                    <div class="alternativa">${alternativaCorreta == alternativas[4]["texto"] ? imagemCorreta : ""} ${alternativaAssinalada == alternativas[4]["texto"] ? `${respHistorico["resultados"]["correcao"][perguntas[x]["id"]]["status"] == "correto" ? '' : imagemIncorreta}` : ""}<label class="${alternativaCorreta == alternativas[4]["texto"] ? "alternativaCorreta" : ''} ${alternativaAssinalada == alternativas[4]["texto"] ? `${respHistorico["resultados"]["correcao"][perguntas[x]["id"]]["status"] == "correto" ? '' : "alternativaIncorreta"}` : ""}">${alternativas[4]["texto"].toString().replaceAll("\n", "<br>")}</label></div>
                </div>
            `;
            document.querySelector("#revisaoQuestionarios form#revisaoQuestionariosForm div.revisaoQuestionariosConteudoPerguntas").innerHTML += cartaoRevisaoPergunta;
        }
    }

    pararCarregamento();
}