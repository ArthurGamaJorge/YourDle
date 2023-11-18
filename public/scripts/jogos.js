let search = async () =>{
    let temParametroBusca = false
    conteudo = document.getElementById('searchContent').value
    if(conteudo != ""){
        temParametroBusca = true
    }

    cards = document.querySelectorAll('.card') // remove todos posts antigos
    for(var j=0; j < cards.length; j++){
        cards[j].parentNode.removeChild(cards[j]);
    }

    informações = {content: conteudo, temParametroBusca: temParametroBusca}

    fetch("/searchWordle", {
        method:"POST",
        headers:{"Content-type": "application/json"},
        body:JSON.stringify(informações)
    })
    .then(response => response.json()) // Converte a resposta em um objeto JavaScript
    .then(data => {
        for(var i = 0; i < data.length; i++){
            adicionarJogo(data[i].idWordle, data[i].titulo, data[i].curtida, data[i].descurtida, data[i].data, data[i].username,"wordle")
        }
    })

    fetch("/searchConexo", {
        method:"POST",
        headers:{"Content-type": "application/json"},
        body:JSON.stringify(informações)
    })
    .then(response => response.json()) // Converte a resposta em um objeto JavaScript
    .then(data => {
        for(var i = 0; i < data.length; i++){
            adicionarJogo(data[i].idConexo, data[i].titulo, data[i].curtida, data[i].descurtida, data[i].dataCriado, data[i].username,"conexo")
        }
    })
}

function adicionarJogo(idJogo,titulo,curtidas,descurtidas,data,username, tipo) {
    let containerCards = document.querySelector('.containerCards')
    
    conteudo = ''
    conteudo += `
    <div class="card ${idJogo} ${tipo}">
        <h2><a href="${tipo}/${idJogo}">${titulo}</a></h2>
        <p>${username}</p>
        <div id="capa"></div>
        <div class="interações">
            <button id="like"> <img src=Images/like.png class="curtida">  ${curtidas} </button>
            <button id="dislike"> <img src=Images/dislike.png class="curtida"> ${descurtidas} </button>
            <p id="data">${data}</p>
        </div>
    </div>`
    
    containerCards.innerHTML += conteudo
}