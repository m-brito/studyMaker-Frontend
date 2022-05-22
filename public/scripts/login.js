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
            mostrarMensagem(data.mensagem);
            if(data.status == erroRequisicao) {
                setTimeout(() => {
                    window.location.reload();
                }, 4000);
            }
        } catch (error) {
            pararCarregamento();
            mostrarMensagem("Tivemos problemas com o servidor! <br> Tente realizar o login novamente")
        }
        console.log(data)
    })
}