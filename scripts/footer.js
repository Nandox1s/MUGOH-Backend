async function carregarHeader() {
  const headerContainer = document.getElementById('footer');

  try {
    const resposta = await fetch('/partials/footer.html');

    if (!resposta.ok) {
      throw new Error(`Erro ao carregar o footer: ${resposta.status}`);
    }

    const conteudo = await resposta.text();
    headerContainer.innerHTML = conteudo;

  } catch (erro) {
    console.error(erro);
    headerContainer.innerHTML = `
      <div>
        Não foi possível carregar o rodapé 😢
      </div>
    `;
  }
}

carregarHeader();