var parametrosJsonRequisicoesAluno;

async function iniciarRequisicoesAluno(parametros) {
    parametrosJsonRequisicoesAluno = parametros;
    await verificarLogadoAdm(buscarToken());

    document.querySelector("#voltarPagina").addEventListener("click", () => {
        voltarPagina();
    });

    mostrarRequisicoesAluno();
}

function analisarCurso(idCurso) {
    window.location.href = `./administrador.html#/administrador/requisicoes/aluno/${parametrosJsonRequisicoesAluno["idAluno"]}/curso/${idCurso}`;
}

function analisarMateria(idMateria) {
    window.location.href = `./administrador.html#/administrador/requisicoes/aluno/${parametrosJsonRequisicoesAluno["idAluno"]}/materia/${idMateria}`;
}

function analisarQuestionario(idQuestionario) {
    window.location.href = `./administrador.html#/administrador/requisicoes/aluno/${parametrosJsonRequisicoesAluno["idAluno"]}/questionario/${idQuestionario}`;
}

async function mostrarRequisicoesAluno() {
    carregamento();

    let divCartoesRequisicoesCursos = document.querySelector("#principalRequisicoesAluno #conteudoCartaoCursos");
    let divCartoesRequisicoesMaterias = document.querySelector("#principalRequisicoesAluno #conteudoCartaoMaterias");
    let divCartoesRequisicoesQuestionarios = document.querySelector("#principalRequisicoesAluno #conteudoCartaoQuestionarios");
    divCartoesRequisicoesCursos.innerHTML = "";
    divCartoesRequisicoesMaterias.innerHTML = "";
    divCartoesRequisicoesQuestionarios.innerHTML = "";

    const respReqCursos = await resultadoRequisicoesCursosAluno(parametrosJsonRequisicoesAluno["idAluno"]);

    if(respReqCursos && respReqCursos["status"]!=erroRequisicao) {
        for(let x = 0; x<respReqCursos["resultados"].length; x++) {
            const cartao = `
                <div class="cartaoRequisicao" id="${respReqCursos["resultados"][x]["idCurso"]}">
                    <div class="requisicoesImagemCartao" style="background-color: ${respReqCursos["resultados"][x]["cor"]} !important">
                        <img src="${respReqCursos["resultados"][x]["imagemCurso"]}" alt="Letra ${respReqCursos["resultados"][x]["nomeCurso"][0]}">
                    </div>
                    <div class="requisicoesConteudoCartao">
                        <h2 class="requisicoesNomeCartao">${respReqCursos["resultados"][x]["nomeCurso"]}</h2>
                        <div class="requisicoesEstados">
                            <img onclick="analisarCurso(${respReqCursos["resultados"][x]["idCurso"]})" src="../../public/assets/Imagens/Icone-analisar.svg" alt="Analisar">
                        </div>
                        <div class="cartaoRequisicaoOpcoes">
                            <button class="requisicoesAceitar" onclick="aceitarRequisicaoCurso(${respReqCursos["resultados"][x]["idTornarPublico"]})">
                                <p id="${respReqCursos["resultados"][x]["idTornarPublico"]}">Aceitar</p>
                            </button>
                            <button class="requisicoesRecusar" onclick="recusarRequisicaoCurso(${respReqCursos["resultados"][x]["idTornarPublico"]})" id="${respReqCursos["resultados"][x]["id"]}">
                                <img src="../../public/assets/Imagens/Icone-x.svg" alt="Recusar">
                            </button>
                        </div>
                    </div>
                </div>
            `;
            divCartoesRequisicoesCursos.innerHTML += cartao;
        }
    } else {
        divCartoesRequisicoesCursos.innerHTML = `<p style='text-align: center; font-size: 20px;'>${respReqCursos.mensagem}</p>`;
    }

    const respReqMaterias = await resultadoRequisicoesMateriasAluno(parametrosJsonRequisicoesAluno["idAluno"]);

    if(respReqMaterias && respReqMaterias["status"]!=erroRequisicao) {
        for(let x = 0; x<respReqMaterias["resultados"].length; x++) {
            const cartao = `
                <div class="cartaoRequisicao" id="${respReqMaterias["resultados"][x]["idMateria"]}">
                    <div class="requisicoesImagemCartao" style="background-color: ${respReqMaterias["resultados"][x]["cor"]} !important">
                        <img src="${respReqMaterias["resultados"][x]["imagemMateria"]}" alt="Letra ${respReqMaterias["resultados"][x]["nomeMateria"][0]}">
                    </div>
                    <div class="requisicoesConteudoCartao">
                        <h2 class="requisicoesNomeCartao">${respReqMaterias["resultados"][x]["nomeMateria"]}</h2>
                        <div class="requisicoesEstados">
                            <img onclick="analisarMateria(${respReqMaterias["resultados"][x]["idMateria"]})" src="../../public/assets/Imagens/Icone-analisar.svg" alt="Analisar">
                        </div>
                        <div class="cartaoRequisicaoOpcoes">
                            <button class="requisicoesAceitar" onclick="aceitarRequisicaoMateria(${respReqMaterias["resultados"][x]["idTornarPublico"]})">
                                <p id="${respReqMaterias["resultados"][x]["idMateria"]}">Aceitar</p>
                            </button>
                            <button class="requisicoesRecusar" onclick="recusarRequisicaoMateria(${respReqMaterias["resultados"][x]["idTornarPublico"]})" id="${respReqMaterias["resultados"][x]["idMateria"]}">
                                <img src="../../public/assets/Imagens/Icone-x.svg" alt="Recusar">
                            </button>
                        </div>
                    </div>
                </div>
            `;
            divCartoesRequisicoesMaterias.innerHTML += cartao;
        }
    } else {
        divCartoesRequisicoesMaterias.innerHTML = `<p style='text-align: center; font-size: 20px;'>${respReqMaterias.mensagem}</p>`;
    }

    const respReqQuestionarios = await resultadoRequisicoesQuestionariosAluno(parametrosJsonRequisicoesAluno["idAluno"]);

    if(respReqQuestionarios && respReqQuestionarios["status"]!=erroRequisicao) {
        for(let x = 0; x<respReqQuestionarios["resultados"].length; x++) {
            const cartao = `
                <div class="cartaoRequisicao" id="${respReqQuestionarios["resultados"][x]["idQuestionario"]}">
                    <div class="requisicoesImagemCartao" style="background-color: ${respReqQuestionarios["resultados"][x]["cor"]} !important">
                        <img src="${respReqQuestionarios["resultados"][x]["imagemQuestionario"]}" alt="Letra ${respReqQuestionarios["resultados"][x]["nomeQuestionario"][0]}">
                    </div>
                    <div class="requisicoesConteudoCartao">
                        <h2 class="requisicoesNomeCartao">${respReqQuestionarios["resultados"][x]["nomeQuestionario"]}</h2>
                        <div class="requisicoesEstados">
                            <img onclick="analisarQuestionario(${respReqQuestionarios["resultados"][x]["idQuestionario"]})" src="../../public/assets/Imagens/Icone-analisar.svg" alt="Analisar">
                        </div>
                        <div class="cartaoRequisicaoOpcoes">
                            <button class="requisicoesAceitar" onclick="aceitarRequisicaoQuestionario(${respReqQuestionarios["resultados"][x]["idTornarPublico"]})">
                                <p id="${respReqQuestionarios["resultados"][x]["idTornarPublico"]}">Aceitar</p>
                            </button>
                            <button class="requisicoesRecusar" onclick="recusarRequisicaoQuestionario(${respReqQuestionarios["resultados"][x]["idTornarPublico"]})" id="${respReqQuestionarios["resultados"][x]["id"]}">
                                <img src="../../public/assets/Imagens/Icone-x.svg" alt="Recusar">
                            </button>
                        </div>
                    </div>
                </div>
            `;
            divCartoesRequisicoesQuestionarios.innerHTML += cartao;
        }
    } else {
        divCartoesRequisicoesQuestionarios.innerHTML = `<p style='text-align: center; font-size: 20px;'>${respReqQuestionarios.mensagem}</p>`;
    }

    pararCarregamento();
}