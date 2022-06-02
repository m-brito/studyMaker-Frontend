async function iniciarCadastrarCurso() {
    await verificarLogado(buscarToken());
    document.querySelector("#meuscursosCadastrar form").addEventListener("submit", async (event) => {
        event.preventDefault();
        return;
    })

    document.querySelector("#meuscursosCadastrar .meuscursosCadastrarAcoes #cadastrar").addEventListener("click", async () => {
        var nome = document.querySelector("#meuscursosCadastrar input").value;
        var descricao = document.querySelector("#meuscursosCadastrar textarea").value;
        const respCadastro = await cadastrarCurso(nome, descricao);
        if(respCadastro["status"] && respCadastro["status"] == sucessoRequisicao) {
            mensagemPopUp.show({
                mensagem: "Curso cadastrado com sucesso!",
                cor: "green"
            });
            voltarPagina();
        } else {
            mensagemPopUp.show({
                mensagem: respCadastro["mensagem"],
                cor: "red"
            });
            voltarPagina();
        }
    })

    document.querySelector("#voltarPagina").addEventListener("click", () => {
        voltarPagina();
    });
}