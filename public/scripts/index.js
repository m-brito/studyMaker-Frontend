window.onload = async () => {
    tkn = localStorage.getItem("tkn");

    if(tkn) {
        const respDadosUsuario = await buscarUsuario(tkn);
        console.log(respDadosUsuario)
        if(respDadosUsuario.status == sucessoRequisicao && respDadosUsuario.resultados.tipoUsuario == "Aluno") {
            window.location.href = "./src/views/aluno.html";
        } else if(respDadosUsuario.status == sucessoRequisicao && respDadosUsuario.resultados.tipoUsuario == "Administrador") {
            window.location.href = "./src/views/administrador.html";
        }
    }
}