document.getElementById('iniciarJuego').addEventListener('click', iniciarJuego);
let turnos = 0;
const numerosSacados = [];
const jugadores = [];
let tamanoCarton;

function iniciarJuego() {
    tamanoCarton = parseInt(document.getElementById('tamanoCarton').value);
    if (tamanoCarton < 3 || tamanoCarton > 5 || isNaN(tamanoCarton)) {
        alert("Por favor, ingresa un tamaño de cartón entre 3 y 5.");
        return;
    }

    const nombresJugadores = [];
    for (let i = 1; i <= 4; i++) {
        let nombre = document.getElementById(`jugador${i}`).value.trim();
        if (!nombre) {
            alert(`Por favor, ingresa el nombre del Jugador ${i}.`);
            return; 
        }
        nombresJugadores.push(nombre);
    }

    const nombresUnicos = new Set(nombresJugadores);
    if (nombresUnicos.size !== nombresJugadores.length) {
        alert("Por favor, asegúrate de que todos los jugadores tengan nombres únicos.");
        return; 
    }
    document.getElementById('configuracion').style.display = 'none';
    document.getElementById('juego').style.display = 'block';
    jugadores.length = 0;

    nombresJugadores.forEach((nombre, index) => {
        jugadores.push({
            nombre: nombre,
            carton: generarCarton(tamanoCarton),
            puntaje: 0,
        });
    });

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
    return true; // si todas las casillas están marcadas, es cartón lleno
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
    let contenidoPuntajes = "";
    let maxPuntaje = Math.max(...jugadores.map(jugador => jugador.puntaje));
    let ganadores = jugadores.filter(jugador => jugador.puntaje === maxPuntaje);

    jugadores.forEach(jugador => {
        let textoPuntos = jugador.puntaje === 1 ? "punto" : "puntos";
        contenidoPuntajes += `<p>${jugador.nombre}: ${jugador.puntaje} ${textoPuntos}</p>`;
    });

    if (ganadores.length === 1) {
        let textoPuntosGanador = maxPuntaje === 1 ? "punto" : "puntos";
        contenidoPuntajes += `<p><strong>El ganador es: ${ganadores[0].nombre} con ${maxPuntaje} ${textoPuntosGanador}! 🏆</strong></p>`;
    } else {
        let textoPuntosGanador = maxPuntaje === 1 ? "punto" : "puntos";
        contenidoPuntajes += `<p><strong>Tenemos un empate entre ${ganadores.map(g => g.nombre).join(', ')} con ${maxPuntaje} ${textoPuntosGanador} cada uno! 🏆</strong></p>`;
    }
    document.getElementById('contenidoPuntajes').innerHTML = contenidoPuntajes;
    document.getElementById('modalPuntajes').style.display = 'block';
    actualizarPuntajes(jugadores);
    mostrarRanking();
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('jugarDeNuevo').addEventListener('click', function() {
        window.location.reload();
    });
});

function reiniciarJuego() {
    turnos = 0;
    numerosSacados = [];
    jugadores = [];
    document.getElementById('numeroActual').textContent = '';
    document.getElementById('contadorTurnos').textContent = '0';
    iniciarJuego(); 
}

document.getElementById('jugarDeNuevo').addEventListener('click', function() {
    reiniciarJuego(); 
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('volverAlRegistro').addEventListener('click', function() {
        document.getElementById('juego').style.display = 'none';
        document.getElementById('configuracion').style.display = 'block';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var closeModalButton = document.querySelector('.close-modal');
    if (closeModalButton) {
        closeModalButton.addEventListener('click', function() {
            document.getElementById('modalPuntajes').style.display = 'none';
        });
    }
});

document.body.addEventListener('click', function(event) {
    if (event.target.classList.contains('close-modal')) {
        document.getElementById('modalPuntajes').style.display = 'none';
    }
});

document.getElementById('volverAlRegistro').addEventListener('click', function() {
    const confirmacion = confirm("¿Estás seguro de que deseas volver al registro y reiniciar los puntajes y nombres? Si aceptas, todos los datos actuales se perderán.");
    
    if (confirmacion) {
        window.location.reload();
    }
});

document.getElementById('jugarDeNuevo').addEventListener('click', function() {
    const confirmacion = confirm("¿Estás seguro de que deseas jugar de nuevo y reiniciar los puntajes y nombres? Si aceptas, todos los datos actuales se perderán.");
    
    if (confirmacion) {
        window.location.reload();
    }
    
});

document.addEventListener('DOMContentLoaded', function() {
    mostrarRanking();
});

function actualizarPuntajes(jugadores) {
    let puntajes = JSON.parse(localStorage.getItem('puntajesBingo')) || {};

    jugadores.forEach(jugador => {
        if (puntajes[jugador.nombre]) {
            puntajes[jugador.nombre] += jugador.puntaje;
        } else {
            puntajes[jugador.nombre] = jugador.puntaje;
        }
    });
    localStorage.setItem('puntajesBingo', JSON.stringify(puntajes));
}

function mostrarRanking() {
    let puntajes = JSON.parse(localStorage.getItem('puntajesBingo')) || {};
    let entradasPuntajes = Object.entries(puntajes);
    entradasPuntajes.sort((a, b) => b[1] - a[1]);
    let htmlRanking = entradasPuntajes.map(([nombre, puntaje]) => `<p>${nombre}: ${puntaje} puntos</p>`).join('');
    document.getElementById('contenidoRanking').innerHTML = htmlRanking;
}

document.getElementById('mostrarRankingBtn').addEventListener('click', function() {
    document.getElementById('modalRanking').style.display = 'block';
    mostrarRanking();
});

document.querySelector('.cerrarModalRanking').addEventListener('click', function() {
    document.getElementById('modalRanking').style.display = 'none';
});

