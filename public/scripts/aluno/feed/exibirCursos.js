async function iniciarFeedCursos() {
    await verificarLogado(buscarToken());
    await mostrarCursosFeed(buscarToken());
}

async function mostrarCursosFeed(token) {
    carregamento();
    
    let divCartoes = document.querySelector("#cursosPrincipal #cursosConteudo");
    divCartoes.innerHTML = "";

    const meusCursos = await buscarCursosPublicos(token);
    
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
                            ${meusCursos["resultados"][x]["permissao"] ? `
                                <img src="${meusCursos["resultados"][x]["publico"] == "true" ? '../../public/assets/Imagens/Icone-publico.svg' : '../../public/assets/Imagens/Icone-privado.svg'}" alt="Curso ${meusCursos["resultados"][x]["privado"] == "true" ? 'privado' : 'publico'}">
                                <img onclick="editarOculto(${meusCursos["resultados"][x]["id"]}, '${meusCursos["resultados"][x]["oculto"] == "true" ? 'exposto' : 'ocultado'}')" src="${meusCursos["resultados"][x]["oculto"] == "true" ? '../../public/assets/Imagens/Icone-oculto.svg' : '../../public/assets/Imagens/Icone-exposto.svg'}" alt="Curso ${meusCursos["resultados"][x]["oculto"] == true ? 'oculto' : 'exposto'}">
                            `: `
                                <div>
                                    <img src="../../public/assets/Imagens/Icone-autor.svg" alt="Autor">
                                    <p>${meusCursos["resultados"][x]["nomeAutor"]}</p>
                                </div>
                            `}
                            
                        </div>
                        <div class="cursosCartaoOpcoes">
                            ${meusCursos["resultados"][x]["permissao"] ? `
                                <button class="cursosAbrir" onclick="abrirCurso(${meusCursos["resultados"][x]["id"]})">
                                    <p id="${meusCursos["resultados"][x]["id"]}">Abrir</p>
                                </button>
                                <button class="cursosEditar" onclick="redirecionarEditarCurso(${meusCursos["resultados"][x]["id"]})" id="${meusCursos["resultados"][x]["id"]}">
                                    <img src="../../public/assets/Imagens/Icone-editar-branco.svg" alt="Editar">
                                </button>
                                <button class="cursosDeletar" onclick="deletarCurso(${meusCursos["resultados"][x]["id"]})" id="${meusCursos["resultados"][x]["id"]}">
                                    <img src="../../public/assets/Imagens/Icone-deletar.svg" alt="Deletar">
                                </button>
                            ` : `
                                <button class="cursosAbrir" onclick="abrirCurso(${meusCursos["resultados"][x]["id"]})">
                                    <p id="${meusCursos["resultados"][x]["id"]}">Abrir</p>
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
function abrirCurso(idCurso) {
    window.location.href += `/${idCurso}`;
}