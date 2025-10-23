const menuHamburguer = document.querySelector(".menu-hamburguer");
const nav = document.querySelector("nav");

// Função responsável por abrir/fechar o menu
function toggleMenu() {
  nav.classList.toggle("active");
}

// Função responsável por fechar o menu
function fecharMenu() {
  nav.classList.remove("active");
}

// Evento de clique no ícone
menuHamburguer.addEventListener("click", toggleMenu);

// Fecha o menu ao rolar a página
window.addEventListener("scroll", fecharMenu);