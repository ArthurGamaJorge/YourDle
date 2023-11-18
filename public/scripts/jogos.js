let search = () =>{

    informações = {content: 'to-do', tópicos: 'to-do', temParametroBusca: 'to-do'}

    fetch("/searchposts", {
        method:"POST",
        headers:{"Content-type": "application/json"},
        body:JSON.stringify(informações)
    })
    .then(response => response.json()) // Converte a resposta em um objeto JavaScript
    .then(data => {

        cards = document.querySelectorAll('.card') // remove todos posts antigos
        for(var j=0; j < cards.length; j++){
            cards[j].parentNode.removeChild(cards[j]);
        }

        for(var i = 0; i < data.length; i++){
            try{ 
                adicionarJogo(
                    data[i].idWordle,
                    data[i].tituloWordle,
                    data[i].curtidaWordle,
                    data[i].descurtidaWordle,
                    data[i].dataWordle,
                    data[i].username,
                    "Wordle"
                )
            } catch{ 
                adicionarJogo(
                    data[i].idConexo,
                    data[i].tituloConexo,
                    data[i].curtidaConexo,
                    data[i].descurtidaConexo,
                    data[i].dataConexo,
                    data[i].username,
                    "Conexo"
                )
            }
        }
    })
}

function adicionarJogo(idJogo,titulo,curtidas,descurtidas,data,username, tipo) {
    let containerCards = document.querySelector('.containerCards')
    
    conteudo = ''
    conteudo += `
    <div class="card ${idJogo} ${tipo}">
        <h2>${titulo}</h2>
        <p>${username}</p>
        <div class="interações">
            <button id="like"> <img src=Images/like.png class="curtida">  ${curtidas} </button>
            <button id="dislike"> <img src=Images/dislike.png class="curtida"> ${descurtidas} </button>
            <p id="data">${data}</p>
        </div>
    </div>`
    
    containerCards.innerHTML += conteudo
}