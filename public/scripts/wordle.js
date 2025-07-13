document.addEventListener("DOMContentLoaded", () => {
  palavra = "";
  palavra2 = "";
  palavra3 = "";
  palavra4 = "";
  (arrayResposta = []), (arrayResposta2 = []);
  arrayResposta3 = [];
  arrayResposta4 = [];
  bloquearClique = false;
  acertos = 0;
  palavrasAcertadas = null;

  infoWordle = { idWordle: window.location.href.split("/")[4] };

  fetch("/pegarPalavra", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(infoWordle),
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("titulo").textContent =
        data[0].titulo + " - wordle";
      palavra = data[0].palavra.toLowerCase();
      try {
        palavra2 = data[0].palavra2.toLowerCase();
        arrayResposta2 = [
          palavra2[0],
          palavra2[1],
          palavra2[2],
          palavra2[3],
          palavra2[4],
        ];

        palavra3 = data[0].palavra3.toLowerCase();
        arrayResposta3 = [
          palavra3[0],
          palavra3[1],
          palavra3[2],
          palavra3[3],
          palavra3[4],
        ];

        palavra4 = data[0].palavra4.toLowerCase();
        arrayResposta4 = [
          palavra4[0],
          palavra4[1],
          palavra4[2],
          palavra4[3],
          palavra4[4],
        ];
      } catch {
        console.log("não quarteto");
      }
      quantasPalavras = 1;
      if (palavra2 != "") {
        quantasPalavras = 2;
        document.body.classList.add("Dueto");
      }
      if (palavra4 != "") {
        quantasPalavras = 4;
        document.body.classList.add("Quarteto");
      }
      palavrasAcertadas = new Array(quantasPalavras).fill(false);

      criarQuadrados();

      palavrasAdivinhadas = [[]];
      espacoDisponivel = 1;

      arrayResposta = [
        palavra[0],
        palavra[1],
        palavra[2],
        palavra[3],
        palavra[4],
      ];
      arrayRespostas = [
        arrayResposta,
        arrayResposta2,
        arrayResposta3,
        arrayResposta4,
      ];
      palavras = [palavra, palavra2, palavra3, palavra4];
      contadorPalavrasAdivinhadas = 0;

      destacarQuadrado(espacoDisponivel);
    });

  teclas = document.querySelectorAll(".keyboard-row button");

  function getArrayPalavraAtual() {
    const numeroDePalavrasAdivinhadas = palavrasAdivinhadas.length;
    const arrayPalavraAtual =
      palavrasAdivinhadas[numeroDePalavrasAdivinhadas - 1] || [];

    while (arrayPalavraAtual.length < 5) {
      arrayPalavraAtual.push(null);
    }

    return arrayPalavraAtual;
  }

  function atualizarPalavrasAdivinhadas(letra) {
    const arrayPalavraAtual = getArrayPalavraAtual();

    if (arrayPalavraAtual && espacoDisponivel >= 1) {
      const intervaloInicio = contadorPalavrasAdivinhadas * 5;
      const intervaloFim = intervaloInicio + 5;
      let posicaoInserir = espacoDisponivel - 1;

      if (arrayPalavraAtual[posicaoInserir % 5] !== null) {
        posicaoInserir = intervaloInicio;
        while (
          posicaoInserir < intervaloFim &&
          arrayPalavraAtual[posicaoInserir % 5] !== null
        ) {
          posicaoInserir++;
        }

        if (posicaoInserir >= intervaloFim) {
          posicaoInserir = intervaloInicio;
          while (
            posicaoInserir < intervaloFim &&
            arrayPalavraAtual[posicaoInserir % 5] !== null
          ) {
            posicaoInserir++;
          }
        }
      }
      if (posicaoInserir < intervaloFim) {
        arrayPalavraAtual[posicaoInserir % 5] = letra;

        for (let i = 0; i <= quantasPalavras; i++) {
          const espacoAtual = document.querySelector(
            `.board${i} #q${posicaoInserir + 1}`
          );
          if (espacoAtual) {
            espacoAtual.textContent = letra || "";
          }
        }

        let proximaPosicao = posicaoInserir + 1;

        if (proximaPosicao >= intervaloFim) {
          proximaPosicao = intervaloInicio;
        }

        while (
          proximaPosicao < intervaloFim &&
          arrayPalavraAtual[proximaPosicao % 5] !== null
        ) {
          proximaPosicao++;
        }

        if (proximaPosicao >= intervaloFim) {
          proximaPosicao = intervaloInicio;
          while (
            proximaPosicao < intervaloInicio + 5 &&
            arrayPalavraAtual[proximaPosicao % 5] !== null
          ) {
            proximaPosicao++;
          }
        }

        if (
          proximaPosicao >= intervaloFim ||
          arrayPalavraAtual[proximaPosicao % 5] !== null
        ) {
          proximaPosicao = Math.min(intervaloFim - 1, espacoDisponivel - 1);
        }

        espacoDisponivel = proximaPosicao + 1;

        destacarQuadrado(espacoDisponivel);
      }
    }
  }

  function atualizarTeclado(letra, cores) {
    const teclaElemento = document.getElementById(letra);

    if (teclaElemento) {
      teclaElemento.querySelector(".top-left").style.backgroundColor = cores[0];
      teclaElemento.querySelector(".top-right").style.backgroundColor =
        cores[1];
      teclaElemento.querySelector(".bottom-left").style.backgroundColor =
        cores[2];
      teclaElemento.querySelector(".bottom-right").style.backgroundColor =
        cores[3];
    } else {
      console.error(`Tecla com ID "${letra}" não encontrada.`);
    }
  }

  function obterCorTeclado(letra) {
    let cores = ["#3a3a3c", "#3a3a3c", "#3a3a3c", "#3a3a3c"];

    palavras.forEach((palavra, index) => {
      if (palavra.includes(letra)) {
        const palavraAtual = getArrayPalavraAtual();
        const posicao = palavra.indexOf(letra);
        const acertouPosicao = palavraAtual[posicao] === letra;
        cores[index] = acertouPosicao ? "#538d4e" : "#b59f3b"; // Verde ou Amarelo
      }
    });

    return cores;
  }

  function obterCorDoQuadrado(letra, indice, palavra) {
    const palavraCorreta = palavras[palavra];
    const arrayPalavraAtual = getArrayPalavraAtual();
    const ocorrenciasNaPalavra = palavraCorreta.split(letra).length - 1;

    let verdes = 0;
    let usadas = 0;

    for (let i = 0; i < 5; i++) {
      if (
        arrayPalavraAtual[i] === palavraCorreta.charAt(i) &&
        arrayPalavraAtual[i] === letra
      ) {
        verdes++;
      }
    }

    for (let i = 0; i < indice; i++) {
      if (arrayPalavraAtual[i] === letra) {
        if (
          obterCorDoQuadrado(arrayPalavraAtual[i], i, palavra) !==
          "rgb(58, 58, 60)"
        ) {
          usadas++;
        }
      }
    }

    if (letra === palavraCorreta.charAt(indice)) {
      return "rgb(83, 141, 78)"; // Verde
    }

    if (ocorrenciasNaPalavra > verdes + usadas) {
      return "rgb(181, 159, 59)"; // Amarelo
    }

    return "rgb(58, 58, 60)"; // Cinza
  }

  const itemCounter = (value, index) => {
    return value.filter((x) => x == index).length;
  };

  function enviarPalavra() {
    bloquearClique = true;
    arrayPalavraAtual = getArrayPalavraAtual();
    if (arrayPalavraAtual.length !== 5) {
      bloquearClique = false;
      return;
    }

    const palavraAtual = arrayPalavraAtual.join("");

    fetch("/palavraValida", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ palavra: palavraAtual }),
    })
      .then((response) => response.json())
      .then((data) => {
        let valido = false;
        for (var i = 0; i < quantasPalavras; i++) {
          if (palavras[i] == palavraAtual) {
            valido = true;
          }
        }
        if (data.resposta === true || valido) {
          const primeiroIdLetra = contadorPalavrasAdivinhadas * 5 + 1;

          ocorrênciasResposta = [
            itemCounter(arrayResposta, arrayResposta[0]),
            itemCounter(arrayResposta, arrayResposta[1]),
            itemCounter(arrayResposta, arrayResposta[2]),
            itemCounter(arrayResposta, arrayResposta[3]),
            itemCounter(arrayResposta, arrayResposta[4]),
          ];
          ocorrênciasResposta2 = [
            itemCounter(arrayResposta2, arrayResposta2[0]),
            itemCounter(arrayResposta2, arrayResposta2[1]),
            itemCounter(arrayResposta2, arrayResposta2[2]),
            itemCounter(arrayResposta2, arrayResposta2[3]),
            itemCounter(arrayResposta2, arrayResposta2[4]),
          ];
          ocorrênciasResposta3 = [
            itemCounter(arrayResposta3, arrayResposta3[0]),
            itemCounter(arrayResposta3, arrayResposta3[1]),
            itemCounter(arrayResposta3, arrayResposta3[2]),
            itemCounter(arrayResposta3, arrayResposta3[3]),
            itemCounter(arrayResposta3, arrayResposta3[4]),
          ];
          ocorrênciasResposta4 = [
            itemCounter(arrayResposta4, arrayResposta4[0]),
            itemCounter(arrayResposta4, arrayResposta4[1]),
            itemCounter(arrayResposta4, arrayResposta4[2]),
            itemCounter(arrayResposta4, arrayResposta4[3]),
            itemCounter(arrayResposta4, arrayResposta4[4]),
          ];
          ocorrêciasRespostas = [
            ocorrênciasResposta,
            ocorrênciasResposta2,
            ocorrênciasResposta3,
            ocorrênciasResposta4,
          ];

          for (var k = 0; k < quantasPalavras; k++) {
            arrayPalavraAtual.forEach((letra, indice) => {
              const corQuadrado = obterCorDoQuadrado(letra, indice, k);
              const idLetra = primeiroIdLetra + indice;
              const elementoLetra = document.querySelector(
                `.board${k} #q${idLetra}`
              );
              const cores = obterCorTeclado(letra, [
                palavra,
                palavra2,
                palavra3,
                palavra4,
              ]);
              if (elementoLetra != null) {
                elementoLetra.classList.add("animate__flipInX");
                elementoLetra.style.backgroundColor = corQuadrado;
                elementoLetra.style.borderColor = corQuadrado;
                atualizarTeclado(letra, cores);
              }
            });
          }

          contadorPalavrasAdivinhadas += 1;

          if (palavrasAdivinhadas.length === 5 + quantasPalavras && !valido) {
            respostas = "";
            for (var i = 0; i < quantasPalavras; i++) {
              respostas += palavras[i] + " ";
            }
            document.getElementById(
              "palavrasCertas"
            ).textContent = `Você não tem mais tentativas, a resposta era ${respostas}`;
            mostrarDerrota();
          }

          palavrasAdivinhadas.push([]);

          for (var i = 0; i < quantasPalavras; i++) {
            if (!palavrasAcertadas[i] && palavraAtual === palavras[i]) {
              acertos++;
              palavrasAcertadas[i] = true; 
              boards = document.querySelectorAll("#board");
              boards[i].classList.remove("board" + i);

              if (acertos == quantasPalavras) {
                animacaoVitoria();
                bloquearClique = true;
              }
              break; 
            }
          }

          if (contadorPalavrasAdivinhadas < 5 + quantasPalavras) {
            espacoDisponivel = 1 + contadorPalavrasAdivinhadas * 5;
            destacarQuadrado(espacoDisponivel);
            document
              .querySelectorAll(".square")
              .forEach((square) => square.classList.remove("current-line"));

            for (
              let i = contadorPalavrasAdivinhadas * 5;
              i < contadorPalavrasAdivinhadas * 5 + 5;
              i++
            ) {
              const quadrados = document.querySelectorAll(`#q${i + 1}`);
              quadrados.forEach((quadrado) =>
                quadrado.classList.add("current-line")
              );
            }
          }
        } else {
          showStatusBar("Palavra inválida", 2000);
        }

        if (acertos < quantasPalavras) {
          bloquearClique = false;
        }
      });
  }

  function criarQuadrados() {
    const containerQuadroJogo = document.getElementById("board-container");

    for (let j = 0; j < quantasPalavras; j++) {
      containerQuadroJogo.innerHTML += `<div id="board" class="board${j}"></div>`;
      let quadroJogo = document.querySelector(".board" + j);

      for (let indice = 0; indice < 30 + (quantasPalavras - 1) * 5; indice++) {
        let quadrado = document.createElement("div");
        quadrado.classList.add("square");
        quadrado.classList.add("animate__animated");
        quadrado.setAttribute("id", "q" + parseInt(indice + 1));

        if (indice < 5) {
          quadrado.classList.add("current-line");
        }

        quadroJogo.appendChild(quadrado);
      }
    }
  }

  function deletarLetra() {
    const arrayPalavraAtual = getArrayPalavraAtual();
    if (!arrayPalavraAtual || espacoDisponivel <= 0) {
      return;
    }

    const intervaloInicio = contadorPalavrasAdivinhadas * 5 + 1;
    let posicaoDeletar = espacoDisponivel - 1;

    if (arrayPalavraAtual[posicaoDeletar % 5] === null) {
      if (posicaoDeletar === intervaloInicio - 1) {
        // Já está no primeiro quadrado e está vazio, não faz nada
        return;
      } else {
        posicaoDeletar--;
        if (arrayPalavraAtual[posicaoDeletar % 5] !== null) {
          arrayPalavraAtual[posicaoDeletar % 5] = null;
        }
      }
    } else {
      arrayPalavraAtual[posicaoDeletar % 5] = null;
    }

    for (let i = 0; i < quantasPalavras; i++) {
      const idQuadrado = posicaoDeletar + 1;
      const elementoLetra = document.querySelector(
        `.board${i} #q${idQuadrado}`
      );
      if (elementoLetra) {
        elementoLetra.textContent = "";
      }
    }

    if (posicaoDeletar >= intervaloInicio) {
      espacoDisponivel = Math.max(intervaloInicio, posicaoDeletar + 1);
    } else {
      espacoDisponivel = intervaloInicio;
    }

    destacarQuadrado(espacoDisponivel);
  }

  function destacarQuadrado(idQuadrado) {
    document.querySelectorAll(".square").forEach((square) => {
      square.classList.remove("highlight");
    });

    for (let i = 0; i < quantasPalavras; i++) {
      const elementoQuadrado = document.querySelector(
        `.board${i} #q${idQuadrado}`
      );
      if (elementoQuadrado) {
        elementoQuadrado.classList.add("highlight");
      }
    }
  }

  function moverCursor(direcao) {
    const arrayPalavraAtual = getArrayPalavraAtual();
    if (!arrayPalavraAtual || espacoDisponivel <= 0) {
      return;
    }

    const intervaloInicio = contadorPalavrasAdivinhadas * 5 + 1;
    const intervaloFim = intervaloInicio + 4;
    let posicaoAtual = espacoDisponivel - 1;

    if (direcao === "esquerda") {
      posicaoAtual--;
      if (posicaoAtual + 2 <= intervaloInicio) {
        posicaoAtual = intervaloFim - 1;
      }
    } else if (direcao === "direita") {
      posicaoAtual++;
      if (posicaoAtual + 1 > intervaloFim) {
        posicaoAtual = intervaloInicio - 1;
      }
    }

    espacoDisponivel = posicaoAtual + 1;
    destacarQuadrado(espacoDisponivel);
  }

  document.addEventListener("keydown", (evento) => {
    const tecla = evento.key.toLowerCase();
    const botao = document.querySelector(`button[data-key="${tecla}"]`);

    if (bloquearClique) {
      return;
    }

    if (
      botao ||
      tecla === "backspace" ||
      tecla == "arrowright" ||
      tecla == "arrowleft"
    ) {
      if (tecla === "enter") {
        enviarPalavra();
        return;
      }

      if (tecla === "del" || tecla === "backspace") {
        deletarLetra();
        return;
      }
      if (tecla == "arrowleft") {
        moverCursor("esquerda");
        return;
      }

      if (tecla === "arrowright") {
        moverCursor("direita");
        return;
      }

      atualizarPalavrasAdivinhadas(tecla);
    }
  });

  for (let i = 0; i < teclas.length; i++) {
    teclas[i].onclick = (event) => {
      let target = event.target;
      if (target.tagName !== "BUTTON") {
        target = target.closest("button");
      }
      const letra = target.getAttribute("data-key");

      if (bloquearClique) {
        return;
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

  document
    .getElementById("board-container")
    .addEventListener("click", (event) => {
      if (event.target.classList.contains("square")) {
        const idQuadrado = event.target.getAttribute("id");
        const numeroQuadrado = parseInt(idQuadrado.replace("q", ""));
        if (
          numeroQuadrado > contadorPalavrasAdivinhadas * 5 &&
          numeroQuadrado < contadorPalavrasAdivinhadas * 5 + 6
        ) {
          espacoDisponivel = numeroQuadrado;
          destacarQuadrado(espacoDisponivel);
        }
      }
    });
});
