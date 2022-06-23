async function iniciarEditarMateria(parametros) {
    const respCurso = await buscarCurso(parametros["idCurso"]);
    if(respCurso["status"] && respCurso["status"] == sucessoRequisicao && respCurso["resultados"][0]["excluido"] == "true") {
        mensagemPopUp.show({
            mensagem: "Essa materia foi excluida!",
            cor: "red"
        });
        voltarPagina();
    } 

    const respMateria = await buscarMateria(parametros["idMateria"], parametros["idCurso"]);
    if(respMateria["status"] && respMateria["status"] == sucessoRequisicao) {
        document.querySelector("#minhasmateriasEditar input").value = respMateria["resultados"][0]["nome"];
        document.querySelector("#minhasmateriasEditar textarea").value = respMateria["resultados"][0]["descricao"];
        document.querySelector("#minhasmateriasEditar input[name=idMateria]").value = respMateria["resultados"][0]["id"];
    }

    document.querySelector("#minhasmateriasEditar form").addEventListener("submit", async (event) => {
        event.preventDefault();
        return;
    })

    document.querySelector("#minhasmateriasEditar .minhasmateriasEditarAcoes #editar").addEventListener("click", async () => {
        Confirm.open({
            mensagem: "Caso voce editar, a materia sera despublicada! <br> Tem certeza que deseja continuar?",
            textoOK: "Sim",
            textoCancelar: "Cancelar",
            onok: async () => {
                var nome = document.querySelector("#minhasmateriasEditar input").value;
                var descricao = document.querySelector("#minhasmateriasEditar textarea").value;
                const respCadastro = await editarMateria(parametros["idMateria"], parametros["idCurso"], nome, descricao);
                if(respCadastro["status"] && respCadastro["status"] == sucessoRequisicao) {
                    mensagemPopUp.show({
                        mensagem: "Materia editada com sucesso!",
                        cor: "green"
                    });
                    window.location.href = `./aluno.html#/aluno/meuscursos/${parametros["idCurso"]}`;
                }
            }
        })
    })

    document.querySelector("#voltarPagina").addEventListener("click", () => {
        voltarPagina();
    });
}