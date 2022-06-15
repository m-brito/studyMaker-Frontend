var parametrosJson;
async function iniciarMinhasMaterias(parametros) {
    await verificarLogado(buscarToken());
    parametrosJson = parametros;

    await mostrarMaterias();

    document.querySelector("#voltarPagina").addEventListener("click", () => {
        voltarPagina();
    });

    document.querySelector("#bttCadastrarNovoCurso").addEventListener("click", () => {
        window.location.href += "/materia/cadastrar";
    })
}

async function editarOcultoMateria(idMateria, acao) {
    carregamento();
    const respOcultarMateria = await apiOcultarMateria(idMateria, parametrosJson["idCurso"]);
    if(respOcultarMateria["status"] && respOcultarMateria["status"] == sucessoRequisicao) {
        mensagemPopUp.show({
            mensagem: "Sua materia foi "+acao+" com sucesso!",
            cor: "green"
        });
    }
    mostrarMaterias();
    pararCarregamento();
}

async function deletarMateria(idMateria) {
    Confirm.open({
        mensagem: "Tem certeza que deseja exluir esta materia?",
        textoOK: "Sim",
        textoCancelar: "Cancelar",
        onok: async () => {
            const respDeletar = await apiDeletarMateria(idMateria, parametrosJson["idCurso"]);
            if(respDeletar["status"] && respDeletar["status"] == sucessoRequisicao) {
                mensagemPopUp.show({
                    mensagem: "Sua materia foi excluida com sucesso!",
                    cor: "green"
                });
                mostrarMaterias(buscarToken())
            }
        }
    })
}

async function mostrarMaterias() {
    carregamento();
    let respMaterias = await apiBuscarMaterias(parametrosJson["idCurso"]);
    if(respMaterias["status"] && respMaterias["status"] == sucessoRequisicao) {
        // document.querySelector("#minhasmateriasPrincipal #minhasmateriasFerramentas #caminho").innerHTML = `<a href="./aluno.html#/meuscursos"><p>${respMaterias["resultados"][0]["nomeCurso"]}</p></a>`;
        document.querySelector("#materiasPrincipal #materiasConteudo").innerHTML = "";
        for(let x=0; x<respMaterias["resultados"].length; x++) {
            let cartaoMateria = `
                <div class="materiasCartao" id="${respMaterias["resultados"][x]["id"]}">
                    <div class="materiasImagemCartao" style="background-color: ${respMaterias["resultados"][x]["cor"]} !important">
                        <img src="${respMaterias["resultados"][x]["imagem"]}" alt="${respMaterias["resultados"][x]["nome"][0]}">
                    </div>
                    <div class="materiasConteudoCartao">
                        <h2 class="materiasNomeCartao">${respMaterias["resultados"][x]["nome"]}</h2>
                        <div class="materiasEstados">
                            <img src="${respMaterias["resultados"][x]["publico"] == "true" ? '../../public/assets/Imagens/Icone-publico.svg' : '../../public/assets/Imagens/Icone-privado.svg'}" alt="Materia ${respMaterias["resultados"][x]["privado"] == "true" ? 'privado' : 'publico'}">
                            <img onclick="editarOcultoMateria(${respMaterias["resultados"][x]["id"]}, '${respMaterias["resultados"][x]["oculto"] == "true" ? 'exposta' : 'ocultado'}')" src="${respMaterias["resultados"][x]["oculto"] == "true" ? '../../public/assets/Imagens/Icone-oculto.svg' : '../../public/assets/Imagens/Icone-exposto.svg'}" alt="Materia ${respMaterias["resultados"][x]["oculto"] == true ? 'oculto' : 'exposto'}">
                        </div>
                        <div class="materiasCartaoOpcoes">
                            <button class="materiasAbrir" onclick="redirecionarAbrirMateria(${respMaterias["resultados"][x]["id"]})">
                                <p id="${respMaterias["resultados"][x]["id"]}">Abrir</p>
                            </button>
                            <button class="materiasEditar" onclick="redirecionarEditarMateria(${respMaterias["resultados"][x]["id"]})" id="${respMaterias["resultados"][x]["id"]}">
                                <img src="../../public/assets/Imagens/Icone-editar-branco.svg" alt="Editar">
                            </button>
                            <button class="materiasDeletar" onclick="deletarMateria(${respMaterias["resultados"][x]["id"]})" id="${respMaterias["resultados"][x]["id"]}">
                                <img src="../../public/assets/Imagens/Icone-deletar.svg" alt="Deletar">
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.querySelector("#materiasPrincipal #materiasConteudo").innerHTML += cartaoMateria;
        }
    } else {
        document.querySelector("#materiasPrincipal #materiasConteudo").innerHTML = `<p style='text-align: center; font-size: 20px;'>${respMaterias["mensagem"]}</p>`;
    }
    pararCarregamento();
}

// Redirecionamentos
function redirecionarEditarMateria(idMateria) {
    window.location.href = `./aluno.html#/aluno/meuscursos/${parametrosJson["idCurso"]}/materia/editar/${idMateria}`;
}

function redirecionarAbrirMateria(idMateria) {
    window.location.href = `./aluno.html#/aluno/meuscursos/${parametrosJson["idCurso"]}/materia/${idMateria}`;
}