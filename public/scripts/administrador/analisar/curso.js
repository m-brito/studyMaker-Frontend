var parametrosJsonAnalisarCurso;

async function iniciarAnalisarCurso(parametrosJson) {
    parametrosJsonAnalisarCurso = parametrosJson;

    document.querySelector("#voltarPagina").addEventListener("click", () => {
        voltarPagina();
    });

    document.querySelector("#analisarCursos form#analisarCursosForm").addEventListener("submit", async(event) => {
        event.preventDefault();
        window.location.href=`./administrador.html#/administrador/requisicoes/aluno/${parametrosJsonAnalisarCurso["idAluno"]}`;
    });

    carregamento();

    const respBuscarCurso = await buscarCurso(parametrosJsonAnalisarCurso["idCurso"]);
    if(respBuscarCurso["status"] == erroRequisicao) {
        mensagemPopUp.show({
            mensagem: "Tivemos problemas ao acessar esse questionario!",
            cor: "red"
        });
        voltarPagina();
    } else {
        document.querySelector("#analisarCursos form#analisarCursosForm h2#nomeQuestionarioAnalisar").innerHTML = respBuscarCurso["resultados"][0]["nome"];
        document.querySelector("#analisarCursos form#analisarCursosForm p#descricaoQuestionarioAnalisar").innerHTML = respBuscarCurso["resultados"][0]["descricao"];
    }

    pararCarregamento();
}