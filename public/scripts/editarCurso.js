var parametrosJson;

async function iniciarEditarCurso(parametros) {
    parametrosJson = parametros;

    const respCurso = await ecBuscarCurso();
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
        var nome = document.querySelector("#meuscursosEditar input").value;
        var descricao = document.querySelector("#meuscursosEditar textarea").value;
        const respCadastro = await editarCurso(nome, descricao);
        if(respCadastro["status"] && respCadastro["status"] == sucessoRequisicao) {
            mensagemPopUp.show({
                mensagem: "Curso editado com sucesso!",
                cor: "green"
            });
            window.location.href = "./aluno.html#/meuscursos"
        }
    })

    document.querySelector("#voltarPagina").addEventListener("click", () => {
        voltarPagina();
    });
}

async function editarCurso(nome, descricao) {
    carregamento();
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/curso/editarCurso.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "id": parametrosJson["idCurso"],
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

async function ecBuscarCurso() {
    carregamento();
    var tentativas = 0;
    var ok = false;
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/curso/dadosCursoId.php?id=${parametrosJson["idCurso"]}&token=${buscarToken()}`, {
                "method": "GET",
                headers: {
                    'Accept': 'application/json',
                }
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    pararCarregamento();
    if(ok == true && data["status"] == erroRequisicao) {
        mensagemPopUp.show({
            mensagem: data["mensagem"],
            cor: "red"
        });
        voltarPagina();
    }
    return data;
}