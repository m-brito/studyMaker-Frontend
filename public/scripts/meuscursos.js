async function iniciarMeuscursos() {
    var token = buscarToken();
    await verificarLogado(token);

    await mostrarCursos(token);

    document.querySelector("#meuscursosPrincipal #bttCadastrarNovoCurso").addEventListener("click", (event) => {
        document.querySelector("#meuscursosCadastrar").style.display = "flex";
        window.scrollTo(0, 0);
        // document.querySelector("html").style.overflow = "hidden";
    });

    document.querySelector("#meuscursosCadastrar form").addEventListener("submit", async (event) => {
        event.preventDefault();
        return;
    })

    document.querySelector("#meuscursosEditar form").addEventListener("submit", async (event) => {
        event.preventDefault();
        return;
    })

    document.querySelector("#meuscursosExcluir form").addEventListener("submit", async (event) => {
        event.preventDefault();
        return;
    })

    document.querySelector("#meuscursosCadastrar .meuscursosCadastrarAcoes #cancelar").addEventListener("click", async () => {
        setTimeout(() => {
            document.querySelector("#meuscursosCadastrar").style.display = "none";
            document.querySelector("#meuscursosCadastrar input").value = "";
            document.querySelector("#meuscursosCadastrar textarea").value = "";
            document.querySelector("html").style.overflow = "auto";
        }, 1)
    })

    document.querySelector("#meuscursosEditar .meuscursosEditarAcoes #cancelar").addEventListener("click", async () => {
        setTimeout(() => {
            document.querySelector("#meuscursosEditar").style.display = "none";
            document.querySelector("#meuscursosEditar input").value = "";
            document.querySelector("#meuscursosEditar textarea").value = "";
            document.querySelector("html").style.overflow = "auto";
        }, 1)
    })

    document.querySelector("#meuscursosExcluir .meuscursosExcluirAcoes #cancelar").addEventListener("click", async () => {
        setTimeout(() => {
            document.querySelector("#meuscursosExcluir").style.display = "none";
            document.querySelector("html").style.overflow = "auto";
        }, 1)
    })

    document.querySelector("#meuscursosCadastrar .meuscursosCadastrarAcoes #cadastrar").addEventListener("click", async () => {
        setTimeout(async () => {
            var nome = document.querySelector("#meuscursosCadastrar input").value;
            var descricao = document.querySelector("#meuscursosCadastrar textarea").value;
            const respCadastrarCurso = await cadastrarCurso(token, nome, descricao);
            if(respCadastrarCurso["status"] && respCadastrarCurso["status"] == sucessoRequisicao) {
                mostrarMensagem("Curso cadastrado com sucesso");
                setTimeout(() => {
                    mostrarCursos(token);
                    document.querySelector("#meuscursosCadastrar").style.display = "none";
                    document.querySelector("#meuscursosCadastrar input").value = "";
                    document.querySelector("#meuscursosCadastrar textarea").value = "";
                    document.querySelector("html").style.overflow = "auto";
                }, 3000)
            }
        }, 1)
    })

    document.querySelector("#meuscursosEditar .meuscursosEditarAcoes #editar").addEventListener("click", async () => {
        setTimeout(async () => {
            var nome = document.querySelector("#meuscursosEditar input").value;
            var descricao = document.querySelector("#meuscursosEditar textarea").value;
            var idCurso = document.querySelector("#meuscursosEditar input[name=idCurso]").value;
            const respCadastrarCurso = await editarCurso(token, nome, descricao, idCurso);
            if(respCadastrarCurso["status"] && respCadastrarCurso["status"] == sucessoRequisicao) {
                mostrarMensagem("Curso editado com sucesso");
                setTimeout(() => {
                    mostrarCursos(token);
                    document.querySelector("#meuscursosEditar").style.display = "none";
                    document.querySelector("#meuscursosEditar input").value = "";
                    document.querySelector("#meuscursosEditar textarea").value = "";
                    document.querySelector("html").style.overflow = "auto";
                }, 3000)
            }
        }, 1)
    })
}

async function cadastrarCurso(token, nome, descricao) {
    carregamento();
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/curso/cadastrarCurso.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "token": token,
                    "nome": nome,
                    "descricao": descricao
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

async function excluirCurso(token, idCurso) {
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
                    "token": token,
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

async function deletarCurso(token, idCurso) {
    const respExcluirCurso = await excluirCurso(token, idCurso);
    if(respExcluirCurso["status"] && respExcluirCurso["status"] == sucessoRequisicao) {
        mostrarMensagem("Curso excluido com sucesso");
        setTimeout(() => {
            document.querySelector("#meuscursosExcluir").style.display = "none";
            document.querySelector("html").style.overflow = "auto";
            mostrarCursos(token);
        }, 3000)
    }
}

async function popupDeletarCurso(idCurso) {
    token = buscarToken();
    document.querySelector("#meuscursosExcluir").style.display = "flex";
    document.querySelector("#meuscursosExcluir .meuscursosExcluirAcoes button#excluir").onclick = () => {deletarCurso(token, idCurso)};
    window.scrollTo(0, 0);
    // document.querySelector("html").style.overflow = "hidden";
}

async function buscarCurso(token, idCurso) {
    carregamento();
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/curso/dadosCursoId.php?id=${idCurso}&token=${token}`, {
                "method": "GET",
                headers: {
                    'Accept': 'application/json',
                }
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
                            <button class="meuscursosEditar" onclick="popupEditarCurso(${meusCursos["resultados"][x]["id"]})" id="${meusCursos["resultados"][x]["id"]}">
                                <img src="../../public/assets/Imagens/Icone-editar-branco.svg" alt="Editar">
                            </button>
                            <button class="meuscursosDeletar" onclick="popupDeletarCurso(${meusCursos["resultados"][x]["id"]})" id="${meusCursos["resultados"][x]["id"]}">
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

async function editarCurso(token, nome, descricao, idCurso) {
    carregamento();
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/curso/editarCurso.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "token": token,
                    "id": idCurso,
                    "nome": nome,
                    "descricao": descricao
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

async function ocultarDesoCurso(idCurso) {
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

async function popupEditarCurso(idCurso) {
    const token = buscarToken();
    const respCurso = await buscarCurso(token, idCurso);
    if(respCurso["status"] && respCurso["status"] == sucessoRequisicao) {
        document.querySelector("#meuscursosEditar input").value = respCurso["resultados"][0]["nome"];
        document.querySelector("#meuscursosEditar textarea").value = respCurso["resultados"][0]["descricao"];
        document.querySelector("#meuscursosEditar input[name=idCurso]").value = respCurso["resultados"][0]["id"];
        document.querySelector("#meuscursosEditar").style.display = "flex";
        window.scrollTo(0, 0);
    }
}

async function editarOculto(idCurso, acao) {
    const respEditaCurso = await ocultarDesoCurso(idCurso);
    if(respEditaCurso["status"] && respEditaCurso["status"] == sucessoRequisicao) {
        mostrarMensagem("Seu curso foi "+acao+" com sucesso!")
        setTimeout(() => {
            mostrarCursos(buscarToken())
        }, 3000)
    }
}

function abrirCurso(idCurso) {
    window.location.href += `/${idCurso}`;
}