async function iniciarMinhasMaterias(parametros) {
    await mostrarMaterias(parametros["idCurso"]);

    document.querySelector("#voltarPagina").addEventListener("click", () => {
        voltarPagina();
    });

    document.querySelector("#bttCadastrarNovoCurso").addEventListener("click", () => {
        window.location.href += "/materia/cadastrar";
    })
}

async function buscarMaterias(idCurso) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/materia/dadosMinhasMateriaCurso.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "idCurso": idCurso
                })
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    return data;
}

async function mostrarMaterias(idCurso) {
    carregamento();
    let respMaterias = await buscarMaterias(idCurso);
    if(respMaterias["status"] && respMaterias["status"] == sucessoRequisicao) {
        document.querySelector("#minhasmateriasPrincipal #minhasmateriasConteudo").innerHTML = "";
        for(let x=0; x<respMaterias["resultados"].length; x++) {
            let cartaoMateria = `
                <div class="minhasmateriasCartao" id="${respMaterias["resultados"][x]["id"]}">
                    <div class="minhasmateriasImagemCartao" style="background-color: ${respMaterias["resultados"][x]["cor"]} !important">
                        <img src="${respMaterias["resultados"][x]["imagem"]}" alt="${respMaterias["resultados"][x]["nome"][0]}">
                    </div>
                    <div class="minhasmateriasConteudoCartao">
                        <h2 class="minhasmateriasNomeCartao">${respMaterias["resultados"][x]["nome"]}</h2>
                        <div class="minhasmateriasEstados">
                            <img src="${respMaterias["resultados"][x]["publico"] == "true" ? '../../public/assets/Imagens/Icone-publico.svg' : '../../public/assets/Imagens/Icone-privado.svg'}" alt="Materia ${respMaterias["resultados"][x]["privado"] == "true" ? 'privado' : 'publico'}">
                            <img onclick="editarOcultoMateria(${respMaterias["resultados"][x]["id"]}, '${respMaterias["resultados"][x]["oculto"] == "true" ? 'exposto' : 'ocultado'}')" src="${respMaterias["resultados"][x]["oculto"] == "true" ? '../../public/assets/Imagens/Icone-oculto.svg' : '../../public/assets/Imagens/Icone-exposto.svg'}" alt="Materia ${respMaterias["resultados"][x]["oculto"] == true ? 'oculto' : 'exposto'}">
                        </div>
                        <div class="minhasmateriasCartaoOpcoes">
                            <button class="minhasmateriasAbrir">
                                <p id="${respMaterias["resultados"][x]["id"]}" onclick="abrirMateria(${respMaterias["resultados"][x]["id"]})">Abrir</p>
                            </button>
                            <button class="minhasmateriasEditar" onclick="editarMateria(${respMaterias["resultados"][x]["id"]})" id="${respMaterias["resultados"][x]["id"]}">
                                <img src="../../public/assets/Imagens/Icone-editar-branco.svg" alt="Editar">
                            </button>
                            <button class="minhasmateriasDeletar" onclick="deletarMateria(${respMaterias["resultados"][x]["id"]})" id="${respMaterias["resultados"][x]["id"]}">
                                <img src="../../public/assets/Imagens/Icone-deletar.svg" alt="Deletar">
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.querySelector("#minhasmateriasPrincipal #minhasmateriasConteudo").innerHTML += cartaoMateria;
        }
    } else {
        document.querySelector("#minhasmateriasPrincipal #minhasmateriasConteudo").innerHTML = `<p style='text-align: center; font-size: 20px;'>${respMaterias["mensagem"]}</p>`;
    }
    pararCarregamento();
}