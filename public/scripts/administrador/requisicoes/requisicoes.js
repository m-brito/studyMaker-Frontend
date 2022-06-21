var parametrosJsonRequisicoes;

async function iniciarRequisicoes(parametros) {
    parametrosJsonRequisicoes = parametros;
    await verificarLogadoAdm(buscarToken());

    document.querySelector("#voltarPagina").addEventListener("click", () => {
        voltarPagina();
    });

    mostrarRequisicoes();
}

function revisaoRequisicoes(idAluno) {
    window.location.href = `./administrador.html#/administrador/requisicoes/aluno/${idAluno}`;
}

async function mostrarRequisicoes() {
    carregamento();
    const respReq = await resultadoRequisicoes();
    if(respReq && respReq["status"]!=erroRequisicao) {
        document.querySelector("div#principalRequisicoesAdm #conteudoRequisicoes table tbody").innerHTML = "";
        for(let x=0; x<respReq["resultados"].length; x++) {
            const linhaTabela = `
                <tr ${x % 2 == 0 ? '' : 'class="cinza"'}>
                    <td>${respReq["resultados"][x]["nome"]}</td>
                    <td>${respReq["resultados"][x]["qtdeCursos"]}</td>
                    <td>${respReq["resultados"][x]["qtdeMaterias"]}</td>
                    <td>${respReq["resultados"][x]["qtdeQuestionario"]}</td>
                    <td>${respReq["resultados"][x]["dataCurso"] != null ? formatarData(respReq["resultados"][x]["dataCurso"]) : "Sem cursos"}</td>
                    <td>${respReq["resultados"][x]["dataMateria"] != null ? formatarData(respReq["resultados"][x]["dataMateria"]) : "Sem materias"}</td>
                    <td>${respReq["resultados"][x]["dataQuestionario"] != null ? formatarData(respReq["resultados"][x]["dataQuestionario"]) : "Sem questionarios"}</td>
                    <td><button onclick="revisaoRequisicoes(${respReq["resultados"][x]["id"]})"><p>Abrir</p></button></td>
                </tr>
            `;
            document.querySelector("div#principalRequisicoesAdm #conteudoRequisicoes table tbody").innerHTML += linhaTabela;
        }
    } else if (respReq && respReq["status"]==erroRequisicao && respReq["mensagem"] == "Nenhum registro encontrado!") {
        document.querySelector("div#principalRequisicoesAdm #conteudoRequisicoes").innerHTML = `<p>${respReq["mensagem"]}</p>`;
    }
    pararCarregamento();
}