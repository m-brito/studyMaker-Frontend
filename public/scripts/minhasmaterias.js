async function iniciarMinhasMaterias(parametros) {
    await mostrarMaterias(parametros["idCurso"]);
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
    const respMaterias = await buscarMaterias(idCurso);
    let divMaterias = document.querySelector("#minhasmateriasPrincipal #minhasmateriasConteudo");
    if(respMaterias["status"] && respMaterias["status"] == sucessoRequisicao) {
        divMaterias = "";
        for(let x=0; x<respMaterias["resultados"].length; x++) {
            let cartaoMateria = `
                <div class="minhasmateriasCartao" id="${minhasmaterias["resultados"][x]["id"]}">
                    <div class="minhasmateriastao" style="background-color: ${minhasmaterias["resultados"][x]["cor"]} !important">
                        <img src="${minhasmaterias["resultados"][x]["imagem"]}" alt="${minhasmaterias["resultados"][x]["nome"][0]}">
                    </div>
                    <div class="minhasmateriasConteudoCartao">
                        <h2 class="minhasmateriasNomeCartao">${minhasmaterias["resultados"][x]["nome"]}</h2>
                        <div class="minhasmateriasEstados">
                            <img src="${minhasmaterias["resultados"][x]["publico"] == "true" ? '../../public/assets/Imagens/Icone-publico.svg' : '../../public/assets/Imagens/Icone-privado.svg'}" alt="Materia ${meusCursos["resultados"][x]["privado"] == "true" ? 'privado' : 'publico'}">
                            <img onclick="editarOculto(${minhasmaterias["resultados"][x]["id"]}, '${minhasmaterias["resultados"][x]["oculto"] == "true" ? 'exposto' : 'ocultado'}')" src="${minhasmaterias["resultados"][x]["oculto"] == "true" ? '../../public/assets/Imagens/Icone-oculto.svg' : '../../public/assets/Imagens/Icone-exposto.svg'}" alt="Materia ${minhasmaterias["resultados"][x]["oculto"] == true ? 'oculto' : 'exposto'}">
                        </div>
                        <div class="minhasmateriasCartaoOpcoes">
                            <button class="minhasmateriasAbrir">
                                <p id="${minhasmaterias["resultados"][x]["id"]}" onclick="abrirMateria(${minhasmaterias["resultados"][x]["id"]})">Abrir</p>
                            </button>
                            <button class="minhasmateriasEditar" onclick="editarMateria(${minhasmaterias["resultados"][x]["id"]})" id="${minhasmaterias["resultados"][x]["id"]}">
                                <img src="../../public/assets/Imagens/Icone-editar-branco.svg" alt="Editar">
                            </button>
                            <button class="minhasmateriasDeletar" onclick="deletarMateria(${minhasmaterias["resultados"][x]["id"]})" id="${minhasmaterias["resultados"][x]["id"]}">
                                <img src="../../public/assets/Imagens/Icone-deletar.svg" alt="Deletar">
                            </button>
                        </div>
                    </div>
                </div>
            `;
            divMaterias.innerHTML += cartaoMateria;
        }
    } else {
        divMaterias.innerHTML = `<p style='text-align: center; font-size: 20px;'>${respMaterias["mensagem"]}</p>`;
    }
    pararCarregamento();
}