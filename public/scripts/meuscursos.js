async function iniciarMeuscursos() {
    await verificarLogado(buscarToken());
    await mostrarCursos(buscarToken());

    document.querySelector("#meuscursosPrincipal #bttCadastrarNovoCurso").addEventListener("click", (event) => {
        window.location.href += "/cadastrar"
    });

    // document.querySelector("#meuscursosExcluir form").addEventListener("submit", async (event) => {
    //     event.preventDefault();
    //     return;
    // })

    // document.querySelector("#meuscursosExcluir .meuscursosExcluirAcoes #cancelar").addEventListener("click", async () => {
    //     setTimeout(() => {
    //         document.querySelector("#meuscursosExcluir").style.display = "none";
    //         document.querySelector("html").style.overflow = "auto";
    //     }, 1)
    // })
}

async function deletarCurso(idCurso) {
    Confirm.open({
        mensagem: "Tem certeza que deseja exluir este curso?",
        textoOK: "Sim",
        textoCancelar: "Cancelar",
        onok: async () => {
            const respExcluirCurso = await apiDeletarCurso(idCurso);
            if(respExcluirCurso["status"] && respExcluirCurso["status"] == sucessoRequisicao) {
                mostrarMensagem("Curso excluido com sucesso");
                setTimeout(() => {
                    mostrarCursos(buscarToken());
                }, 3000)
            }
        }
    })
}

async function editarOculto(idCurso, acao) {
    const respEditaCurso = await ocultarDesocultarCurso(idCurso);
    if(respEditaCurso["status"] && respEditaCurso["status"] == sucessoRequisicao) {
        mostrarMensagem("Seu curso foi "+acao+" com sucesso!")
        setTimeout(() => {
            mostrarCursos(buscarToken())
        }, 3000)
    }
}

async function mostrarCursos(token) {
    carregamento();
    
    let divCartoes = document.querySelector("#meuscursosPrincipal #meuscursosConteudo");
    divCartoes.innerHTML = "";

    const meusCursos = await buscarMeusCursos(token);
    
    if(meusCursos["status"] && meusCursos["status"] == erroRequisicao) {
        divCartoes.innerHTML = `<p style='text-align: center; font-size: 20px;'>${meusCursos.mensagem}</p>`;
    } else {
        for(let x = 0; x<meusCursos["resultados"].length; x++) {
            let divCartao = `
                <div class="meuscursosCartao" id="${meusCursos["resultados"][x]["id"]}">
                    <div class="meuscursosImagemCartao" style="background-color: ${meusCursos["resultados"][x]["cor"]} !important">
                        <img src="${meusCursos["resultados"][x]["imagem"]}" alt="Letra ${meusCursos["resultados"][x]["nome"][0]}">
                    </div>
                    <div class="meuscursosConteudoCartao">
                        <h2 class="meuscursosNomeCartao">${meusCursos["resultados"][x]["nome"]}</h2>
                        <div class="meuscursosEstados">
                            <img src="${meusCursos["resultados"][x]["publico"] == "true" ? '../../public/assets/Imagens/Icone-publico.svg' : '../../public/assets/Imagens/Icone-privado.svg'}" alt="Curso ${meusCursos["resultados"][x]["privado"] == "true" ? 'privado' : 'publico'}">
                            <img onclick="editarOculto(${meusCursos["resultados"][x]["id"]}, '${meusCursos["resultados"][x]["oculto"] == "true" ? 'exposto' : 'ocultado'}')" src="${meusCursos["resultados"][x]["oculto"] == "true" ? '../../public/assets/Imagens/Icone-oculto.svg' : '../../public/assets/Imagens/Icone-exposto.svg'}" alt="Curso ${meusCursos["resultados"][x]["oculto"] == true ? 'oculto' : 'exposto'}">
                        </div>
                        <div class="meuscursosCartaoOpcoes">
                            <button class="meuscursosAbrir" onclick="abrirCurso(${meusCursos["resultados"][x]["id"]})">
                                <p id="${meusCursos["resultados"][x]["id"]}">Abrir</p>
                            </button>
                            <button class="meuscursosEditar" onclick="redirecionarEditarCurso(${meusCursos["resultados"][x]["id"]})" id="${meusCursos["resultados"][x]["id"]}">
                                <img src="../../public/assets/Imagens/Icone-editar-branco.svg" alt="Editar">
                            </button>
                            <button class="meuscursosDeletar" onclick="deletarCurso(${meusCursos["resultados"][x]["id"]})" id="${meusCursos["resultados"][x]["id"]}">
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

// APIs
async function buscarMeusCursos(token) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/curso/dadosCursosAluno.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "token": token
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

async function apiDeletarCurso(idCurso) {
    carregamento();
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/curso/deletarCurso.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "id": idCurso
                })
            });
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    pararCarregamento();
    return data;
}

async function ocultarDesocultarCurso(idCurso) {
    const token = buscarToken();
    carregamento();
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/curso/ocultarCurso.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    "token": token,
                    "id": idCurso
                })
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    pararCarregamento();
    return data;
}

// Redirecionamentos
function abrirCurso(idCurso) {
    window.location.href += `/${idCurso}`;
}

function redirecionarEditarCurso(idCurso) {
    window.location.href += `/editar/${idCurso}`;
}