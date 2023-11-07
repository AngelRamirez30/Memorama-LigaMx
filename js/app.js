const cartas = document.querySelectorAll(".carta");

let VueltaPrimeraCarta = false;
let tableroBloqueado = false;
let primeraCarta, segundaCarta;

let startTime;
let timerInterval;
let elapsedTime = 0;

let intentos = 0;
let juegoIniciado = false;

let url = "https://memoramaligamx-default-rtdb.firebaseio.com/";

const jugar = document.querySelector(".jugar");
const memorama = document.querySelector(".memorama");
const temporizadorElement = document.getElementById("temporizador");
const numIntentos = document.getElementById("numIntentos");

const pageUrl = window.location.href;
const parts = pageUrl.split("/");
const fileName = parts[parts.length - 1];

async function consultarAsync() {
  try {
    const response4x3 = await fetch(`${url}/jugadores/4x3.json`);
    const response4x4 = await fetch(`${url}/jugadores/4x4.json`);
    const response4x5 = await fetch(`${url}/jugadores/4x5.json`);

    const jugadores4x3 = await response4x3.json();
    const jugadores4x4 = await response4x4.json();
    const jugadores4x5 = await response4x5.json();

    console.log(jugadores4x3)

    const ordenado4x3 = ordenarRankPorTiempo(jugadores4x3);
    const ordenado4x4 = ordenarRankPorTiempo(jugadores4x4);
    const ordenado4x5 = ordenarRankPorTiempo(jugadores4x5);

    console.log(ordenado4x3);

    renderTable( ordenado4x3, "alumnosTable");
    renderTable( ordenado4x4, "alumnosTable2");
    renderTable( ordenado4x5, "alumnosTable3");
  } catch (error) {
    console.error("Ha ocurrido un error: ", error);
  }
}

window.onload = function () {
  if (fileName === "rank.html") {
    consultarAsync();
  }
};

function ordenarRankPorTiempo(data) {
  // Convertir los valores del objeto en un arreglo
  const objetosArray = Object.values(data);

  // Crear un mapa para rastrear los objetos por nombre
  const objetosPorNombre = {};

  objetosArray.forEach(obj => {
    const nombre = obj.nombre;
    
    if (!objetosPorNombre[nombre]) {
      objetosPorNombre[nombre] = obj;
    } else {
      // Si ya existe un objeto con el mismo nombre, comparar y actualizar solo si es más rápido
      if (parseFloat(obj.tiempo) < parseFloat(objetosPorNombre[nombre].tiempo)) {
        objetosPorNombre[nombre] = obj;
      }
    }
  });

  // Ordenar los objetos por tiempo
  const objetosOrdenados = Object.values(objetosPorNombre).sort((a, b) => {
    return parseFloat(a.tiempo) - parseFloat(b.tiempo);
  });

  return objetosOrdenados;
}

function renderTable(data, tablaId) {
  let tbody = document.getElementById(tablaId);
  let rowHTML = "";
  let rank = 1;

  Object.keys(data).forEach((key) => {
    rowHTML += `<tr>
      <td>${rank}</td>
      <td>${data[key].nombre}</td>
      <td>${data[key].tiempo}</td>
      <td>${data[key].intentos}</td>
      
    </tr>`;
    rank++;
  });

  tbody.innerHTML = rowHTML;
}

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
  intentos++;
  numIntentos.textContent = `Intentos: ${intentos}`;
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
  verificarVictoria();
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

function updateTimer() {
  const currentTime = Date.now();
  elapsedTime = currentTime - startTime;

  // Formatear el tiempo en formato 0.00
  const formattedTime = (elapsedTime / 1000).toFixed(2);

  // Mostrar el tiempo en un elemento HTML (por ejemplo, un elemento con el ID "timer-display")
  temporizadorElement.innerHTML = formattedTime;
}

function startTimer() {
  if (!timerInterval) {
    elapsedTime = 0;
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateTimer, 10); // Actualiza cada 10 milisegundos
  }
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;

    // Formatear el tiempo en formato 0.00 y mostrarlo en el elemento HTML
    const formattedTime = (elapsedTime / 1000).toFixed(2);
    temporizadorElement.textContent = formattedTime;
  }
}

function comenzarJuego() {
  const mensajeVictoria = document.getElementById("mensajeVictoria");
  mensajeVictoria.style.display = "none";
  cartas.forEach((carta) => {
    carta.classList.remove("par");
    carta.classList.remove("dada_vuelta");
  });
  const nombre = document.getElementById("nombre");
  if (nombre.value.trim() != "") {
    if (juegoIniciado == false) {
      nombre.disabled = true;
      juegoIniciado = true;
      desordenarCartas();
      memorama.classList.remove("bloqueo");
      startTimer();
      jugar.classList.add("reiniciar");
      jugar.textContent = "Reiniciar";
      intentos = 0;
      numIntentos.textContent = `Intentos: ${intentos}`;
    } else {
      console.log("entre");
      nombre.disabled = false;
      juegoIniciado = false;
      stopTimer();
      temporizadorElement.textContent = "0.00";
      desordenarCartas();
      memorama.classList.add("bloqueo");
      jugar.classList.remove("reiniciar");
      jugar.textContent = "Jugar";
      intentos = 0;
      numIntentos.textContent = `Intentos: ${intentos}`;
    }
  }
}
function verificarVictoria() {
  const cartasEmparejadas = document.querySelectorAll(".carta.par");
  if (cartasEmparejadas.length === cartas.length) {
    stopTimer();
    añadirRank();
    const mensajeVictoria = document.getElementById("mensajeVictoria");
    mensajeVictoria.style.display = "block";
  }
}

async function añadirRank() {
  const nombre = document.getElementById("nombre").value;
  const lvl =
    fileName === "index.html" ? "4x3" : fileName === "4x4.html" ? "4x4" : "4x5";
  const jugador = {
    nombre,
    tiempo: (elapsedTime / 1000).toFixed(2),
    intentos,
  };
  const json = JSON.stringify(jugador);
  const config = {
    method: "POST",
    body: json,
    headers: { "Contend-type": "application/json; charset=UTF-8" },
  };
  try {
    await fetch(`${url}/jugadores/${lvl}.json`, config);
  } catch (error) {
    console.error("Error", error);
  }
}

jugar.addEventListener("click", comenzarJuego);
cartas.forEach((carta) => carta.addEventListener("click", darVueltaCarta));
