let search = async () =>{
    let temParametroBusca = false; let priorizarCurtidas = false;
    conteudo = document.getElementById('searchContent').value
    if(conteudo != ""){
        temParametroBusca = true
    }

    cards = document.querySelectorAll('.card') // remove todos posts antigos
    for(var j=0; j < cards.length; j++){
        cards[j].parentNode.removeChild(cards[j]);
    }
    if(document.getElementById('curtidas').classList[0] == "Selecionado"){
        priorizarCurtidas = true
    }
    informações = {content: conteudo, temParametroBusca: temParametroBusca, priorizarCurtidas: priorizarCurtidas}
    fetch("/search", {
        method:"POST",
        headers:{"Content-type": "application/json"},
        body:JSON.stringify(informações)
    })
    .then(response => response.json()) // Converte a resposta em um objeto JavaScript
    .then(data => {
        for(var i = 0; i < data.length; i++){
            adicionarJogo(data[i].idJogo, data[i].titulo, data[i].curtida, data[i].descurtida, data[i].dataCriado, data[i].username, data[i].tipo)
        
            if(loginInformations != null){
                infoCurtidas = {idWordle: data[i].idJogo, idConexo: data[i].idJogo, idUsuario: loginInformations.idUsuario, ação: "verificar"}
                console.log(infoCurtidas)
                verificarCurtida(`${data[i].tipo}`)
            }
        }
    })
}

function adicionarJogo(idJogo,titulo,curtidas,descurtidas,data,username, tipo) {
    let containerCards = document.querySelector('.containerCards')
    
    conteudo = ''
    conteudo += `
    <div class="card ${idJogo} ${tipo}${idJogo} ${tipo}">
        <h2><a href="${tipo}/${idJogo}">${titulo}</a></h2>
        <p>${username}</p>
        <div id="capa"></div>
        <div class="interações">
            <button id="like" onclick='curtir(this); event.stopPropagation()'> <img src=Images/like.png class="curtida">  <p id='quantasCurtidas'>${curtidas}</p>  </button>
            <button id="dislike" onclick='descurtir(this); event.stopPropagation()'> <img src=Images/dislike.png class="curtida"> <p id='quantasDescurtidas'>${descurtidas}</p> </button>
            <p id="data">${data}</p>
        </div>
    </div>`
    
    containerCards.innerHTML += conteudo
}

let verificarCurtida = alvo =>{
    fetch(`/curtidas${alvo}`, {
        method:"POST",
        headers:{"Content-type": "application/json"},
        body:JSON.stringify(infoCurtidas)
    })
    .then(response => response.json()) // Converte a resposta em um objeto JavaScript
    .then(data => {
        if(data.resposta != ""){
            if(alvo == "wordle"){
                alvo = document.querySelector(`.wordle${data[0].idWordle}`)
            } else{
                alvo = document.querySelector(`.conexo${data[0].idConexo}`)
            }
            if(data[0].curtido == false){
                botão = alvo.querySelector('#dislike')
                botão.classList.add('Descurtido')
            } else{
                botão = alvo.querySelector('#like')
                botão.classList.add('Curtido')
            }
        }})
}

let curtir = ButtonCurtir =>{

    let id = ButtonCurtir.parentElement.parentNode
    let Buttondescurtir = id.querySelector('#dislike'); 
    let curtidas = id.querySelector('#quantasCurtidas')
    let descurtidas = id.querySelector('#quantasDescurtidas')

    if(loginInformations == null){
        document.querySelector('#boxLogin').classList.toggle("open")
        return
    } else{
        if(ButtonCurtir.classList.contains('Curtido')){
            curtidas.innerHTML = Number(curtidas.textContent) - 1

            ButtonCurtir.classList.remove('Curtido')
            ação = "tirarCurtida"

        } else{
            curtidas.innerHTML = Number(curtidas.textContent) + 1
            if(Buttondescurtir.classList.contains('Descurtido')){descurtidas.innerHTML = Number(descurtidas.textContent) - 1}
            ButtonCurtir.classList.add('Curtido')
            Buttondescurtir.classList.remove('Descurtido')
            ação = "curtir"
        }
        informações = {idUsuario: loginInformations.idUsuario, idWordle: id.classList[1], idConexo: id.classList[1], ação: ação}
        
        fetch(`/curtidas${id.classList[3]}`, {
            method:"POST",
            headers:{"Content-type": "application/json"},
            body:JSON.stringify(informações)
        })
}
}

let descurtir = Buttondescurtir =>{

    let id = Buttondescurtir.parentElement.parentNode
    let ButtonCurtir = id.querySelector('#like'); 
    
    let curtidas = id.querySelector('#quantasCurtidas')
    let descurtidas = id.querySelector('#quantasDescurtidas')

    if(loginInformations == null){
        document.querySelector('#boxLogin').classList.toggle("open")
        return
    } else{
        if(Buttondescurtir.classList.contains('Descurtido')){
            descurtidas.innerHTML = Number(descurtidas.textContent) - 1

            Buttondescurtir.classList.remove('Descurtido')
            ação = "tirarDescurtida"
        } else{
            if(ButtonCurtir.classList.contains('Curtido')){
                curtidas.innerHTML = Number(curtidas.textContent) - 1
            }
            
            descurtidas.innerHTML = Number(descurtidas.textContent) + 1

            Buttondescurtir.classList.add('Descurtido')
            ButtonCurtir.classList.remove('Curtido')
            ação = "descurtir"
        }

        informações = {idUsuario: loginInformations.idUsuario, idWordle: id.classList[1], idConexo: id.classList[1], ação: ação}
        
        fetch(`/curtidas${id.classList[3]}`, {
            method:"POST",
            headers:{"Content-type": "application/json"},
            body:JSON.stringify(informações)
        })
    }
}