var parametrosJsonRequisicoesAluno;

async function iniciarRequisicoesAluno(parametros) {
    parametrosJsonRequisicoesAluno = parametros;
    await verificarLogado(buscarToken());

    document.querySelector("#voltarPagina").addEventListener("click", () => {
        voltarPagina();
    });

    mostrarRequisicoesAluno();
}

async function mostrarRequisicoesAluno() {
    carregamento();
    const respReqAluno = await resultadoRequisicoesAluno();
    if(respReqAluno && respReqAluno["status"]!=erroRequisicao && respReqAluno["resultados"].length > 0) {
        respReqAluno["resultados"].sort(function(a,b) {
            return (new Date(b["data"]).getTime() - new Date(a["data"]).getTime())
        });
        document.querySelector("div#principalRequisicaoAluno #conteudoRequisicaoAluno table tbody").innerHTML = "";
        for(let x=0; x<respReqAluno["resultados"].length; x++) {
            const linhaTabela = `
                <tr ${x % 2 == 0 ? '' : 'class="cinza"'}>
                    <td>${respReqAluno["resultados"][x]["tipo"]}</td>
                    <td>${respReqAluno["resultados"][x]["nome"+respReqAluno["resultados"][x]["tipo"]]}</td>
                    <td>${formatarData(respReqAluno["resultados"][x]["data"])}</td>
                    <td>${respReqAluno["resultados"][x]["dataAvaliado"] != null ? formatarData(respReqAluno["resultados"][x]["dataAvaliado"]) : "-----"}</td>
                    <td>${respReqAluno["resultados"][x]["mensagemAvaliacao"] != null && respReqAluno["resultados"][x]["mensagemAvaliacao"] != "" ? respReqAluno["resultados"][x]["mensagemAvaliacao"] : "-----"}</td>
                    <td>${respReqAluno["resultados"][x]["nomeAdministrador"] != null && respReqAluno["resultados"][x]["nomeAdministrador"] != "" ? respReqAluno["resultados"][x]["nomeAdministrador"] : "-----"}</td>
                    <td class="status"><p class="statusReq" style="background-color: ${respReqAluno["resultados"][x]["status"] == null ? "#e9ab2c" : respReqAluno["resultados"][x]["status"] == "Recusado" ? "#ff5a5a" : "#37c537"}">${respReqAluno["resultados"][x]["status"] != null ? respReqAluno["resultados"][x]["status"] : "Pendente"}</p></td>
                </tr>
            `;
            document.querySelector("div#principalRequisicaoAluno #conteudoRequisicaoAluno table tbody").innerHTML += linhaTabela;
        }
    } else if (respReqAluno && respReqAluno["status"]==erroRequisicao && respReqAluno["mensagem"] == "Nenhum registro encontrado!" || respReqAluno["resultados"].length <= 0) {
        document.querySelector("div#principalRequisicaoAluno #conteudoRequisicaoAluno").innerHTML = `<p>Nenhum registro encontrado</p>`;
    }
    pararCarregamento();
}