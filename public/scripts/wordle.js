document.addEventListener("DOMContentLoaded", () => {
  criarQuadrados();

  let palavrasAdivinhadas = [[]];
  let espacoDisponivel = 1;

  let palavra = "calvo";
  let contadorPalavrasAdivinhadas = 0;

  const teclas = document.querySelectorAll(".keyboard-row button");

  function getArrayPalavraAtual() {
    const numeroDePalavrasAdivinhadas = palavrasAdivinhadas.length;
    return palavrasAdivinhadas[numeroDePalavrasAdivinhadas - 1];
  }

  function atualizarPalavrasAdivinhadas(letra) {
    const arrayPalavraAtual = getArrayPalavraAtual();

    if (arrayPalavraAtual && arrayPalavraAtual.length < 5) {
      arrayPalavraAtual.push(letra);

      const elementoEspacoDisponivel = document.getElementById(String(espacoDisponivel));

      espacoDisponivel = espacoDisponivel + 1;
      elementoEspacoDisponivel.textContent = letra;
    }
  }

  function obterCorDoQuadrado(letra, indice) {
    const letraCorreta = palavra.includes(letra);

    if (!letraCorreta) {
      return "rgb(58, 58, 60)";
    }

    const letraNaquelaPosicao = palavra.charAt(indice);
    const posicaoCorreta = letra === letraNaquelaPosicao;

    if (posicaoCorreta) {
      return "rgb(83, 141, 78)";
    }

    return "rgb(181, 159, 59)";
  }

  function enviarPalavra() {
    const arrayPalavraAtual = getArrayPalavraAtual();
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
      if (data.resposta === true) {
        const primeiroIdLetra = contadorPalavrasAdivinhadas * 5 + 1;
        const intervalo = 200;

        arrayPalavraAtual.forEach((letra, indice) => {
          setTimeout(() => {
            const corQuadrado = obterCorDoQuadrado(letra, indice);

            const idLetra = primeiroIdLetra + indice;
            const elementoLetra = document.getElementById(idLetra);
            elementoLetra.classList.add("animate__flipInX");
            elementoLetra.style = `background-color:${corQuadrado};border-color:${corQuadrado}`;
          }, intervalo * indice);
        });

        contadorPalavrasAdivinhadas += 1;

        if (palavrasAdivinhadas.length === 6) {
          window.alert(`Desculpe, você não tem mais tentativas! A palavra é ${palavra}.`);
        }

        palavrasAdivinhadas.push([]);

        if (palavraAtual === palavra) {
          window.alert("Parabéns!");
        }
        
      } 
      else {
        alert("Palavra inválida");
      }
    });
  }

  function criarQuadrados() {
    const quadroJogo = document.getElementById("board");

    for (let indice = 0; indice < 30; indice++) {
      let quadrado = document.createElement("div");
      quadrado.classList.add("square");
      quadrado.classList.add("animate__animated");
      quadrado.setAttribute("id", indice + 1);
      quadroJogo.appendChild(quadrado);
    }
  }

  function deletarLetra() {
    const arrayPalavraAtual = getArrayPalavraAtual();
    if(arrayPalavraAtual.length == 0){
      return
    }

    const letraRemovida = arrayPalavraAtual.pop();

    palavrasAdivinhadas[palavrasAdivinhadas.length - 1] = arrayPalavraAtual;

    const ultimaLetraElemento = document.getElementById(String(espacoDisponivel - 1));

    ultimaLetraElemento.textContent = "";
    espacoDisponivel = espacoDisponivel - 1;
  }

  document.addEventListener("keydown", (evento) => {
    const tecla = evento.key.toLowerCase(); // Convertendo para minúsculas para corresponder aos data-keys
    const botao = document.querySelector(`button[data-key="${tecla}"]`);

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
