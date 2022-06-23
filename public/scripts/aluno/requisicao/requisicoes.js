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
    console.log(respReqAluno);
    // const respHistorico = await resultadoHistoricoIdQuestionario(parametrosJsonRelatorio["idQuestionario"]);
    // if(respHistorico && respHistorico["status"]!=erroRequisicao) {
    //     document.querySelector("div#principalRelatorio #conteudoRelatorio table tbody").innerHTML = "";
    //     for(let x=0; x<respHistorico["resultados"].length; x++) {
    //         const linhaTabela = `
    //             <tr ${x % 2 == 0 ? '' : 'class="cinza"'}>
    //                 <td>${respHistorico["resultados"].length - x}</td>
    //                 <td>${formatarData(respHistorico["resultados"][x]["data"])}</td>
    //                 <td>${respHistorico["resultados"][x]["hora"]}</td>
    //                 <td>${respHistorico["resultados"][x]["qtdAcertos"]}</td>
    //                 <td>${respHistorico["resultados"][x]["qtdErros"]}</td>
    //                 <td>${arredondar(respHistorico["resultados"][x]["nota"])}</td>
    //                 <td><button onclick="revisaoQuestionario(${respHistorico["resultados"][x]["idResponde"]})"><p>Revisao</p></button></td>
    //             </tr>
    //         `;
    //         document.querySelector("div#principalRelatorio #conteudoRelatorio table tbody").innerHTML += linhaTabela;
    //     }
    // } else if (respHistorico && respHistorico["status"]==erroRequisicao && respHistorico["mensagem"] == "Nenhum registro encontrado!") {
    //     document.querySelector("div#principalRelatorio #conteudoRelatorio").innerHTML = `<p>${respHistorico["mensagem"]}</p>`;
    // }
    pararCarregamento();
}