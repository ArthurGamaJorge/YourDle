let resizeTimer; // impede animação css durante mudança no tamanho de janela
window.addEventListener("resize", () => {
  document.body.classList.add("resize-animation-stopper");
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.body.classList.remove("resize-animation-stopper");
  }, 400);
});

let mostrarInfo = () => {
  document.getElementById("divInfo").classList.toggle('aberto')
}

let mostrarVitoria = () => {
  document.getElementById("divVitoria").classList.toggle('abriu')
}

let mostrarDerrota = () => {
  document.getElementById("divDerrota").classList.toggle('abrir')
}

let statusBarIsVisible = false; 

function showStatusBar(message, duration) {
  console.log(message)
  const statusBar = document.getElementById('status-bar');
  
  if (statusBarIsVisible) {
    return;
  }

  statusBar.innerText = message;

  statusBarIsVisible = true;
  statusBar.classList.remove('hide');
  statusBar.classList.add('show');
  statusBar.style.display = 'block'; 

  setTimeout(() => {
    statusBar.classList.remove('show');
    statusBar.classList.add('hide');

    setTimeout(() => {
      statusBar.style.display = 'none';
      statusBarIsVisible = false;
    }, 500); 
  }, duration);
}

let fecharDivs = () => {
  document.getElementById("divInfo")?.classList.remove('aberto')
  document.getElementById("divVitoria")?.classList.remove('abriu')
  document.getElementById("divDerrota")?.classList.remove('abrir')
}

let animacaoVitoria = () =>{
  mostrarVitoria()

  let params = {
    particleCount: 700, 
    spread: 110, 
    startVelocity: 70,
    origin: { x: 0.5, y: 0.5 }, 
    angle: 90 
  };

  if (window.innerWidth > 800) {
    params.origin = { x: 0, y: 0.5 }; 
    params.angle = 45; 

    confetti(params);

    params.origin.x = 1; 
    params.angle = 135;  
  } else {
    params.particleCount = 200; 
    params.startVelocity = 60;
    params.spread = 40; 

    let steps = 5; 
    for (let i = 0; i <= steps; i++) {
      params.origin = { x: i / steps, y: 1.1 }; 
      params.angle = 90; 
      confetti(params);
    }
  }

  // Lançar confetti
  confetti(params);
}