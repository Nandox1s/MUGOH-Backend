async function carregarHeader() {
  const headerContainer = document.getElementById('header');

  try {
    const resposta = await fetch('../partials/header.html');
    if (!resposta.ok) throw new Error(`Erro ao carregar o header: ${resposta.status}`);

    const conteudo = await resposta.text();
    headerContainer.innerHTML = conteudo;

    // 🔹 Carrega o script do menu hamburguer
    const scriptMenu = document.createElement('script');
    scriptMenu.src = '../scripts/menuHamburguer.js';
    document.body.appendChild(scriptMenu);

    // 🔐 Verifica autenticação
    const token = localStorage.getItem("token");
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    const localId = usuario.localId;

    if (!token || !localId) {
      console.warn("Usuário não autenticado.");
      return;
    }

    // 🔎 Busca dados do usuário
    const respostaUsuario = await fetch(`https://banco-de-dados-a6728-default-rtdb.firebaseio.com/usuarios/${localId}.json?auth=${token}`);
    const data = await respostaUsuario.json();

    if (!data || typeof data !== "object") {
      console.warn("Dados do usuário não encontrados.");
      return;
    }

    const cadastroLink = document.getElementById("cadastroLink");
    const loginBtn = document.getElementById("loginBtn");

    // 🔓 Botão de sair
    if (cadastroLink) {
      cadastroLink.textContent = "Sair";
      cadastroLink.href = "#";
      cadastroLink.onclick = (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = "../index.html";
      };
    }

    // 📊 Botão de dashboard
    if (loginBtn) {
      loginBtn.innerHTML = `<img src="../img/icones/octicon--person-16-black.svg" alt="Dashboard" style="height:24px;">`;
      loginBtn.href = "../pages/dashboard.html";
    }

  } catch (erro) {
    console.error("Erro ao carregar cabeçalho:", erro);
    headerContainer.innerHTML = `<div>Não foi possível carregar o cabeçalho 😢</div>`;
  }
}

carregarHeader();
