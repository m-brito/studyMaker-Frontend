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

