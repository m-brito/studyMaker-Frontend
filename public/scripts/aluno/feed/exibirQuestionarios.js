var parametrosJsonQuestionarios;

async function iniciarFeedQuestionarios(parametros) {
    parametrosJsonQuestionarios = parametros;
    await verificarLogado(buscarToken());
    await mostrarQuestionariosFeed();

    document.querySelector("#voltarPagina").addEventListener("click", () => {
        voltarPagina();
    });
}

async function feedDeletarQuestionario(idQuestionario) {
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
                mostrarQuestionariosFeed();
            }
        }
    })
}

async function feedEditarOcultoQuestionario(idQuestionario, acao) {
    const respEditaQuestionario = await ocultarDesocultarQuestionario(idQuestionario);
    if(respEditaQuestionario["status"] && respEditaQuestionario["status"] == sucessoRequisicao) {
        mensagemPopUp.show({
            mensagem: "Seu questionario foi "+acao+" com sucesso!",
            cor: "green"
        });
        mostrarQuestionariosFeed();
    }
}

async function mostrarQuestionariosFeed() {
    carregamento();
    
    let divCartoes = document.querySelector("#questionariosPrincipal #questionariosConteudo");
    divCartoes.innerHTML = "";

    const meusQuestionarios = await buscarQuestionariosPublicos(parametrosJsonQuestionarios["idMateria"], parametrosJsonQuestionarios["idCurso"]);
    
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
                            ${meusQuestionarios["resultados"][x]["permissao"] ? `
                                <img src="${meusQuestionarios["resultados"][x]["publico"] == "true" ? '../../public/assets/Imagens/Icone-publico.svg' : '../../public/assets/Imagens/Icone-privado.svg'}" alt="Questionario ${meusQuestionarios["resultados"][x]["privado"] == "true" ? 'privado' : 'publico'}">
                                <img onclick="feedEditarOcultoQuestionario(${meusQuestionarios["resultados"][x]["id"]}, '${meusQuestionarios["resultados"][x]["oculto"] == "true" ? 'exposto' : 'ocultado'}')" src="${meusQuestionarios["resultados"][x]["oculto"] == "true" ? '../../public/assets/Imagens/Icone-oculto.svg' : '../../public/assets/Imagens/Icone-exposto.svg'}" alt="Curso ${meusQuestionarios["resultados"][x]["oculto"] == true ? 'oculto' : 'exposto'}">
                                <img onclick="feedRelatorioQuestionario(${meusQuestionarios["resultados"][x]["id"]})" src="../../public/assets/Imagens/Icone-notas.svg">
                            ` : `
                                <img onclick="feedRelatorioQuestionario(${meusQuestionarios["resultados"][x]["id"]})" src="../../public/assets/Imagens/Icone-notas.svg">
                            `}                            
                        </div>
                        <div class="divAutor">
                            <img src="../../public/assets/Imagens/Icone-autor.svg" alt="Autor">
                            <p>${meusQuestionarios["resultados"][x]["nomeAutor"]}</p>
                        </div>
                        <div class="questionariosCartaoOpcoes">
                            ${meusQuestionarios["resultados"][x]["permissao"] ? `
                                <button class="questionariosAbrir" onclick="feedAbrirQuestionario(${meusQuestionarios["resultados"][x]["id"]})">
                                    <p id="${meusQuestionarios["resultados"][x]["id"]}">Abrir</p>
                                </button>
                                <button class="questionariosEditar" onclick="feedRedirecionarEditarQuestionario(${meusQuestionarios["resultados"][x]["id"]})" id="${meusQuestionarios["resultados"][x]["id"]}">
                                    <img src="../../public/assets/Imagens/Icone-editar-branco.svg" alt="Editar">
                                </button>
                                <button class="questionariosDeletar" onclick="feedDeletarQuestionario(${meusQuestionarios["resultados"][x]["id"]})" id="${meusQuestionarios["resultados"][x]["id"]}">
                                    <img src="../../public/assets/Imagens/Icone-deletar.svg" alt="Deletar">
                                </button>
                            ` : `
                                <button class="questionariosAbrir" onclick="feedAbrirQuestionario(${meusQuestionarios["resultados"][x]["id"]})">
                                    <p id="${meusQuestionarios["resultados"][x]["id"]}">Abrir</p>
                                </button>
                            `}
                            
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
function feedAbrirQuestionario(idQuestionario) {
    window.location.href = `./aluno.html#/responderQuestionario/curso/${parametrosJsonQuestionarios["idCurso"]}/materia/${parametrosJsonQuestionarios["idMateria"]}/questionario/${idQuestionario}`;
}

function feedRedirecionarEditarQuestionario(idQuestionario) {
    window.location.href = `./aluno.html#/aluno/meuscursos/${parametrosJsonQuestionarios["idCurso"]}/materia/${parametrosJsonQuestionarios["idMateria"]}/questionario/editar/${idQuestionario}`;
}

async function feedRelatorioQuestionario(idQuestionario) {
    window.location.href = `./aluno.html#/relatorio/curso/${parametrosJsonQuestionarios["idCurso"]}/materia/${parametrosJsonQuestionarios["idMateria"]}/questionario/${idQuestionario}`;
}