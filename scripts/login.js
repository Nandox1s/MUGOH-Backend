async function Login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const mensagem = document.getElementById("mensagem");

  try {
    const resposta = await fetch("https://mugoh-backend.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, senha })
    });

    const resultado = await resposta.json();

    if (resultado.sucesso) {
      mensagem.style.color = "lightgreen";
      mensagem.innerText = resultado.mensagem;

      // Armazena o token (opcional, se for usar autenticação nas próximas páginas)
      localStorage.setItem("token", resultado.idToken);
      localStorage.setItem("email", resultado.email);


      // Redireciona após 1 segundo
      setTimeout(() => {
        window.location.href = "home.html"; // Altere para a página desejada
      }, 1000);
    } else {
      mensagem.style.color = "red";
      mensagem.innerText = resultado.mensagem;
    }
  } catch (erro) {
    console.error("Erro ao conectar com o backend:", erro);
    mensagem.style.color = "orange";
    mensagem.innerText = "Erro de conexão com o servidor.";
  }
}
