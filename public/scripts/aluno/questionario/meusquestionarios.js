var parametrosJsonQuestionarios;

async function iniciarMeusQuestionarios(parametros) {
    parametrosJsonQuestionarios = parametros;
    await verificarLogado(buscarToken());
    await mostrarQuestionarios();

    document.querySelector("#meusquestionariosPrincipal #bttCadastrarNovoCurso").addEventListener("click", (event) => {
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

async function mostrarQuestionarios() {
    carregamento();
    
    let divCartoes = document.querySelector("#meusquestionariosPrincipal #meusquestionariosConteudo");
    divCartoes.innerHTML = "";

    const meusQuestionarios = await buscarMeusQuestionarios(parametrosJsonQuestionarios["idMateria"], parametrosJsonQuestionarios["idCurso"]);
    
    if(meusQuestionarios["status"] && meusQuestionarios["status"] == erroRequisicao) {
        divCartoes.innerHTML = `<p style='text-align: center; font-size: 20px;'>${meusQuestionarios.mensagem}</p>`;
    } else {
        for(let x = 0; x<meusQuestionarios["resultados"].length; x++) {
            let divCartao = `
                <div class="meusquestionariosCartao" id="${meusQuestionarios["resultados"][x]["id"]}">
                    <div class="meusquestionariosImagemCartao" style="background-color: ${meusQuestionarios["resultados"][x]["cor"]} !important">
                        <img src="${meusQuestionarios["resultados"][x]["imagem"]}" alt="Letra ${meusQuestionarios["resultados"][x]["nome"][0]}">
                    </div>
                    <div class="meusquestionariosConteudoCartao">
                        <h2 class="meusquestionariosNomeCartao">${meusQuestionarios["resultados"][x]["nome"]}</h2>
                        <div class="meusquestionariosEstados">
                            <img src="${meusQuestionarios["resultados"][x]["publico"] == "true" ? '../../public/assets/Imagens/Icone-publico.svg' : '../../public/assets/Imagens/Icone-privado.svg'}" alt="Questionario ${meusQuestionarios["resultados"][x]["privado"] == "true" ? 'privado' : 'publico'}">
                            <img onclick="editarOcultoQuestionario(${meusQuestionarios["resultados"][x]["id"]}, '${meusQuestionarios["resultados"][x]["oculto"] == "true" ? 'exposto' : 'ocultado'}')" src="${meusQuestionarios["resultados"][x]["oculto"] == "true" ? '../../public/assets/Imagens/Icone-oculto.svg' : '../../public/assets/Imagens/Icone-exposto.svg'}" alt="Curso ${meusQuestionarios["resultados"][x]["oculto"] == true ? 'oculto' : 'exposto'}">
                        </div>
                        <div class="meusquestionariosCartaoOpcoes">
                            <button class="meusquestionariosAbrir" onclick="abrirQuestionario(${meusQuestionarios["resultados"][x]["id"]})">
                                <p id="${meusQuestionarios["resultados"][x]["id"]}">Abrir</p>
                            </button>
                            <button class="meusquestionariosEditar" onclick="redirecionarEditarQuestionario(${meusQuestionarios["resultados"][x]["id"]})" id="${meusQuestionarios["resultados"][x]["id"]}">
                                <img src="../../public/assets/Imagens/Icone-editar-branco.svg" alt="Editar">
                            </button>
                            <button class="meusquestionariosDeletar" onclick="deletarQuestionario(${meusQuestionarios["resultados"][x]["id"]})" id="${meusQuestionarios["resultados"][x]["id"]}">
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
    window.location.href += `/questionario/${idQuestionario}`;
}

function redirecionarEditarQuestionario(idQuestionario) {
    window.location.href += `/questionario/editar/${idQuestionario}`;
}