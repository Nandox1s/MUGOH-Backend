const token = localStorage.getItem("token");
const email = localStorage.getItem("email");
const EMAIL_ADMIN = "teste@gmail.com";

if (!token) {
  window.location.replace("login.html");
} else {
  document.addEventListener("DOMContentLoaded", async () => {
    document.body.style.display = "block";

    const botaoAdmin = document.getElementById("botaoAdmin");
    if (email !== EMAIL_ADMIN && botaoAdmin) {
      botaoAdmin.style.display = "none";
    }

    const animeContainer = document.getElementById("animeContainer");

    try {
      const resposta = await fetch("https://mugoh-backend.onrender.com/animes", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!resposta.ok) {
        throw new Error("Erro ao buscar animes");
      }

      const animes = await resposta.json();

      animes.slice(0, 6).forEach(anime => {
        const item = document.createElement("div");
        item.classList.add("item");

        item.innerHTML = `
          <img src="${anime.imagem}" alt="${anime.titulo}" />
          <h3>${anime.titulo}</h3>
          <p>Nota: ${anime.nota}</p>
        `;

        animeContainer.appendChild(item);
      });
    } catch (erro) {
      console.error("Erro ao carregar animes:", erro);
    }
  });
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

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

    const dados = {
      tipo: form.tipo.value,
      titulo: form.titulo.value,
      nota: form.nota.value,
      foto: form.fotoSelecionada.value
    };

    try {
      const resposta = await fetch("https://mugoh-backend.onrender.com/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dados)
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
