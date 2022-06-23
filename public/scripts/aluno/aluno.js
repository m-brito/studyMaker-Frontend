window.onload = async () => {
    // window.location.href = "../../src/views/aluno.html#/feed";

    var tkn = localStorage.getItem("tkn");

    if(tkn) {
        var respDadosUsuario = await buscarUsuario(tkn);
        if(respDadosUsuario.status == erroRequisicao && respDadosUsuario.mensagem == "Token expirado") {
            mostrarMensagem(respDadosUsuario.mensagem);
            setTimeout(() => {
                window.location.href = "../../index.html";
            }, 4000);
        } else if(respDadosUsuario.status == sucessoRequisicao && respDadosUsuario.resultados.tipoUsuario != "Aluno") {
            mostrarMensagem("Você não tem autorização para acessar esta pagina!")
            setTimeout(() => {
                window.location.href = "../../index.html";
            }, 4000);
        } else if(respDadosUsuario.status == erroRequisicao) {
            window.location.href = "../../index.html";
        } else if(respDadosUsuario.status == sucessoRequisicao && respDadosUsuario.resultados.tipoUsuario == "Aluno") {
            mostrarDados(respDadosUsuario);
        }
    } else {
        window.location.href = "../../index.html";
    }

    document.querySelector("#deslogar").addEventListener("click", async () => {
        respDeslogar = await deslogar(tkn);
        if(respDeslogar.status == sucessoRequisicao) {
            localStorage.removeItem("tkn");
            mostrarMensagem("Saindo...")
            setTimeout(() => {
                window.location.href = "../../index.html";
            }, 2000)
        }
    })

    document.querySelector("#containerImgPerfil img").addEventListener("click", () => {
        window.location.href = "./aluno.html#/aluno/perfil";
    })
}

function mostrarDados(dados) {
    document.querySelector("#containerImgPerfil img").src = dados.resultados.foto;
    document.querySelector("#containerImgPerfil img").alt = "Imagem de perfil de "+dados.resultados.nome;
    document.querySelector("#nomeUsuario").innerHTML = dados.resultados.nome;
}