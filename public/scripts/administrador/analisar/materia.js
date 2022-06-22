var parametrosJsonAnalisarMateria;

async function iniciarAnalisarMateria(parametrosJson) {
    parametrosJsonAnalisarMateria = parametrosJson;

    document.querySelector("#voltarPagina").addEventListener("click", () => {
        voltarPagina();
    });

    document.querySelector("#analisarMaterias form#analisarMateriasForm").addEventListener("submit", async(event) => {
        event.preventDefault();
        window.location.href=`./administrador.html#/administrador/requisicoes/aluno/${parametrosJsonAnalisarMateria["idAluno"]}`;
    });

    carregamento();

    const respBuscarMateria = await buscarMateria(parametrosJsonAnalisarMateria["idMateria"], parametrosJsonAnalisarMateria["idCurso"]);
    if(respBuscarMateria["status"] == erroRequisicao) {
        mensagemPopUp.show({
            mensagem: "Tivemos problemas ao acessar esse questionario!",
            cor: "red"
        });
        voltarPagina();
    } else {
        document.querySelector("#analisarMaterias form#analisarMateriasForm h2#nomeQuestionarioAnalisar").innerHTML = respBuscarMateria["resultados"][0]["nome"];
        document.querySelector("#analisarMaterias form#analisarMateriasForm p#descricaoQuestionarioAnalisar").innerHTML = respBuscarMateria["resultados"][0]["descricao"];
    }

    pararCarregamento();
}