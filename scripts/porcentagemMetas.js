document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const localId = usuario.localId;

  if (!token || !localId) {
    console.warn("Usuário não autenticado. Dados não carregados.");
    return;
  }

  try {
    const resposta = await fetch(`https://banco-de-dados-a6728-default-rtdb.firebaseio.com/usuarios/${localId}.json?auth=${token}`);
    const data = await resposta.json();

    if (!data || data.vendas === undefined || data.associacoes === undefined) {
      console.warn("Dados incompletos ou não encontrados.");
      return;
    }

    const vendas = data.vendas;
    const indicacoes = data.associacoes;

    function calcularPorcentagem(valorAtual, metaBase) {
      const restante = valorAtual % metaBase;
      return (restante / metaBase) * 100;
    }

    function atualizarMeta(valorAtual, metaBase, idTexto, idGrafico) {
      const porcentagem = calcularPorcentagem(valorAtual, metaBase);
      const texto = document.querySelector(`.${idTexto}`);
      const grafico = document.getElementById(idGrafico);

      if (texto) {
        texto.textContent = `${porcentagem.toFixed(1)}%`;
      }

      if (grafico) {
        grafico.style.background = `linear-gradient(to right, var(--cor-primaria) ${porcentagem}%, transparent ${porcentagem}%)`;
      }
    }

    atualizarMeta(indicacoes, 30, "porcent1", "graficoMeta1");
    atualizarMeta(vendas, 5, "porcent2", "graficoMeta2");
    atualizarMeta(indicacoes, 50, "porcent3", "graficoMeta3");

  } catch (err) {
    console.error("Erro ao buscar dados:", err);
  }
});