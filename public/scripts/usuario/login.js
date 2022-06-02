window.onload = () => {
    // Enviar requisicao de cadastro do usuario
    document.querySelector("form").addEventListener("submit", async (event) => {
        event.preventDefault();
        carregamento();
        try {
            const data = await login(document.querySelector("#email").value, document.querySelector("#senha").value);
            pararCarregamento();
            if(data.status == erroRequisicao) {
                mensagemPopUp.show({
                    mensagem: data.mensagem,
                    cor: "red"
                });
            } else {
                localStorage.setItem("tkn", data.resultados.token);
                const respDadosUsuario = await buscarUsuario();
                if(respDadosUsuario.status == sucessoRequisicao && respDadosUsuario.resultados.tipoUsuario == "Aluno") {
                    window.location.href = "../../aluno.html";
                } else if(respDadosUsuario.status == sucessoRequisicao && respDadosUsuario.resultados.tipoUsuario == "Administrador") {
                    window.location.href = "../../administrador.html";
                }

            }
            if(data.status == erroRequisicao) {
                mensagemPopUp.show({
                    mensagem: data.mensagem,
                    cor: "red"
                });
                setTimeout(() => {
                    window.location.reload();
                }, 4000);
            }
        } catch (error) {
            pararCarregamento();
            mensagemPopUp.show({
                mensagem: "Tivemos problemas com o servidor! <br> Tente realizar o login",
                cor: "red"
            });
        }
    })
}