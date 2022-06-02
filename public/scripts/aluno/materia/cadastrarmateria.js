var parametrosJson;

async function iniciarCadastrarMateria(parametros) {
    parametrosJson = parametros;
    await verificarLogado(buscarToken());
    document.querySelector("#minhasmateriasCadastrar form").addEventListener("submit", async (event) => {
        event.preventDefault();
        return;
    })

    document.querySelector("#minhasmateriasCadastrar .minhasmateriasCadastrarAcoes #cadastrar").addEventListener("click", async () => {
        var nome = document.querySelector("#minhasmateriasCadastrar input").value;
        var descricao = document.querySelector("#minhasmateriasCadastrar textarea").value;
        const respCadastro = await cadastrarMateria(nome, descricao, parametros["idCurso"]);
        if(respCadastro["status"] && respCadastro["status"] == sucessoRequisicao) {
            mensagemPopUp.show({
                mensagem: "Materia cadastrado com sucesso!",
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