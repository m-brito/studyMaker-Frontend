var parametrosJsonQuestionarios;

async function iniciarMeusQuestionarios(parametros) {
    parametrosJsonQuestionarios = parametros;
    await verificarLogado(buscarToken());
    await mostrarQuestionarios();

    document.querySelector("#questionariosPrincipal #bttCadastrarNovoCurso").addEventListener("click", (event) => {
        window.location.href += "/questionario/cadastrar"
    });

    document.querySelector("#voltarPagina").addEventListener("click", () => {
        voltarPagina();
    });
}

async function deletarQuestionario(idQuestionario) {
    Confirm.open({
        mensagem: "Tem certeza que deseja exluir este questionarios?",
        textoOK: "Sim",
        textoCancelar: "Cancelar",
        onok: async () => {
            const respExcluirQuestionario = await apiDeletarQuestionario(idQuestionario);
            if(respExcluirQuestionario["status"] && respExcluirQuestionario["status"] == sucessoRequisicao) {
                mensagemPopUp.show({
                    mensagem: "Questionario excluido com sucesso!",
                    cor: "green"
                });
                mostrarQuestionarios();
            }
        }
    })
}

async function publicarQuestionario(idQuestionario, publico) {
    if(publico == true) {
        mensagemPopUp.show({
            mensagem: "Este questionario ja esta publico!",
            cor: "orange"
        });
    } else {
        const respReqQuestionarioId = await resultadoRequisicoesQuestionarioId(idQuestionario);
        if(respReqQuestionarioId["status"] && respReqQuestionarioId["status"] != erroRequisicao) {
            mensagemPopUp.show({
                mensagem: `Este questionario ja tem uma requisição pendente feita no dia ${formatarData(respReqQuestionarioId["resultados"][0]["data"])}!`,
                cor: "red"
            });
        } else {
            Confirm.open({
                mensagem: "Tem certeza que deseja publicar este questionario?",
                textoOK: "Sim",
                textoCancelar: "Cancelar",
                onok: async () => {
                    const respCadReqQuestionario = await cadastrarRequisicaoQuestionario(idQuestionario);
                    if(respCadReqQuestionario["status"] && respCadReqQuestionario["status"] != erroRequisicao) {
                        mensagemPopUp.show({
                            mensagem: `Requisicao feita com sucesso!`,
                            cor: "green"
                        });
                        enviarMensagem(EMAILSITE, NOMEPARA, "Requisicao", "Acaba de chegar uma nova requisicao de questionario!");
                    }
                }
            })
        }
    }
}

async function editarOcultoQuestionario(idQuestionario, acao) {
    const respEditaQuestionario = await ocultarDesocultarQuestionario(idQuestionario);
    if(respEditaQuestionario["status"] && respEditaQuestionario["status"] == sucessoRequisicao) {
        mensagemPopUp.show({
            mensagem: "Seu questionario foi "+acao+" com sucesso!",
            cor: "green"
        });
        mostrarQuestionarios();
    }
}

async function relatorioQuestionario(idQuestionario) {
    window.location.href = `./aluno.html#/relatorio/curso/${parametrosJsonQuestionarios["idCurso"]}/materia/${parametrosJsonQuestionarios["idMateria"]}/questionario/${idQuestionario}`;
}

async function mostrarQuestionarios() {
    carregamento();
    
    let divCartoes = document.querySelector("#questionariosPrincipal #questionariosConteudo");
    divCartoes.innerHTML = "";

    const meusQuestionarios = await buscarMeusQuestionarios(parametrosJsonQuestionarios["idMateria"], parametrosJsonQuestionarios["idCurso"]);
    
    if(meusQuestionarios["status"] && meusQuestionarios["status"] == erroRequisicao) {
        divCartoes.innerHTML = `<p style='text-align: center; font-size: 20px;'>${meusQuestionarios.mensagem}</p>`;
    } else {
        for(let x = 0; x<meusQuestionarios["resultados"].length; x++) {
            let divCartao = `
                <div class="questionariosCartao" id="${meusQuestionarios["resultados"][x]["id"]}">
                    <div class="questionariosImagemCartao" style="background-color: ${meusQuestionarios["resultados"][x]["cor"]} !important">
                        <img src="${meusQuestionarios["resultados"][x]["imagem"]}" alt="Letra ${meusQuestionarios["resultados"][x]["nome"][0]}">
                    </div>
                    <div class="questionariosConteudoCartao">
                        <h2 class="questionariosNomeCartao">${meusQuestionarios["resultados"][x]["nome"]}</h2>
                        <div class="questionariosEstados">
                            <img onclick="publicarQuestionario(${meusQuestionarios["resultados"][x]["id"]}, ${meusQuestionarios["resultados"][x]["publico"]})" src="${meusQuestionarios["resultados"][x]["publico"] == "true" ? '../../public/assets/Imagens/Icone-publico.svg' : '../../public/assets/Imagens/Icone-privado.svg'}" alt="Questionario ${meusQuestionarios["resultados"][x]["privado"] == "true" ? 'privado' : 'publico'}">
                            <img onclick="editarOcultoQuestionario(${meusQuestionarios["resultados"][x]["id"]}, '${meusQuestionarios["resultados"][x]["oculto"] == "true" ? 'exposto' : 'ocultado'}')" src="${meusQuestionarios["resultados"][x]["oculto"] == "true" ? '../../public/assets/Imagens/Icone-oculto.svg' : '../../public/assets/Imagens/Icone-exposto.svg'}" alt="Curso ${meusQuestionarios["resultados"][x]["oculto"] == true ? 'oculto' : 'exposto'}">
                            <img onclick="relatorioQuestionario(${meusQuestionarios["resultados"][x]["id"]})" src="../../public/assets/Imagens/Icone-notas.svg">
                        </div>
                        <div class="questionariosCartaoOpcoes">
                            <button class="questionariosAbrir" onclick="abrirQuestionario(${meusQuestionarios["resultados"][x]["id"]})">
                                <p id="${meusQuestionarios["resultados"][x]["id"]}">Abrir</p>
                            </button>
                            <button class="questionariosEditar" onclick="redirecionarEditarQuestionario(${meusQuestionarios["resultados"][x]["id"]})" id="${meusQuestionarios["resultados"][x]["id"]}">
                                <img src="../../public/assets/Imagens/Icone-editar-branco.svg" alt="Editar">
                            </button>
                            <button class="questionariosDeletar" onclick="deletarQuestionario(${meusQuestionarios["resultados"][x]["id"]})" id="${meusQuestionarios["resultados"][x]["id"]}">
                                <img src="../../public/assets/Imagens/Icone-deletar.svg" alt="Deletar">
                            </button>
                        </div>
                    </div>
                </div>
            `;
            divCartoes.innerHTML += divCartao;
        }
    }
    pararCarregamento();
}

// Redirecionamentos
function abrirQuestionario(idQuestionario) {
    window.location.href = `./aluno.html#/responderQuestionario/curso/${parametrosJsonQuestionarios["idCurso"]}/materia/${parametrosJsonQuestionarios["idMateria"]}/questionario/${idQuestionario}`;
}

function redirecionarEditarQuestionario(idQuestionario) {
    window.location.href += `/questionario/editar/${idQuestionario}`;
}