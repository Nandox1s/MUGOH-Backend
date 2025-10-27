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
      const restante = valorAtual % metaBase;
      const porcentagem = (restante / metaBase) * 100;
      const texto = document.querySelector(`.${idTexto}`);
      const grafico = document.getElementById(idGrafico);

      if (texto) {
        texto.textContent = `${porcentagem.toFixed(1)}%`;
      }

      if (grafico) {
        grafico.style.background = `linear-gradient(to right, var(--cor-primaria) ${porcentagem}%, transparent ${porcentagem}%)`;
      }
    }

    function criarGrafico(id, atual, meta) {
      const restante = atual % meta;
      const porcentagem = (restante / meta) * 100;
      const container = d3.select(`#${id}`);
      const width = container.node().clientWidth;
      const height = container.node().clientHeight;

      container.selectAll("svg").remove();

      const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("display", "block")
        .style("margin", "0")
        .style("padding", "0");

      svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", height)
        .attr("width", (porcentagem / 100) * width)
        .attr("fill", "#B3E700");
    }

    // Atualiza metas com valores tratados
    atualizarMeta(indicacoes, 30, "porcent1", "graficoMeta1");
    atualizarMeta(vendas, 5, "porcent2", "graficoMeta2");
    atualizarMeta(indicacoes, 50, "porcent3", "graficoMeta3");

    // Cria gráficos com valores tratados
    criarGrafico("graficoMeta1", indicacoes, 30);
    criarGrafico("graficoMeta2", vendas, 5);
    criarGrafico("graficoMeta3", indicacoes, 50);

  } catch (err) {
    console.error("Erro ao buscar dados:", err);
  }
});