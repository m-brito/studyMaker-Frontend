var parametrosJsonRelatorio;

async function iniciarRelatorioQuestionario(parametros) {
    parametrosJsonRelatorio = parametros;
    await verificarLogado(buscarToken());

    document.querySelector("#voltarPagina").addEventListener("click", () => {
        voltarPagina();
    });

    mostrarRelatorio();
}

function revisaoQuestionario(idResponde) {
    window.location.href = `./aluno.html#/revisao/curso/${parametrosJsonRelatorio["idCurso"]}/materia/${parametrosJsonRelatorio["idMateria"]}/questionario/${parametrosJsonRelatorio["idQuestionario"]}/resultado/${idResponde}`;
}

async function mostrarRelatorio() {
    carregamento();
    const respHistorico = await resultadoHistoricoIdQuestionario(parametrosJsonRelatorio["idQuestionario"]);
    if(respHistorico && respHistorico["status"]!=erroRequisicao) {
        document.querySelector("div#principalRelatorio #conteudoRelatorio table tbody").innerHTML = "";
        for(let x=0; x<respHistorico["resultados"].length; x++) {
            const linhaTabela = `
                <tr ${x % 2 == 0 ? '' : 'class="cinza"'}>
                    <td>${respHistorico["resultados"].length - x}</td>
                    <td>${formatarData(respHistorico["resultados"][x]["data"])}</td>
                    <td>${respHistorico["resultados"][x]["hora"]}</td>
                    <td>${respHistorico["resultados"][x]["qtdAcertos"]}</td>
                    <td>${respHistorico["resultados"][x]["qtdErros"]}</td>
                    <td>${arredondar(respHistorico["resultados"][x]["nota"])}</td>
                    <td><button onclick="revisaoQuestionario(${respHistorico["resultados"][x]["idResponde"]})"><p>Revisao</p></button></td>
                </tr>
            `;
            document.querySelector("div#principalRelatorio #conteudoRelatorio table tbody").innerHTML += linhaTabela;
        }
    } else if (respHistorico && respHistorico["status"]==erroRequisicao && respHistorico["mensagem"] == "Nenhum registro encontrado!") {
        document.querySelector("div#principalRelatorio #conteudoRelatorio").innerHTML = `<p>${respHistorico["mensagem"]}</p>`;
    }
    pararCarregamento();
}