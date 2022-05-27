window.onload = () => {
    var codigo = "";
    var emailVerificado = false;

    // Mostrar na tela o nome do arquivo selecionado
    document.querySelector("input[id=foto]").addEventListener('change', function(){
        const valorInput = document.querySelector("input[id=foto]").value;
        const mostrarNome = document.querySelector("div[id=nomeArquivo]");
        mostrarNome.innerHTML = valorInput;
    });

    // Enviar requisicao de cadastro do usuario
    document.querySelector("form").addEventListener("submit", async (event) => {
        event.preventDefault();
        carregamento();
        if(emailVerificado == false) {
            pararCarregamento();
            mensagemPopUp.show({
                mensagem: "É necessário confirmar o email para cadastrar!",
                cor: "green"
            });
        } else {
            if(document.getElementById("foto").value) {
                var img = document.getElementById("foto").files[0];
            } else {
                var img = "";
            }
            const dados = new FormData();
            dados.append("imagem", img)
            dados.append("nome", document.querySelector("#nomeCompleto").value)
            dados.append("email", document.querySelector("#email").value)
            dados.append("senha", document.querySelector("#senha").value)
    
            const resp = await fetch(`${HOST}/usuario/cadastrarUsuario.php`, {
                "method": "POST",
                headers: {
                    'Accept': 'application/json'
                },
                body: dados
            })
    
            const data = await resp.json();
            pararCarregamento();
            if(data.status == sucessoRequisicao) {
                mensagemPopUp.show({
                    mensagem: data.mensagem,
                    cor: "green"
                });
                setTimeout(() => {
                    window.location.href = "./login.html";
                }, 2500);
            } else {
                mensagemPopUp.show({
                    mensagem: data.mensagem,
                    cor: "red"
                });
                setTimeout(() => {
                    window.location.reload();
                }, 2500);
            }
        }
    })

    document.querySelector("#bttConfirmarEmail").addEventListener("click", async (event)=> {
        carregamento();
        if(!document.querySelector("#email").checkValidity() || !document.querySelector("#nomeCompleto").checkValidity()) {
            mostrarMensagem("Preencha os campos nome e email para validar!")
        } else {
            const data = await disponibilidadeEmail(document.querySelector("#email").value);
            if(data.status == erroRequisicao) {
                pararCarregamento();
                document.querySelector("#mensagemInputEmail").innerHTML = data.mensagem;
                document.querySelector("#mensagemInputEmail").style.display = "flex";
            } else {
                document.querySelector("#mensagemInputEmail").innerHTML = "";
                document.querySelector("#mensagemInputEmail").style.display = "none";
                const respEnviarCodigo = await enviarCodigo(document.querySelector("#email").value, document.querySelector("#nomeCompleto").value)
                codigo = respEnviarCodigo.resultado;
                if(respEnviarCodigo.status == sucessoRequisicao) {
                    mostrarMensagem("Um código foi enviado ao seu email <br> Preencha o campo abaixo! <br><br> Obs: O email pode chegar como spam!");
                    document.querySelector("#labelStatus").innerHTML = "";
                    document.querySelector("form .codigo").style.display = "flex";
                    document.querySelector("form .grupo #containerBttConfirmarEmail").style.display = "none";
                    document.querySelector("#statusValidando").style.display = "flex";
                    document.querySelector("#email").disabled = true;
                    document.querySelector("#email").style.cursor = "not-allowed";
                } else {
                    mostrarMensagem(respEnviarCodigo.mensagem);
                }
            }
        }
    })

    document.querySelector("#codigo").addEventListener("blur", async (event) => {
        const resp = await criptografa(document.querySelector("#codigo").value)
        document.querySelector("#labelStatus").innerHTML = "";
        if(resp.resultado == codigo) {
            document.querySelector(".codigo").style.display = "none";
            document.querySelector("#status").innerHTML = "✔";
            document.querySelector("#status").style.backgroundColor = "#04D361";
            emailVerificado = true;
            
        } else {
            document.querySelector("#status").innerHTML = "✖";
            document.querySelector("#status").style.backgroundColor = "#FF6060";
        }
    })
}