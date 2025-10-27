async function cadastrar(event) {
      event.preventDefault();

      const nome = document.getElementById("nome").value;
      const telefone = document.getElementById("telefone").value;
      const email = document.getElementById("email").value;
      const senha = document.getElementById("senha").value;
      const confirmacao = document.getElementById("confirmacao").value;
      const mensagem = document.getElementById("mensagem");

      if (senha !== confirmacao) {
        mensagem.textContent = "As senhas não coincidem.";
        mensagem.style.color = "red";
        return;
      }

      try {
        const resposta = await fetch("https://backend-r4hs.onrender.com/cadastro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, telefone, email, senha })
        });

        const data = await resposta.json();

        if (data.sucesso) {
          mensagem.textContent = "Cadastro realizado com sucesso!";
          mensagem.style.color = "green";
          console.log("Usuário cadastrado:", data.localId);
        } else {
          mensagem.textContent = "Erro: " + data.mensagem;
          mensagem.style.color = "red";
        }
      } catch (err) {
        mensagem.textContent = "Erro de conexão com o servidor.";
        mensagem.style.color = "red";
        console.error("Erro de rede:", err);
      }
    }