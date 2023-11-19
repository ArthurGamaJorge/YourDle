let resizeTimer; // impede animação css durante mudança no tamanho de janela
window.addEventListener("resize", () => {
  document.body.classList.add("resize-animation-stopper");
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.body.classList.remove("resize-animation-stopper");
  }, 400);
});

let mostrarInfo = () => {
  document.getElementById('divInfo').classList.toggle('aberto')
}

let fecharInfo = () => {
  document.getElementById('divInfo').classList.remove('aberto')
}