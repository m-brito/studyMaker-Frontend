window.onload = () => {
    // Enviar requisicao de cadastro do usuario
    document.querySelector("form").addEventListener("submit", async (event) => {
        event.preventDefault();
        carregamento();
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
        console.log(data)
        pararCarregamento();
        mostrarMensagem(data.mensagem);
        if(data.status == erroRequisicao) {
            setTimeout(() => {
                window.location.reload();
            }, 4000);
        }
    })
}