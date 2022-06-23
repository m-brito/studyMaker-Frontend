async function iniciarPerfilUsuario() {
    await verificarLogadoAmbos(buscarToken());

    document.querySelector("div#principalPerfil #conteudo form").addEventListener("submit", (event) => {
        event.preventDefault();
    })

    await mostrarDadosPerfil();

    document.querySelector("#voltarPagina").addEventListener("click", () => {
        voltarPagina();
    });
}

async function mostrarDadosPerfil() {
    var respDadosUsuario = await buscarUsuario(buscarToken());
    if(respDadosUsuario["status"] && respDadosUsuario["status"]!=erroRequisicao) {
        document.querySelector("div#principalPerfil #conteudo #foto img").src = respDadosUsuario["resultados"]["foto"];
        document.querySelector("div#principalPerfil #conteudo .camposPerfil input#nomeCompletoPerfil").value = respDadosUsuario["resultados"]["nome"];
    }
}

function editarPeril() {
    document.querySelector("#principalPerfil #conteudo form #opcoes #opcoesEditando").style.display = "Flex";
    document.querySelector("#principalPerfil #conteudo form input").style.cursor = "Text";
    document.querySelector("#principalPerfil #conteudo form input").disabled = false;
    document.querySelector("#principalPerfil #conteudo form #opcoes #bttEditar").style.display = "None";
}

function cancelarEdicao() {
    document.querySelector("#principalPerfil #conteudo form #opcoes #opcoesEditando").style.display = "None";
    document.querySelector("#principalPerfil #conteudo form input").style.cursor = "Not-allowed";
    document.querySelector("#principalPerfil #conteudo form input").disabled = true;
    document.querySelector("#principalPerfil #conteudo form #opcoes #bttEditar").style.display = "Initial";
    mostrarDadosPerfil();
}

async function mostrarDadosSitePerfil() {
    const dados = await buscarUsuario(buscarToken());
    document.querySelector("#containerImgPerfil img").src = dados.resultados.foto;
    document.querySelector("#containerImgPerfil img").alt = "Imagem de perfil de "+dados.resultados.nome;
    if(dados.resultados.tipoUsuario == "Administrador") {
        document.querySelector("#nomeUsuario").innerHTML = dados.resultados.nome + "<strong style='color: #33ff00'>(ADM)<strong>";
    } else {
        document.querySelector("#nomeUsuario").innerHTML = dados.resultados.nome;
    }
}

async function confirmarEdicao() {
    const nomeCompletoPerfil = document.querySelector("#principalPerfil #conteudo form input").value;
    const respEditarUsuario = await editarUsuario(nomeCompletoPerfil);
    if(respEditarUsuario["status"] && respEditarUsuario["status"]!=erroRequisicao) {
        mensagemPopUp.show({
            mensagem: "Usuario editado com sucesso!",
            cor: "green"
        });
    } else {
        mensagemPopUp.show({
            mensagem: "Tivemos problemas ao editar usuario!",
            cor: "red"
        });
    }
    mostrarDadosPerfil();
    mostrarDadosSitePerfil();
}

async function editarFotoPeril() {
    const dados = await buscarUsuario(buscarToken());
    editarFotoPerfil.open({
        json: {
            "fotoUsuario" : dados["resultados"]["foto"]
        },
        onok: async (foto) => {
            const respEditarFoto = await editarFotoUsuario(foto)
            if(respEditarFoto["status"] && respEditarFoto["status"]!=erroRequisicao) {
                mensagemPopUp.show({
                    mensagem: "Foto de perfil editado com sucesso!",
                    cor: "green"
                });
            } else {
                mensagemPopUp.show({
                    mensagem: "Tivemos problemas ao editar usuario!",
                    cor: "red"
                });
            }
            mostrarDadosPerfil();
            mostrarDadosSitePerfil();
        }
    });
}