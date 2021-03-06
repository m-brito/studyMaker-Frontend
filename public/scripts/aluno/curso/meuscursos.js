async function iniciarMeuscursos() {
    await verificarLogado(buscarToken());
    await mostrarCursos(buscarToken());

    document.querySelector("#cursosPrincipal #bttCadastrarNovoCurso").addEventListener("click", (event) => {
        window.location.href += "/cadastrar"
    });
}

async function deletarCurso(idCurso) {
    Confirm.open({
        mensagem: "Tem certeza que deseja exluir este curso?",
        textoOK: "Sim",
        textoCancelar: "Cancelar",
        onok: async () => {
            const respExcluirCurso = await apiDeletarCurso(idCurso);
            if(respExcluirCurso["status"] && respExcluirCurso["status"] == sucessoRequisicao) {
                mensagemPopUp.show({
                    mensagem: "Curso excluido com sucesso!",
                    cor: "green"
                });
                mostrarCursos(buscarToken());
            }
        }
    })
}

async function publicarCurso(idCurso, publico) {
    if(publico == true) {
        mensagemPopUp.show({
            mensagem: "Este curso ja esta publico!",
            cor: "orange"
        });
    } else {
        const respReqCursoId = await resultadoRequisicoesCursoId(idCurso);
        if(respReqCursoId["status"] && respReqCursoId["status"] != erroRequisicao) {
            mensagemPopUp.show({
                mensagem: `Este curso ja tem uma requisição pendente feita no dia ${formatarData(respReqCursoId["resultados"][0]["data"])}!`,
                cor: "red"
            });
        } else {
            Confirm.open({
                mensagem: "Tem certeza que deseja publicar este curso?",
                textoOK: "Sim",
                textoCancelar: "Cancelar",
                onok: async () => {
                    const respCadReqCurso = await cadastrarRequisicaoCurso(idCurso);
                    if(respCadReqCurso["status"] && respCadReqCurso["status"] != erroRequisicao) {
                        mensagemPopUp.show({
                            mensagem: `Requisicao feita com sucesso!`,
                            cor: "green"
                        });
                        enviarMensagem(EMAILSITE, NOMEPARA, "Requisicao", "Acaba de chegar uma nova requisicao de curso!");
                    }
                }
            })
        }
    }
}

async function editarOculto(idCurso, acao) {
    const respEditaCurso = await ocultarDesocultarCurso(idCurso);
    if(respEditaCurso["status"] && respEditaCurso["status"] == sucessoRequisicao) {
        mensagemPopUp.show({
            mensagem: "Seu curso foi "+acao+" com sucesso!",
            cor: "green"
        });
        mostrarCursos(buscarToken())
    }
}

async function mostrarCursos(token) {
    carregamento();
    
    let divCartoes = document.querySelector("#cursosPrincipal #cursosConteudo");
    divCartoes.innerHTML = "";

    const meusCursos = await buscarMeusCursos(token);
    
    if(meusCursos["status"] && meusCursos["status"] == erroRequisicao) {
        divCartoes.innerHTML = `<p style='text-align: center; font-size: 20px;'>${meusCursos.mensagem}</p>`;
    } else {
        for(let x = 0; x<meusCursos["resultados"].length; x++) {
            let divCartao = `
                <div class="cursosCartao" id="${meusCursos["resultados"][x]["id"]}">
                    <div class="cursosImagemCartao" style="background-color: ${meusCursos["resultados"][x]["cor"]} !important">
                        <img src="${meusCursos["resultados"][x]["imagem"]}" alt="Letra ${meusCursos["resultados"][x]["nome"][0]}">
                    </div>
                    <div class="cursosConteudoCartao">
                        <h2 class="cursosNomeCartao">${meusCursos["resultados"][x]["nome"]}</h2>
                        <div class="cursosEstados">
                            <img onclick="publicarCurso(${meusCursos["resultados"][x]["id"]}, ${meusCursos["resultados"][x]["publico"]})" src="${meusCursos["resultados"][x]["publico"] == "true" ? '../../public/assets/Imagens/Icone-publico.svg' : '../../public/assets/Imagens/Icone-privado.svg'}" alt="Curso ${meusCursos["resultados"][x]["privado"] == "true" ? 'privado' : 'publico'}">
                            <img onclick="editarOculto(${meusCursos["resultados"][x]["id"]}, '${meusCursos["resultados"][x]["oculto"] == "true" ? 'exposto' : 'ocultado'}')" src="${meusCursos["resultados"][x]["oculto"] == "true" ? '../../public/assets/Imagens/Icone-oculto.svg' : '../../public/assets/Imagens/Icone-exposto.svg'}" alt="Curso ${meusCursos["resultados"][x]["oculto"] == true ? 'oculto' : 'exposto'}">
                        </div>
                        <div class="cursosCartaoOpcoes">
                            <button class="cursosAbrir" onclick="abrirCurso(${meusCursos["resultados"][x]["id"]})">
                                <p id="${meusCursos["resultados"][x]["id"]}">Abrir</p>
                            </button>
                            <button class="cursosEditar" onclick="redirecionarEditarCurso(${meusCursos["resultados"][x]["id"]})" id="${meusCursos["resultados"][x]["id"]}">
                                <img src="../../public/assets/Imagens/Icone-editar-branco.svg" alt="Editar">
                            </button>
                            <button class="cursosDeletar" onclick="deletarCurso(${meusCursos["resultados"][x]["id"]})" id="${meusCursos["resultados"][x]["id"]}">
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
function abrirCurso(idCurso) {
    window.location.href += `/${idCurso}`;
}

function redirecionarEditarCurso(idCurso) {
    window.location.href += `/editar/${idCurso}`;
}