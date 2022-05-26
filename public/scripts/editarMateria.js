var parametrosJson;

async function iniciarEditarMateria(parametros) {
    parametrosJson = parametros;
    const respCurso = await buscarCurso();
    if(respCurso["status"] && respCurso["status"] == sucessoRequisicao && respCurso["resultado"][0]["excluido"] == "true") {
        mensagemPopUp.show({
            mensagem: "Essa materia foi excluida!",
            cor: "red"
        });
        voltarPagina();
    } 

    const respMateria = await buscarMateria();
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
        var nome = document.querySelector("#minhasmateriasEditar input").value;
        var descricao = document.querySelector("#minhasmateriasEditar textarea").value;
        const respCadastro = await editarMateria(nome, descricao);
        if(respCadastro["status"] && respCadastro["status"] == sucessoRequisicao) {
            mensagemPopUp.show({
                mensagem: "Materia editada com sucesso!",
                cor: "green"
            });
            window.location.href = `./aluno.html#/meuscursos/${parametrosJson["idCurso"]}`;
        }
    })

    document.querySelector("#voltarPagina").addEventListener("click", () => {
        voltarPagina();
    });
}

async function buscarCurso(idCurso) {
    carregamento();
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/curso/dadosCursoId.php?id=${idCurso}&token=${buscarToken()}`, {
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
    return data;
}

async function editarMateria(nome, descricao) {
    carregamento();
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/materia/editarMateria.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "id": parametrosJson["idMateria"],
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

async function buscarMateria() {
    carregamento();
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/materia/dadosMateriaId.php?id=${parametrosJson["idMateria"]}&idCurso=${parametrosJson["idCurso"]}&token=${buscarToken()}`, {
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