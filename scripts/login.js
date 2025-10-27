async function Login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const mensagem = document.getElementById("mensagem");

  try {
    const resposta = await fetch("https://backend-r4hs.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    if (!resposta.ok) {
      const erro = await resposta.json();
      mensagem.textContent = "Erro: " + (erro.mensagem || "Falha na autenticação.");
      mensagem.style.color = "red";
      return;
    }

    const data = await resposta.json();
    mensagem.textContent = "Login bem-sucedido!";
    mensagem.style.color = "green";

    // ✅ Salvar dados no localStorage
    localStorage.setItem("token", data.idToken);
    localStorage.setItem("usuario", JSON.stringify({
      email: data.email,
      localId: data.localId
    }));

    // ✅ Redirecionar para o dashboard
    window.location.href = "dashboard.html";
  } catch (err) {
    mensagem.textContent = "Erro de conexão com o servidor.";
    mensagem.style.color = "red";
    console.error("Erro de rede:", err);
  }
}