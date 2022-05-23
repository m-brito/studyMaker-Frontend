window.onload = () => {
    // Enviar requisicao de cadastro do usuario
    document.querySelector("form").addEventListener("submit", async (event) => {
        event.preventDefault();
        carregamento();
        try {
            const resp = await fetch(`${HOST}/usuario/login.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    "email": document.querySelector("#email").value,
                    "senha": document.querySelector("#senha").value,
                })
            })
            const data = await resp.json();
            pararCarregamento();
            if(data.status == erroRequisicao) {
                mostrarMensagem(data.mensagem);
            } else {
                localStorage.setItem("tkn", data.resultados.token);
                const respDadosUsuario = await buscarUsuario(data.resultados.token);
                if(respDadosUsuario.status == sucessoRequisicao && respDadosUsuario.resultados.tipoUsuario == "Aluno") {
                    window.location.href = "./aluno.html";
                } else if(respDadosUsuario.status == sucessoRequisicao && respDadosUsuario.resultados.tipoUsuario == "Administrador") {
                    window.location.href = "./administrador.html";
                }

            }
            if(data.status == erroRequisicao) {
                setTimeout(() => {
                    window.location.reload();
                }, 4000);
            }
        } catch (error) {
            pararCarregamento();
            mostrarMensagem("Tivemos problemas com o servidor! <br> Tente realizar o login novamente")
        }
    })
}