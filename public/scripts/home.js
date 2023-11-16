window.onload = () =>{
    loginInformations = JSON.parse(localStorage.getItem("login"))
    if(loginInformations != null){
        logar(loginInformations)
    }
}

let filtrar = () =>{
    divFiltros = document.getElementById('filterOptions')
    divFiltros.classList.toggle("aberto");
}

let fecharBox = () =>{
    document.querySelector('#boxLogin').classList.remove("open")
}

let criar = () =>{
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

let registrar = () =>{
    let infoRegistro = {
        username: document.getElementById('username').value,
        senha: document.getElementById('senha').value,
        confirmarSenha: document.getElementById('senhaConfirmar').value
    }

    fetch("/registrar", {
        method:"POST",
        headers:{
            "Content-type": "application/json"
        },
        body:JSON.stringify(infoRegistro)
    }).then(response => response.json()) // Converte a resposta em um objeto JavaScript
      .then(data => {
        if(data.resposta != "sucesso"){
            alert(data.resposta)
        } else{
            alert("Registro feito com sucesso")
            localStorage.setItem("login", JSON.stringify(infoRegistro))
        }
    })
}

let login = () =>{
    let infoLogin = {
        username: document.getElementById('usuariologin').value,
        senha: document.getElementById('senhalogin').value
    }
    logar(infoLogin)
}

let logar = infoLogin =>{
    fetch("/logar", {
        method:"POST",
        headers:{
            "Content-type": "application/json"
        },
        body:JSON.stringify(infoLogin)
    }).then(response => response.json()) // Converte a resposta em um objeto JavaScript
      .then(data => {
        if(data.resposta != "sucesso"){
            alert("Informações incorretas")
        } else{
            localStorage.setItem("login", JSON.stringify(infoLogin))
            fecharBox()
        }
    })
}

