window.onload = () =>{
    loginInformations = JSON.parse(localStorage.getItem("login"))
    if(loginInformations != null){
        logar(loginInformations)
    }
    search()
}

let filtrar = () =>{
    divFiltros = document.getElementById('filterOptions')
    divFiltros.classList.toggle("aberto");
}

let fecharBox = tipo =>{
    document.querySelector('#boxLogin').classList.remove("open")
    document.getElementById('divCriarPost').classList.remove("aberto")

    if(tipo != ".DivSair"){
        document.querySelector('.DivSair').classList.remove("aberto")
    }
}

Jogo = "Wordle"

let criar = () =>{
    if(loginInformations == null){
        document.querySelector('#boxLogin').classList.toggle("open")
    } else{
        document.getElementById('divCriarPost').classList.toggle("aberto") 
        document.querySelector('.Conexo2').classList.remove("aberto")
        document.querySelector(`.${Jogo}`).classList.remove('aberto')
    }
}

let ConexoAleatorio = () =>{
    fetch("/conexoaleatorio", {
        method:"GET",
    }).then(response => response.json()) 
    .then(data => {
        window.location.href = `/conexo/${data}`
    })
}

let WordleAleatorio = () =>{
    fetch("/wordlealeatorio", {
        method:"GET",
    }).then(response => response.json()) 
    .then(data => {
        window.location.href = `/wordle/${data}`
    })
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
            showStatusBar("Registro feito com sucesso", 3000);  
            localStorage.setItem("login", JSON.stringify(data.info))
            loginInformations = data.info; 
            fecharBox("All")
            document.getElementById('divCriarPost').classList.toggle("aberto")
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
    }).then(response => response.json()) 
      .then(data => {
        if(data.resposta != "sucesso"){
            showStatusBar("Informações incorretas no login", 2000);  
        } else{
            localStorage.setItem("login", JSON.stringify(data.info))
            loginInformations = JSON.parse(localStorage.getItem("login"))
            fecharBox("All")
            document.querySelector('#sairButton').style = "display: block"
        }
    })
}

let mudarSeção = ação =>{
    if(ação == "avançar"){
        titulo = document.getElementById('titulo').value
        if(titulo == ""){
            showStatusBar("Adicione um título primeiro", 3000);  
            return
        }
    
        tiposDeJogos = document.getElementById('tiposDeJogo')
        Jogo = tiposDeJogos.options[tiposDeJogos.selectedIndex].value;
        document.getElementById('divCriarPost').classList.toggle("aberto")
        document.querySelector(`.${Jogo}`).classList.add('aberto')
    } else{
        if(ação == "avançarConexo2"){
            document.querySelector('.Conexo2').classList.toggle("aberto")
        }
        if(ação == "retornarConexo2"){
            document.querySelector('.Conexo2').classList.toggle("aberto")
        }

        document.querySelector(`.${Jogo}`).classList.toggle('aberto')
        document.getElementById('divCriarPost').classList.toggle("aberto")
    }
}

let publicar = Tipo =>{
    titulo = document.getElementById('titulo').value
    infoPost = {}

    if(Tipo == "Conexo"){
        Verde = [document.getElementById('Verde1').value, document.getElementById('Verde2').value, document.getElementById('Verde3').value, document.getElementById('Verde4').value].sort() + "," + [document.getElementById('VerdeDesc').value]
        Amarelo = [document.getElementById('Amarelo1').value, document.getElementById('Amarelo2').value, document.getElementById('Amarelo3').value, document.getElementById('Amarelo4').value].sort() + "," + [ document.getElementById('AmareloDesc').value]
        Azul = [document.getElementById('Azul1').value, document.getElementById('Azul2').value, document.getElementById('Azul3').value, document.getElementById('Azul4').value].sort() + "," + [ document.getElementById('AzulDesc').value]
        Vermelho = [document.getElementById('Vermelho1').value, document.getElementById('Vermelho2').value, document.getElementById('Vermelho3').value, document.getElementById('Vermelho4').value].sort() + "," + [document.getElementById('VermelhoDesc').value]
        infoPost = {idUsuario: loginInformations.idUsuario, tipo: "Conexo", verde: Verde, amarelo: Amarelo, azul: Azul, vermelho: Vermelho, titulo: titulo}
    
    } else{
        palavras = [null, null, null, null]
        palavrasValores = document.querySelectorAll('#palavraWordle')
        for(var i = 0; i<palavrasValores.length; i++){
            palavras[i] = palavrasValores[i].value
        }
        infoPost = {idUsuario: loginInformations.idUsuario, tipo: "Wordle", palavras: palavras, titulo: titulo}
    }

    fetch("/publicar", {
        method:"POST",
        headers:{
            "Content-type": "application/json"
        },
        body:JSON.stringify(infoPost)
    }).then(response => response.json()) 
      .then(data => {
        if(data.resposta != "sucesso"){
            alert(data.resposta)
        } else{
            location.reload()
        }
    })
}

let sair = () =>{
    document.querySelector('.DivSair').classList.add("aberto")
}

let confirmarSaida  = () =>{
    loginInformations = null
    localStorage.setItem("login", null)
    fecharBox("All")
    document.querySelector('#sairButton').style = "display: none"
}

function handleEnterKey(event) {
    if (event.key === 'Enter') {
        document.getElementById('searchButton').click();
    }
}
document.getElementById('searchContent').addEventListener('keyup', handleEnterKey);

let selecionar = (filtro) =>{
    document.getElementById('data').classList.remove("Selecionado")
    document.getElementById('curtidas').classList.remove("Selecionado")
    
    filtro.classList.add('Selecionado')
    search()
}

let selecionarJogo = (tipo) =>{

    if(tipo.classList[0] == "Selecionado"){
        tipo.classList.remove('Selecionado')
        search()
        return
    }

    document.getElementById('buscarWordle').classList.remove("Selecionado")
    document.getElementById('buscarConexo').classList.remove("Selecionado")


    tipo.classList.add('Selecionado')

    search()
}

let selecionarQPalavras = (tipoPalavras) =>{
    document.getElementById('termo').classList.remove("Selecionado")
    document.getElementById('dueto').classList.remove("Selecionado")
    document.getElementById('quarteto').classList.remove("Selecionado")
    
    tipoPalavras.classList.add('Selecionado')

    palavras = document.querySelectorAll('#palavraWordle')
    for(var j=0; j < palavras.length; j++){
        palavras[j].parentNode.removeChild(palavras[j]); // remove todas palavras
    }
    containerPalavras = document.getElementById('containerPalavras')

    if(tipoPalavras.id == "termo"){
        containerPalavras.innerHTML += `<input id="palavraWordle" placeholder="Palavra" maxlength="5">`
    }
    if(tipoPalavras.id == "dueto"){
        for(var i = 0; i<2; i++){
            containerPalavras.innerHTML += `<input id="palavraWordle" placeholder="Palavra" maxlength="5">`
        }
        
    }
    if(tipoPalavras.id == "quarteto"){
        for(var i = 0; i<4; i++){
            containerPalavras.innerHTML += `<input id="palavraWordle" placeholder="Palavra" maxlength="5">`
        }
    }
}
