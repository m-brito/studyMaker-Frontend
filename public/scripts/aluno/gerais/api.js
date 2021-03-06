// ALUNO


// Usuario
// Cadastrar Usuario
async function cadastrarUsuario(img, nome, email, senha) {
    const dados = new FormData();
    dados.append("imagem", img)
    dados.append("nome", nome)
    dados.append("email", email)
    dados.append("senha", senha)

    const resp = await fetch(`${HOST}/usuario/cadastrarUsuario.php`, {
        "method": "POST",
        headers: {
            'Accept': 'application/json'
        },
        body: dados
    })

    const data = await resp.json();
    pararCarregamento();
    return data;
}

async function editarFotoUsuario(img) {
    var tentativas = 0;
    var ok = false
    if(img.value) {
        var img = img.files[0];
    } else {
        var img = "";
    }
    dados = new FormData();
    dados.append("imagem", img)
    dados.append("token", buscarToken())
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/usuario/editarFotoUsuario.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: dados,
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    return data;
}

async function editarUsuario(nome) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/usuario/editarUsuario.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "nome": nome,
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

// Buscar usuario
async function buscarUsuario() {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/usuario/dadosUsuario.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    "token": buscarToken(),
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

// CURSO
async function tornarCursoPublico(idCurso) {
    carregamento();
    var tentativas = 0;
    var ok = false;
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/curso/publicarCurso.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "id": idCurso,
                    "token": buscarToken()
                })
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    pararCarregamento();
    if(ok == true && data["status"] == erroRequisicao) {
        mensagemPopUp.show({
            mensagem: data["mensagem"],
            cor: "red"
        });
        voltarPagina();
    }
    return data;
}

async function buscarCurso(idCurso) {
    carregamento();
    var tentativas = 0;
    var ok = false;
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/curso/dadosCursoId.php?id=${idCurso}&token=${buscarToken()}`, {
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
    if(ok == true && data["status"] == erroRequisicao) {
        mensagemPopUp.show({
            mensagem: data["mensagem"],
            cor: "red"
        });
        voltarPagina();
    }
    return data;
}

async function cadastrarCurso(nome, descricao) {
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
                    "token": buscarToken(),
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

async function editarCurso(nome, descricao, idCurso) {
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
                    "token": buscarToken(),
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

async function buscarMeusCursos() {
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
                    "token": buscarToken()
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

async function buscarCursosPublicos() {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/curso/dadosCursosPublico.php?token=${buscarToken()}`, {
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
                    "token": buscarToken(),
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

// MATERIA
async function editarMateria(idMateria, idCurso, nome, descricao) {
    carregamento();
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/materia/editarMateria.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "id": idMateria,
                    "idCurso": idCurso,
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

async function tornarMateriaPublico(idCurso, idMateria) {
    carregamento();
    var tentativas = 0;
    var ok = false;
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/materia/publicarMateria.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "id": idMateria,
                    "idCurso": idCurso,
                    "token": buscarToken()
                })
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    pararCarregamento();
    if(ok == true && data["status"] == erroRequisicao) {
        mensagemPopUp.show({
            mensagem: data["mensagem"],
            cor: "red"
        });
        voltarPagina();
    }
    return data;
}

async function buscarMateria(idMateria, idCurso) {
    carregamento();
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/materia/dadosMateriaId.php?id=${idMateria}&idCurso=${idCurso}&token=${buscarToken()}`, {
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
    if(ok == true && data["status"] == erroRequisicao) {
        mensagemPopUp.show({
            mensagem: data["mensagem"],
            cor: "red"
        });
        voltarPagina();
    }
    return data;
}

async function cadastrarMateria(nome, descricao, idCurso) {
    carregamento();
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/materia/cadastrarMateria.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "nome": nome,
                    "descricao": descricao,
                    "idCurso": idCurso
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

async function apiBuscarMaterias(idCurso) {
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
                    "idCurso": idCurso,
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

async function apiBuscarMateriasPublicas(idCurso) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/materia/dadosMateriasPublico.php?token=${buscarToken()}&idCurso=${idCurso}`, {
                "method": "POST",
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
    return data;
}

async function apiOcultarMateria(idMateria, idCurso) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/materia/ocultarMateria.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "id": idMateria,
                    "idCurso": idCurso,
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

async function apiDeletarMateria(idMateria, idCurso) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/materia/deletarMateria.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "id": idMateria,
                    "idCurso": idCurso,
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

// QUESTIONARIO
async function cadastrarQuestionario(nome, descricao, idMateria, idCurso, perguntas) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/questionario/cadastrarQuestionario`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "nome": nome,
                    "descricao": descricao,
                    "idMateria": idMateria,
                    "idCurso": idCurso,
                    "perguntas": perguntas
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

async function tornarQuestionarioPublico(idQuestionario) {
    carregamento();
    var tentativas = 0;
    var ok = false;
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/questionario/publicarQuestionario.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "id": idQuestionario,
                    "token": buscarToken()
                })
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    pararCarregamento();
    if(ok == true && data["status"] == erroRequisicao) {
        mensagemPopUp.show({
            mensagem: data["mensagem"],
            cor: "red"
        });
        voltarPagina();
    }
    return data;
}

async function buscarMeusQuestionarios(idMateria, idCurso) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/questionario/dadosMeusQuestionarioMateria.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "idMateria": idMateria,
                    "idCurso": idCurso,
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

async function buscarQuestionariosPublicos(idMateria, idCurso) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/questionario/dadosQuestionariosPublico.php?token=${buscarToken()}&idMateria=${idMateria}&idCurso=${idCurso}`, {
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
    return data;
}

async function apiDeletarQuestionario(idQuestionario) {
    carregamento();
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/questionario/deletarQuestionario.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "id": idQuestionario
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

async function ocultarDesocultarQuestionario(idQuestionario) {
    carregamento();
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/questionario/ocultarQuestionario.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "id": idQuestionario
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

async function deletarPerguntaAPI(idPergunta) {
    carregamento();
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/pergunta/deletarPergunta.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "id": idPergunta,
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

async function cadastrarPerguntaAPI(pergunta, idQuestionario) {
    carregamento();
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/pergunta/cadastrarPergunta`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "texto": pergunta["texto"],
                    "idQuestionario": idQuestionario,
                    "resposta": pergunta["resposta"],
                    "alternativas": pergunta["alternativas"],
                })
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    pararCarregamento();
    if(data["status"] && data["status"] == sucessoRequisicao) {
        mensagemPopUp.show({
            mensagem: "Pergunta cadastrada com sucesso!",
            cor: "green"
        });
        await mostrarQuestionario();
    } else {
        mensagemPopUp.show({
            mensagem: data["mensagem"],
            cor: "red"
        });
        await mostrarQuestionario();
    }
    return data;
}

async function editarPerguntaAPI(pergunta, idQuestionario) {
    carregamento();
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/pergunta/editarPergunta.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "id": pergunta["idPergunta"],
                    "idQuestionario": idQuestionario,
                    "texto": pergunta["texto"],
                    "resposta": pergunta["resposta"],
                    "alternativas": pergunta["alternativas"],
                })
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    pararCarregamento();
    if(data["status"] && data["status"] == sucessoRequisicao) {
        mensagemPopUp.show({
            mensagem: "Pergunta editada com sucesso!",
            cor: "green"
        });
        await mostrarQuestionario();
    } else {
        mensagemPopUp.show({
            mensagem: data["mensagem"],
            cor: "red"
        });
        await mostrarQuestionario();
    }
    return data;
}

async function buscarQuestionarioCompletoAPI(id) {
    carregamento();
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/questionario/dadosQuestionarioCompleto?id=${id}&token=${buscarToken()}`, {
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

async function editarQuestionarioAPI(nome, descricao, id) {
    carregamento();
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/questionario/editarQuestionario.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "nome": nome,
                    "descricao": descricao,
                    "id": id,
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

async function resultadoQuestionario(perguntasQuest, perguntasUsuario, idQuestionario) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/questionario/resultadoQuestionario.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "perguntasQuest": perguntasQuest,
                    "perguntasUsuario": perguntasUsuario,
                    "idQuestionario": idQuestionario,
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

// Historico

async function resultadoHistorico(idResponde) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/historico/buscarHistoricoQuestionario.php?idResponde=${idResponde}&token=${buscarToken()}`, {
                "method": "GET",
                headers: {
                    'Accept': 'application/json'
                },
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    return data;
}

async function resultadoHistoricoIdQuestionario(idQuestionario) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/historico/buscarHistoricoIdQuestionario.php?idQuestionario=${idQuestionario}&token=${buscarToken()}`, {
                "method": "GET",
                headers: {
                    'Accept': 'application/json'
                },
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    return data;
}

// verificar disponibilidade de email
async function disponibilidadeEmail(email) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/usuario/verificarEmail.php?email=${email}`, {
                "method": "GET",
                headers: {
                    'Accept': 'application/json'
                }
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    return data;
}

// Requisicoes
async function avaliarRequisicaoCurso(idTornarPublico, mensagemAvaliacao, status) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/requisicoes/avaliarRequisicaoCurso.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "mensagemAvaliacao": mensagemAvaliacao,
                    "idTornarPublico": idTornarPublico,
                    "status": status,
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

async function avaliarRequisicaoMateria(idTornarPublico, mensagemAvaliacao, status) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/requisicoes/avaliarRequisicaoMateria.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "mensagemAvaliacao": mensagemAvaliacao,
                    "idTornarPublico": idTornarPublico,
                    "status": status,
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

async function avaliarRequisicaoQuestionario(idTornarPublico, mensagemAvaliacao, status) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/requisicoes/avaliarRequisicaoQuestionario.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "mensagemAvaliacao": mensagemAvaliacao,
                    "idTornarPublico": idTornarPublico,
                    "status": status,
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

async function cadastrarRequisicaoCurso(idCurso) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/requisicoes/cadastrarRequisicaoCurso.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "idCurso": idCurso,
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

async function cadastrarRequisicaoMateria(idMateria) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/requisicoes/cadastrarRequisicaoMateria.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "idMateria": idMateria,
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

async function cadastrarRequisicaoQuestionario(idQuestionario) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/requisicoes/cadastrarRequisicaoQuestionario.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "token": buscarToken(),
                    "idQuestionario": idQuestionario,
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

async function resultadoRequisicoes() {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/requisicoes/dadosRequisicoes.php?token=${buscarToken()}`, {
                "method": "GET",
                headers: {
                    'Accept': 'application/json'
                }
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    return data;
}

async function resultadoRequisicoesAluno() {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/requisicoes/dadosRequisicoesAluno.php?token=${buscarToken()}`, {
                "method": "GET",
                headers: {
                    'Accept': 'application/json'
                }
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    return data;
}

async function resultadoRequisicoesCursoId(idCurso) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/requisicoes/dadosRequisicoesCursosAlunoIdCurso.php?token=${buscarToken()}&idCurso=${idCurso}`, {
                "method": "GET",
                headers: {
                    'Accept': 'application/json'
                }
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    return data;
}

async function resultadoRequisicoesMateriaId(idMateria) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/requisicoes/dadosRequisicoesMateriasAlunoIdMateria.php?token=${buscarToken()}&idMateria=${idMateria}`, {
                "method": "GET",
                headers: {
                    'Accept': 'application/json'
                }
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    return data;
}

async function resultadoRequisicoesQuestionarioId(idQuestionario) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/requisicoes/dadosRequisicoesQuestionariosAlunoIdQuestionario.php?token=${buscarToken()}&idQuestionario=${idQuestionario}`, {
                "method": "GET",
                headers: {
                    'Accept': 'application/json'
                }
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    return data;
}

async function resultadoRequisicoesCursosAluno(idAluno) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/requisicoes/dadosRequisicoesCursosAluno.php?token=${buscarToken()}&idAluno=${idAluno}`, {
                "method": "GET",
                headers: {
                    'Accept': 'application/json'
                }
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    return data;
}

async function resultadoRequisicoesMateriasAluno(idAluno) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/requisicoes/dadosRequisicoesMateriasAluno.php?token=${buscarToken()}&idAluno=${idAluno}`, {
                "method": "GET",
                headers: {
                    'Accept': 'application/json'
                }
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    return data;
}

async function resultadoRequisicoesQuestionariosAluno(idAluno) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/requisicoes/dadosRequisicoesQuestionariosAluno.php?token=${buscarToken()}&idAluno=${idAluno}`, {
                "method": "GET",
                headers: {
                    'Accept': 'application/json'
                }
            })
            var data = await resp.json();
            ok = true;
        } catch (error) {
            tentativas++;
        }
    }
    return data;
}

// Deslogar do site
async function deslogar(tokenAluno) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/usuario/sair.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    "token": tokenAluno
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

// Login
async function login(email, senha) {
    var tentativas = 0;
    var ok = false
    while(tentativas <= 4 && ok == false) {
        try {
            const resp = await fetch(`${HOST}/usuario/login.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "email": email,
                    "senha": senha,
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

