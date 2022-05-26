async function iniciarCadastrarMateria(parametros) {
    document.querySelector("#minhasmateriasCadastrar form").addEventListener("submit", async (event) => {
        event.preventDefault();
        return;
    })

    document.querySelector("#minhasmateriasCadastrar .minhasmateriasCadastrarAcoes #cadastrar").addEventListener("click", async () => {
        var nome = document.querySelector("#minhasmateriasCadastrar input").value;
        var descricao = document.querySelector("#minhasmateriasCadastrar textarea").value;
        const respCadastro = await cadastrarMateria(nome, descricao, parametros["idCurso"]);
        if(respCadastro["status"] && respCadastro["status"] == sucessoRequisicao) {
            mostrarMensagem("Materia cadastrado com sucesso");
            setTimeout(() => {
                window.location.href = "../../"
            }, 3000)
        }
    })

    document.querySelector("#voltarPagina").addEventListener("click", () => {
        voltarPagina();
    });
}

async function cadastrarMateria(nome, descricao, idCurso) {
    carregamento();
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/materia/cadastrarMateria.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "nome": nome,
                    "descricao": descricao,
                    "idCurso": idCurso
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