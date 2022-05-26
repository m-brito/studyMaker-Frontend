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
        }
    })

    document.querySelector("#voltarPagina").addEventListener("click", () => {
        voltarPagina();
    });
}

async function cadastrarCurso(nome, descricao) {
    carregamento();
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/curso/cadastrarCurso.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "nome": nome,
                    "descricao": descricao
                })
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    pararCarregamento();
    return data;
}