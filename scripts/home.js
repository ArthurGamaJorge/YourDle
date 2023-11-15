let filtrar = () =>{
    divFiltros = document.getElementById('filterOptions')
    divFiltros.classList.toggle("aberto");
}

let fecharBox = () =>{
    document.querySelector('#boxLogin').classList.remove("open")
}

let criar = () =>{
    loginInformations = JSON.parse(localStorage.getItem("login"))

    if(loginInformations == null){
        document.querySelector('#boxLogin').classList.toggle("open")
    }
}

let signinBtn = document.querySelector('.signinBtn');
let signupBtn = document.querySelector('.signupBtn');
let body = document.querySelector('body');

signupBtn.onclick = function() {
    body.classList.add('slide');
}

signinBtn.onclick = function() {
    body.classList.remove('slide');
}

let resizeTimer; // impede animação css durante mudança no tamanho de janela
window.addEventListener("resize", () => {
  document.body.classList.add("resize-animation-stopper");
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.body.classList.remove("resize-animation-stopper");
  }, 400);
});