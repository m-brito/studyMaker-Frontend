window.onload = () => {

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
        mostrarMensagem(data.mensagem);
        if(data.status == sucessoRequisicao) {
            setTimeout(() => {
                window.location.href = "./login.html";
            }, 4000);
        } else {
            setTimeout(() => {
                window.location.reload();
            }, 4000);
        }
    })
}