async function iniciarEditarCurso(parametros) {

    const respCurso = await buscarCurso(parametros["idCurso"]);
    if(respCurso["status"] && respCurso["status"] == sucessoRequisicao) {
        document.querySelector("#meuscursosEditar input").value = respCurso["resultados"][0]["nome"];
        document.querySelector("#meuscursosEditar textarea").value = respCurso["resultados"][0]["descricao"];
        document.querySelector("#meuscursosEditar input[name=idCurso]").value = respCurso["resultados"][0]["id"];
    }

    document.querySelector("#meuscursosEditar form").addEventListener("submit", async (event) => {
        event.preventDefault();
        return;
    })

    document.querySelector("#meuscursosEditar .meuscursosEditarAcoes #editar").addEventListener("click", async () => {
        Confirm.open({
            mensagem: "Caso voce editar, o curso sera despublicado! <br> Tem certeza que deseja continuar?",
            textoOK: "Sim",
            textoCancelar: "Cancelar",
            onok: async () => {
                var nome = document.querySelector("#meuscursosEditar input").value;
                var descricao = document.querySelector("#meuscursosEditar textarea").value;
                const respCadastro = await editarCurso(nome, descricao, parametros["idCurso"]);
                if(respCadastro["status"] && respCadastro["status"] == sucessoRequisicao) {
                    mensagemPopUp.show({
                        mensagem: "Curso editado com sucesso!",
                        cor: "green"
                    });
                    window.location.href = "./aluno.html#/aluno/meuscursos"
                }
            }
        })
    })

    document.querySelector("#voltarPagina").addEventListener("click", () => {
        voltarPagina();
    });
}