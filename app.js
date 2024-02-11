document.getElementById('iniciarJuego').addEventListener('click', iniciarJuego);
let turnos = 0;
const numerosSacados = [];
const jugadores = [];
let tamanoCarton;

function iniciarJuego() {
    tamanoCarton = parseInt(document.getElementById('tamanoCarton').value);
    if (tamanoCarton < 3 || tamanoCarton > 5 || isNaN(tamanoCarton) ) {
        alert("Por favor, ingresa un tamaño de cartón entre 3 y 5.");
        return; 
    }

    document.getElementById('configuracion').style.display = 'none';
    document.getElementById('juego').style.display = 'block';
    jugadores.length = 0;

    for (let i = 1; i <= 4; i++) {
        const nombre = document.getElementById(`jugador${i}`).value || `Jugador ${i}`;
        jugadores.push({
            nombre: nombre,
            carton: generarCarton(tamanoCarton),
            puntaje: 0,
        });
    }

    mostrarCartones();
    document.getElementById('sacarNumero').addEventListener('click', sacarNumero);
}


function generarCarton(tamano) {
    let carton = [];
    let numerosDisponibles = Array.from({ length: 50 }, (_, i) => i + 1);

    for (let i = 0; i < tamano; i++) {
        let fila = [];
        for (let j = 0; j < tamano; j++) {
            const indiceAleatorio = Math.floor(Math.random() * numerosDisponibles.length);
            fila.push({
                numero: numerosDisponibles[indiceAleatorio],
                marcado: false, 
            });
            numerosDisponibles.splice(indiceAleatorio, 1);
        }
        carton.push(fila);
    }
    return carton;
}




function mostrarCartones() {
    const contenedorCartones = document.getElementById('cartones');
    contenedorCartones.innerHTML = ''; 

    jugadores.forEach(jugador => {
        const divCarton = document.createElement('div');
        divCarton.classList.add('carton');
        divCarton.style.gridTemplateColumns = `repeat(${tamanoCarton}, 1fr)`;
        divCarton.style.gridTemplateRows = `repeat(${tamanoCarton}, 1fr)`;

        const nombreJugador = document.createElement('div');
        nombreJugador.classList.add('nombreJugador');
        nombreJugador.textContent = jugador.nombre;
        divCarton.appendChild(nombreJugador);

        jugador.carton.forEach(fila => {
            fila.forEach(casilla => {
                const divCasilla = document.createElement('div');
                divCasilla.classList.add('casilla');
                divCasilla.textContent = casilla.numero;
                if (casilla.marcado) {
                    divCasilla.classList.add('marcada');
                }
                divCarton.appendChild(divCasilla);
            });
        });

        contenedorCartones.appendChild(divCarton);
    });
}



function sacarNumero() {
    if (turnos >= 25) {
        alert('El juego ha terminado por máximo de turnos alcanzados.');
        mostrarPuntajesFinales(); 
        return;
    }
    const numeroAleatorio = Math.floor(Math.random() * 50) + 1;
    if (!numerosSacados.includes(numeroAleatorio)) {
        numerosSacados.push(numeroAleatorio);
        document.getElementById('numeroActual').textContent = `Número Actual: ${numeroAleatorio}`;
        marcarCartones(numeroAleatorio);
        turnos++;
        document.getElementById('contadorTurnos').textContent = turnos;
        if (verificarGanador()) {
            alert('Tenemos un ganador!');
            mostrarPuntajesFinales(); 
            document.getElementById('sacarNumero').disabled = true; 
        }
    } else {
        sacarNumero();
    }
}



function marcarCartones(numero) {
    jugadores.forEach(jugador => {
        jugador.carton.forEach(fila => {
            fila.forEach(casilla => {
                if (casilla.numero === numero) {
                    casilla.marcado = true;
                }
            });
        });
        jugador.puntaje = calcularPuntaje(jugador.carton);
    });
    mostrarCartones(); 
    if (verificarGanador() || turnos >= 25) {
        mostrarPuntajesFinales();
        document.getElementById('sacarNumero').disabled = true;
        if (turnos >= 25) {
            alert('El juego ha terminado por máximo de turnos alcanzados.');
        } else {
            alert('Tenemos un ganador!');
        }
    }
}


function verificarGanador() {
    let ganador = false;
    let puntajeMaximo = 0;

    // Calcular el puntaje máximo basado en el tamaño del cartón
    const tamano = jugadores[0].carton.length;
    puntajeMaximo += 5; // Cartón lleno
    puntajeMaximo += tamano * 2; // Líneas horizontales y verticales
    puntajeMaximo += (tamano === 3 || tamano === 5) ? 6 : 0; // Líneas diagonales solo si es posible tener dos

    // Verificar si algún jugador ha alcanzado el puntaje máximo o tiene cartón lleno
    jugadores.forEach(jugador => {
        if (jugador.puntaje === puntajeMaximo || esCartonLleno(jugador.carton)) {
            ganador = true;
        }
    });

    return ganador;
}

function esCartonLleno(carton) {
    // Verificar si todas las casillas del cartón están marcadas
    for (let i = 0; i < carton.length; i++) {
        for (let j = 0; j < carton[i].length; j++) {
            if (!carton[i][j].marcado) {
                return false; // Encontró una casilla no marcada, por lo tanto, no es cartón lleno
            }
        }
    }
    return true; // Todas las casillas están marcadas, es cartón lleno
}


function calcularPuntaje(carton) {
    let puntaje = 0;
    let tamano = carton.length;
    let diagonalPrincipalMarcada = true;
    let diagonalSecundariaMarcada = true;

    for (let i = 0; i < tamano; i++) {
        let lineaHorizontalMarcada = true;
        let lineaVerticalMarcada = true;

        for (let j = 0; j < tamano; j++) {
            if (!carton[i][j].marcado) {
                lineaHorizontalMarcada = false;
            }
            if (!carton[j][i].marcado) {
                lineaVerticalMarcada = false;
            }
        }
        if (lineaHorizontalMarcada) {
            puntaje += 1;
        }
        if (lineaVerticalMarcada) {
            puntaje += 1;
        }

        // Verificar diagonales
        if (!carton[i][i].marcado) {
            diagonalPrincipalMarcada = false;
        }
        if (!carton[i][tamano - 1 - i].marcado) {
            diagonalSecundariaMarcada = false;
        }
    }
    if (diagonalPrincipalMarcada) {
        puntaje += 3;
    }
    if (diagonalSecundariaMarcada) {
        puntaje += 3;
    }
    if (esCartonLleno(carton)) {
        puntaje += 5;
    }
    return puntaje;
}

function esCartonLleno(carton) {
    for (let i = 0; i < carton.length; i++) {
        for (let j = 0; j < carton[i].length; j++) {
            if (!carton[i][j].marcado) {
                return false;
            }
        }
    }
    return true;
}

function mostrarPuntajesFinales() {
    let contenidoPuntajes = ""; // Asumimos que el título ya está en el HTML del modal
    let maxPuntaje = Math.max(...jugadores.map(jugador => jugador.puntaje));
    let ganadores = jugadores.filter(jugador => jugador.puntaje === maxPuntaje);

    // Construir el contenido de puntajes para cada jugador
    jugadores.forEach(jugador => {
        // Ajustar la palabra "punto/puntos" basado en el puntaje
        let textoPuntos = jugador.puntaje === 1 ? "punto" : "puntos";
        contenidoPuntajes += `<p>${jugador.nombre}: ${jugador.puntaje} ${textoPuntos}</p>`;
    });

    // Agregar el ganador o los ganadores al contenido
    if (ganadores.length === 1) {
        let textoPuntosGanador = maxPuntaje === 1 ? "punto" : "puntos";
        contenidoPuntajes += `<p><strong>El ganador es: ${ganadores[0].nombre} con ${maxPuntaje} ${textoPuntosGanador}! 🏆</strong></p>`;
    } else {
        let textoPuntosGanador = maxPuntaje === 1 ? "punto" : "puntos";
        contenidoPuntajes += `<p><strong>Tenemos un empate entre ${ganadores.map(g => g.nombre).join(', ')} con ${maxPuntaje} ${textoPuntosGanador} cada uno! 🏆</strong></p>`;
    }

    // Actualizar el contenido del modal y mostrarlo
    document.getElementById('contenidoPuntajes').innerHTML = contenidoPuntajes;
    document.getElementById('modalPuntajes').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function() {
    // Añadir evento de clic al botón "Jugar de nuevo"
    document.getElementById('jugarDeNuevo').addEventListener('click', function() {
        window.location.reload(); // Recarga la página para reiniciar el juego
    });
});

function reiniciarJuego() {
    // Restablece las variables del juego
    turnos = 0;
    numerosSacados = [];
    jugadores = []; // Asegúrate de actualizar esta lógica conforme a tu implementación específica
    // Limpia y regenera los elementos del DOM necesarios
    document.getElementById('numeroActual').textContent = '';
    document.getElementById('contadorTurnos').textContent = '0';
    // Reinicia la configuración y visualización de los cartones, etc.
    iniciarJuego(); // Suponiendo que tienes una función que inicializa el juego
}

// Modificar el evento del botón Jugar de Nuevo para llamar a reiniciarJuego
document.getElementById('jugarDeNuevo').addEventListener('click', function() {
    reiniciarJuego(); 
});

document.addEventListener('DOMContentLoaded', function() {
    // Evento para volver al registro sin recargar la página
    document.getElementById('volverAlRegistro').addEventListener('click', function() {
        // Ocultar sección del juego
        document.getElementById('juego').style.display = 'none';
        
        // Mostrar sección de configuración/registro
        document.getElementById('configuracion').style.display = 'block';
    });
});












