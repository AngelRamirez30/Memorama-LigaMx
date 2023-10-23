const cartas = document.querySelectorAll(".carta");

let VueltaPrimeraCarta = false;
let tableroBloqueado = false;
let primeraCarta, segundaCarta;

function darVueltaCarta() {
  if (tableroBloqueado) return;
  if (this === primeraCarta) return;

  this.classList.add("dada_vuelta");

  if (!VueltaPrimeraCarta) {
    VueltaPrimeraCarta = true;
    primeraCarta = this;
    return;
  }

  segundaCarta = this;
  verificarPar();
}

function verificarPar() {
  if (
    primeraCarta.querySelector("img").src ===
    segundaCarta.querySelector("img").src
  ) {
    deshabilitarCartas();
  } else {
    voltearCartas();
  }
}

function deshabilitarCartas() {
  primeraCarta.classList.add("par");
  segundaCarta.classList.add("par");

  resetearTablero();
}

function voltearCartas() {
  tableroBloqueado = true;

  setTimeout(() => {
    primeraCarta.classList.remove("dada_vuelta");
    segundaCarta.classList.remove("dada_vuelta");

    resetearTablero();
  }, 1000);
}

function resetearTablero() {
  [VueltaPrimeraCarta, tableroBloqueado] = [false, false];
  [primeraCarta, segundaCarta] = [null, null];
}

document.addEventListener("DOMContentLoaded", desordenarCartas);

function desordenarCartas() {
  // Obtén el contenedor y las tarjetas
  const arrayCartas = Array.from(cartas);

  // Guarda el contenido original de las tarjetas en un array
  const contenidoOriginal = arrayCartas.map((carta) => carta.innerHTML);

  // Función para reorganizar el contenido aleatoriamente
  function revolverCartas(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Reorganiza el contenido aleatoriamente
  revolverCartas(contenidoOriginal);

  // Asigna el contenido reorganizado a las tarjetas
  arrayCartas.forEach((carta, index) => {
    carta.innerHTML = contenidoOriginal[index];
  });
}

cartas.forEach((carta) => carta.addEventListener("click", darVueltaCarta));
