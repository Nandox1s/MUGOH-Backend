document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("animeForm");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Sessão expirada. Faça login novamente.");
      window.location.href = "login.html";
      return;
    }

    const formData = new FormData(form);

    try {
      const resposta = await fetch("https://mugoh-backend.onrender.com/registro", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const resultado = await resposta.json();

      if (!resposta.ok || !resultado.sucesso) {
        throw new Error(resultado.mensagem || "Erro ao cadastrar anime.");
      }

      alert("Anime cadastrado com sucesso!");
      form.reset();
    } catch (erro) {
      console.error("Erro:", erro);
      alert("Falha ao cadastrar: " + erro.message);
    }
  });
});
