document.addEventListener("DOMContentLoaded", () => {

  palavra = ''; palavra2 = ''; palavra3 = ''; palavra4 = ''
  arrayResposta2 = []; arrayResposta3 = []; arrayResposta4 = []
  bloquearClique = false
  acertos = 0
  
  infoWordle = {idWordle: (window.location.href.split("/"))[4]}

  fetch("/pegarPalavra", {
    method:"POST",
    headers:{
        "Content-type": "application/json"
    },
    body:JSON.stringify(infoWordle)
}).then(response => response.json()) // Converte a resposta em um objeto JavaScript
  .then(data => {
    palavra = data[0].palavra.toLowerCase()
    try{
      palavra2 = data[0].palavra2.toLowerCase()
      arrayResposta2 = [palavra2[0], palavra2[1], palavra2[2], palavra2[3], palavra2[4]]

      palavra3 = data[0].palavra3.toLowerCase()
      arrayResposta3 = [palavra3[0], palavra3[1], palavra3[2], palavra3[3], palavra3[4]]

      palavra4 = data[0].palavra4.toLowerCase()
      arrayResposta4 = [palavra4[0], palavra4[1], palavra4[2], palavra4[3], palavra4[4]]
    } catch{
      console.log("não quarteto")
    }
    quantasPalavras = 1
    if(palavra2 != ''){
      quantasPalavras = 2
    }
    if(palavra4 != ''){
      quantasPalavras = 4
    }

      criarQuadrados();

      palavrasAdivinhadas = [[]];
      espacoDisponivel = 1;

      arrayResposta = [palavra[0], palavra[1], palavra[2], palavra[3], palavra[4]]
      arrayRespostas = [arrayResposta, arrayResposta2, arrayResposta3, arrayResposta4]
      palavras = [palavra, palavra2, palavra3, palavra4]
      contadorPalavrasAdivinhadas = 0;
    }
  )

  teclas = document.querySelectorAll(".keyboard-row button");


  function getArrayPalavraAtual() {
    const numeroDePalavrasAdivinhadas = palavrasAdivinhadas.length;
    return palavrasAdivinhadas[numeroDePalavrasAdivinhadas - 1];
  }

  function atualizarPalavrasAdivinhadas(letra) {
    const arrayPalavraAtual = getArrayPalavraAtual();

    if (arrayPalavraAtual && arrayPalavraAtual.length < 5) {
      arrayPalavraAtual.push(letra);

      for(var i = 0; i<quantasPalavras; i++){
        if(document.querySelector(`.board${i} #q${espacoDisponivel}`) != null){
          const elementoEspacoDisponivel = document.querySelector(`.board${i} #q${espacoDisponivel}`);
          elementoEspacoDisponivel.textContent = letra;
        }
      }
      espacoDisponivel +=  1;
    }
  }

  function obterCorDoQuadrado(letra, indice, palavra) {
    const letraCorreta = palavras[palavra].includes(letra);

    if (!letraCorreta) {
      return "rgb(58, 58, 60)";
    }

    const letraNaquelaPosicao = palavras[palavra].charAt(indice);
    const posicaoCorreta = letra === letraNaquelaPosicao;

    if (posicaoCorreta) {
      return "rgb(83, 141, 78)";
    }


    for(var j = 0; j<5; j++){
      if(arrayRespostas[palavra][j] == letra && palavras[palavra].charAt(j) == arrayPalavraAtual[j]){
          if(arrayPalavraAtual[j] == letra && ocorrêciasRespostas[palavra][j] > 1){
            ocorrêciasRespostas[palavra][j] -= 1
            return "rgb(181, 159, 59)"
          }           
            return "rgb(58, 58, 60)"
      }
    }

    return "rgb(181, 159, 59)"
  }

const itemCounter = (value, index) => {
  return value.filter((x) => x == index).length;
};

 function enviarPalavra() {
    bloquearClique = true
    arrayPalavraAtual = getArrayPalavraAtual();
    if (arrayPalavraAtual.length !== 5) {
      window.alert("A palavra deve ter 5 letras");
    }

    const palavraAtual = arrayPalavraAtual.join("");

    fetch("/palavraValida", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({ palavra: palavraAtual })
    })
    .then(response => response.json())
    .then(data => {
      if (data.resposta === true || palavraAtual === palavra) {
        const primeiroIdLetra = contadorPalavrasAdivinhadas * 5 + 1;
        const intervalo = 200;

        ocorrênciasResposta = [itemCounter(arrayResposta, arrayResposta[0]), itemCounter(arrayResposta, arrayResposta[1]), itemCounter(arrayResposta, arrayResposta[2]) ,itemCounter(arrayResposta, arrayResposta[3]), itemCounter(arrayResposta, arrayResposta[4])]
        ocorrênciasResposta2 = [itemCounter(arrayResposta2, arrayResposta2[0]), itemCounter(arrayResposta2, arrayResposta2[1]), itemCounter(arrayResposta2, arrayResposta2[2]) ,itemCounter(arrayResposta2, arrayResposta2[3]), itemCounter(arrayResposta2, arrayResposta2[4])]
        ocorrênciasResposta3 = [itemCounter(arrayResposta3, arrayResposta3[0]), itemCounter(arrayResposta3, arrayResposta3[1]), itemCounter(arrayResposta3, arrayResposta3[2]) ,itemCounter(arrayResposta3, arrayResposta3[3]), itemCounter(arrayResposta3, arrayResposta3[4])]
        ocorrênciasResposta4 = [itemCounter(arrayResposta4, arrayResposta4[0]), itemCounter(arrayResposta4, arrayResposta4[1]), itemCounter(arrayResposta4, arrayResposta4[2]) ,itemCounter(arrayResposta4, arrayResposta4[3]), itemCounter(arrayResposta4, arrayResposta4[4])]
        ocorrêciasRespostas = [ocorrênciasResposta, ocorrênciasResposta2, ocorrênciasResposta3, ocorrênciasResposta4]
        
        for (var k = 0; k < quantasPalavras; k++) {
          arrayPalavraAtual.forEach((letra, indice) => {
        
              const corQuadrado = obterCorDoQuadrado(letra, indice, k);
              const idLetra = primeiroIdLetra + indice;
              const elementoLetra = document.querySelector(`.board${k} #q${idLetra}`);
              if(elementoLetra != null){
                elementoLetra.classList.add("animate__flipInX");
              elementoLetra.style = `background-color:${corQuadrado};border-color:${corQuadrado}`;
              }
          });
        }
        

        contadorPalavrasAdivinhadas += 1;

        if (palavrasAdivinhadas.length === 5 + quantasPalavras) {
          window.alert(`Desculpe, você não tem mais tentativas! A palavra era ${palavra}.`);
        }

        palavrasAdivinhadas.push([]);

        for(var i = 0; i<quantasPalavras; i++){
          if(palavraAtual == palavras[i]){
            acertos += 1
            boards = document.querySelectorAll('#board')
            boards[i].classList.remove('board' + i)
            if(acertos == quantasPalavras){
              window.alert("Parabéns, você ganhou")
              bloquearClique = true;
            }
          }
        }
        
      } 
     else {
       alert("Palavra inválida");
     }
    
    });
    if (acertos < quantasPalavras){
      bloquearClique = false
    }
  }

  function criarQuadrados() {
    const containerQuadroJogo = document.getElementById('board-container')

      for(let j = 0; j<quantasPalavras; j++){
        containerQuadroJogo.innerHTML += `<div id="board" class="board${j}"></div>`
        let quadroJogo = document.querySelector(".board" + j)

        for (let indice = 0; indice < 30 + (quantasPalavras-1)*5; indice++) {
          let quadrado = document.createElement("div");
          quadrado.classList.add("square");
          quadrado.classList.add("animate__animated");
          quadrado.setAttribute("id", "q" + parseInt(indice + 1));
          quadroJogo.appendChild(quadrado);
        }
      }
  }

  function deletarLetra() {
    const arrayPalavraAtual = getArrayPalavraAtual();
    if(arrayPalavraAtual.length == 0){
      return
    }

    arrayPalavraAtual.pop();
    palavrasAdivinhadas[palavrasAdivinhadas.length - 1] = arrayPalavraAtual;

    for(var i = 0; i<quantasPalavras; i++){
      if(document.querySelector(`.board${i} #q${espacoDisponivel - 1}`) != null){
        const ultimaLetraElemento = document.querySelector(`.board${i} #q${espacoDisponivel - 1}`);
      ultimaLetraElemento.textContent = '';
      }
      
    }
    espacoDisponivel -=  1;
  }


  document.addEventListener("keydown", (evento) => {
    const tecla = evento.key.toLowerCase(); 
    const botao = document.querySelector(`button[data-key="${tecla}"]`);

    if(bloquearClique){
      return
    }

    if (botao || tecla === "backspace") {
      if (tecla === "enter") {
        enviarPalavra();
        return;
      }

      if (tecla === "del" || tecla === "backspace") {
        deletarLetra();
        return;
      }

      atualizarPalavrasAdivinhadas(tecla);
    }
  });

  for (let i = 0; i < teclas.length; i++) {
    teclas[i].onclick = ({ target }) => {
      const letra = target.getAttribute("data-key");

      if(bloquearClique){
        return
      }

      if (letra === "enter") {
        enviarPalavra();
        return;
      }

      if (letra === "del") {
        deletarLetra();
        return;
      }

      atualizarPalavrasAdivinhadas(letra);
    };
  }
});
