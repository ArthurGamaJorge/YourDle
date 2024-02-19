window.onload = () =>{

  infoConexo = {idConexo: (window.location.href.split("/"))[4]}
  verde = []; azul = []; amarelo = []; vermelho = [];

  fetch("/pegarGrupos", {
    method:"POST",
    headers:{
        "Content-type": "application/json"
    },
    body:JSON.stringify(infoConexo)
}).then(response => response.json()) // Converte a resposta em um objeto JavaScript
  .then(data => {
    verde = {itens: data[0].verde.split(",").slice(0, 4), desc: data[0].verde.split(",")[4]}
    azul = {itens: data[0].azul.split(",").slice(0, 4), desc: data[0].azul.split(",")[4]}
    vermelho = {itens: data[0].vermelho.split(",").slice(0, 4), desc: data[0].vermelho.split(",")[4]}
    amarelo = {itens: data[0].amarelo.split(",").slice(0, 4), desc: data[0].amarelo.split(",")[4]}

    atualizarBoard()
  })
    seleçãoAtual = []
}

let atualizarBoard = () =>{
  total = []

  for(var j = 0; j<4; j++){
    total.push(verde.itens[j])
    total.push(azul.itens[j])
    total.push(amarelo.itens[j])
    total.push(vermelho.itens[j])
  }

  total = shuffle(total)
  botões = document.querySelectorAll('.button')

  for(var i = 0; i < (verde.itens.length + amarelo.itens.length + vermelho.itens.length + azul.itens.length); i++){
    botões[i].textContent = total[i]
  }
}

let removerAnimações = async(tempo) =>{
  await sleep(tempo)
  for(var i = 0; i < (verde.itens.length + amarelo.itens.length + vermelho.itens.length + azul.itens.length); i++){
    botões[i].classList.remove('tremido')
    botões[i].classList.remove('sucedido')
  }
  results = document.querySelectorAll('.result')
  for(var i = 0; i < results.length; i++){
    results[i].classList.remove('aparente')
  }
}

function arrayRemove(arr, value) {
  return arr.filter(function (geeks) {
      return geeks != value;
  });
}

cliquesPermitidos = true

let selecionar = async botão =>{
  botão = document.getElementById(botão)
  opção = 0
  if(!cliquesPermitidos){
    return
  }

  if(botão.classList[1] == "Selecionado"){
    seleçãoAtual = arrayRemove(seleçãoAtual, botão.textContent)
  } else{
    seleçãoAtual.push(botão.textContent)
  }
  botão.classList.toggle("Selecionado")

  respostaOrdenada = seleçãoAtual.sort()

  if(seleçãoAtual.length == 4){
    cliquesPermitidos = false
    respostaOrdenada = seleçãoAtual.sort()

    if(JSON.stringify(respostaOrdenada) == JSON.stringify(verde.itens)){
      await resolvido("verde", verde)
      verde.itens = []
    } 

    if(JSON.stringify(respostaOrdenada) == JSON.stringify(azul.itens)){
      await resolvido("azul", azul)
      azul.itens = []
    } 

    if(JSON.stringify(respostaOrdenada) == JSON.stringify(amarelo.itens)){
      await resolvido("amarelo", amarelo)
      amarelo.itens = []
    } 

    if(JSON.stringify(respostaOrdenada) == JSON.stringify(vermelho.itens)){
      await resolvido("vermelho", vermelho)
      vermelho.itens = []
    } 

    if(opção == 0){
      await resolvido("falso", [])
      cliquesPermitidos = true
    }

    if(verde.itens.length == 0 && azul.itens.length == 0 && amarelo.itens.length == 0 && vermelho.itens.length == 0){
      alert("Parabéns você ganhou")
    }
  }
}

let resolvido = async(cor, array) => {
  opção = 1
  divQuadrados = document.querySelector('.quadrados')
  botões = document.querySelectorAll('.button')

  if(cor == "falso"){
    for(var l = 0; l < (verde.itens.length + amarelo.itens.length + vermelho.itens.length + azul.itens.length); l++){
      if(botões[l].classList[1] == "Selecionado"){
        botões[l].classList.remove("Selecionado")
        botões[l].classList.add('tremido')
      }
    }
    removerAnimações(500)
  } else{
    removidos = []
    for(var k = 0; k < (verde.itens.length + amarelo.itens.length + vermelho.itens.length + azul.itens.length); k++){
      if(botões[k].classList[1] == "Selecionado"){
        botões[k].classList.add('sucedido')
        botões[k].classList.add(cor)
        removidos.push(botões[k])
      }
    }
    removerAnimações(2000)
      for(var m = 0; m<4; m++){divQuadrados.removeChild(removidos[m])}
    divQuadrados.innerHTML += `
    <div class="result ${cor} aparente">
    <h2> ${array.desc} </h2>
    <p> ${array.itens[0]} ${array.itens[1]} ${array.itens[2]} ${array.itens[3]} </p>
    </div>
  `
  removerAnimações(2000)
  }
  document.getElementById('quantasTentativas').textContent = Number(document.getElementById('quantasTentativas').textContent) + 1
  seleçãoAtual = []
  cliquesPermitidos = true

}

const shuffle = (array) => { 
    for (let i = array.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]]; 
    } 
    return array; 
  }; 

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
