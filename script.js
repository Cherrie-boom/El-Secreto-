// Variables globales del juego
let jugador = "";
let vidas = 3;
let nivel = 1;
let puntos = 0;
let companero = null;
let malo = null;
let historia = "";
let juegoActivo = true;

// Elementos del DOM
const container = document.getElementById("gameContainer");

// Función para reproducir sonidos
function playSound(type) {
    try {
        if (type === "correct") {
            const sound = document.getElementById("correctSound");
            if (sound) sound.play().catch(e => console.log("Error al reproducir sonido"));
        } else if (type === "wrong") {
            const sound = document.getElementById("wrongSound");
            if (sound) sound.play().catch(e => console.log("Error al reproducir sonido"));
        }
    } catch(e) {
        console.log("Sonido no disponible");
    }
}

// Función para mostrar la pantalla de bienvenida
function mostrarBienvenida() {
    container.innerHTML = `
        <div class="welcome-screen">
            <h1>🌲 El Bosque de las Sombras 🌲</h1>
            <img src="https://i.pinimg.com/736x/2c/5f/9d/2c5f9d8c4e3a2b1d9f7e6d5c4b3a2f1e.jpg" alt="Bosque Misterioso" 
                 onerror="this.src='https://placehold.co/400x250/2c5a2a/ffd700?text=Bosque+Mágico'">
            <h2>✨ ¡Bienvenido a la aventura, valiente viajero! ✨</h2>
            <p>¿Cuál es tu nombre, héroe?</p>
            <input type="text" id="nombreInput" placeholder="Escribe tu nombre..." maxlength="20">
            <br>
            <button onclick="iniciarJuego()">🌲 Comenzar Aventura 🌲</button>
        </div>
    `;
    
    // Agregar evento Enter al input
    setTimeout(() => {
        const input = document.getElementById("nombreInput");
        if (input) {
            input.addEventListener("keypress", (e) => {
                if (e.key === "Enter") iniciarJuego();
            });
        }
    }, 100);
}

// Función para iniciar el juego
function iniciarJuego() {
    const nombreInput = document.getElementById("nombreInput");
    if (!nombreInput || nombreInput.value.trim() === "") {
        alert("✨ ¡Por favor, ingresa tu nombre para comenzar la aventura! ✨");
        return;
    }
    
    jugador = nombreInput.value.trim();
    vidas = 3;
    nivel = 1;
    puntos = 0;
    juegoActivo = true;
    
    // Determinar aleatoriamente quién es el malo (0: Zuri malo, 1: Kiro malo)
    malo = Math.floor(Math.random() * 2);
    
    // Reproducir música de fondo
    const bgMusic = document.getElementById("bgMusic");
    if (bgMusic) {
        bgMusic.volume = 0.3;
        bgMusic.play().catch(e => console.log("Música no disponible"));
    }
    
    mostrarNivel();
}

// Función para mostrar el estado actual del juego
function mostrarEstado() {
    const corazones = "❤️".repeat(vidas) + "🖤".repeat(Math.max(0, 3 - vidas));
    return `
        <div class="status-bar">
            <div>🧙 ${jugador}</div>
            <div class="hearts">${corazones}</div>
            <div>⭐ Nivel ${nivel}/4</div>
            <div class="points">✨ Puntos: ${puntos}</div>
            ${companero ? `<div>🐾 Compañero: ${companero.nombre}</div>` : ''}
        </div>
    `;
}

// Función para el Game Over
function gameOver(gano = false) {
    juegoActivo = false;
    playSound("wrong");
    
    let mensaje = "";
    let imagen = "";
    
    if (gano) {
        mensaje = `🏆 ¡FELICIDADES ${jugador}! 🏆\nHas completado la misión y llegado al corazón del bosque. ¡Eres un verdadero héroe!`;
        imagen = "https://i.pinimg.com/736x/8f/6e/5d/8f6e5d4c3b2a1f9e8d7c6b5a4f3e2d1c.jpg";
    } else if (vidas <= 0) {
        mensaje = `💀 GAME OVER 💀\n${jugador}, has caído en la oscuridad del bosque. ¡Mejor suerte en tu próxima aventura!`;
        imagen = "https://i.pinimg.com/736x/1a/2b/3c/1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d.jpg";
    } else {
        mensaje = `😔 Has decidido rendirte...\nEl bosque seguirá esperando a otro valiente aventurero.`;
        imagen = "https://i.pinimg.com/736x/3e/4f/5a/3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b.jpg";
    }
    
    container.innerHTML = `
        <div class="welcome-screen">
            <h1>${gano ? "🏆 VICTORIA 🏆" : "💀 FIN DEL JUEGO 💀"}</h1>
            <img src="${imagen}" style="max-width: 100%; border-radius: 20px;" 
                 onerror="this.src='https://placehold.co/400x250/2c5a2a/ffd700?text=Fin+del+Juego'">
            <div class="story-text">
                <p style="font-size: 1.2em; white-space: pre-line;">${mensaje}</p>
                <p style="margin-top: 20px;">⭐ Puntuación final: ${puntos} puntos ⭐</p>
                <p>📊 Niveles completados: ${nivel - 1}/4 📊</p>
            </div>
            <button class="restart-btn" onclick="reiniciarJuego()">🔄 Jugar de Nuevo 🔄</button>
        </div>
    `;
}

// Función para reiniciar el juego
function reiniciarJuego() {
    jugador = "";
    vidas = 3;
    nivel = 1;
    puntos = 0;
    companero = null;
    malo = null;
    mostrarBienvenida();
}

// Función para elegir compañero
function elegirCompanero() {
    return new Promise((resolve) => {
        const esZuriBueno = malo !== 0; // Si malo != 0, Zuri es bueno
        const esKiroBueno = malo !== 1; // Si malo != 1, Kiro es bueno
        
        container.innerHTML = `
            <div class="game-screen">
                <img src="https://i.pinimg.com/736x/9d/8c/7b/9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a.jpg" class="scene-image"
                     onerror="this.src='https://placehold.co/800x250/2c5a2a/ffd700?text=Elige+Sabia+mente'">
                ${mostrarEstado()}
                <div class="story-text">
                    <p>🌟 ${jugador}, antes de entrar al bosque debes elegir un compañero sabiamente... 🌟</p>
                    <p>⚠️ ¡Cuidado! Uno de ellos es un TRAIDOR que te llevará por mal camino ⚠️</p>
                </div>
                <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
                    <div class="companion-card" onclick="seleccionarCompanero('Zuri', ${esZuriBueno}, resolve)">
                        <img src="https://i.pinimg.com/736x/5e/6f/7a/5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b.jpg" 
                             onerror="this.src='https://placehold.co/80x80/ffd700/2c5a2a?text=🦊'">
                        <h3>🦊 Zuri</h3>
                        <p>Zorro astuto y veloz</p>
                    </div>
                    <div class="companion-card" onclick="seleccionarCompanero('Kiro', ${esKiroBueno}, resolve)">
                        <img src="https://i.pinimg.com/736x/4d/5e/6f/4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a.jpg"
                             onerror="this.src='https://placehold.co/80x80/ffd700/2c5a2a?text=🐦'">
                        <h3>🐦 Kiro</h3>
                        <p>Ave misteriosa y sabia</p>
                    </div>
                </div>
            </div>
        `;
        
        window.seleccionarCompanero = (nombre, esBueno, resolver) => {
            companero = {
                nombre: nombre,
                esBueno: esBueno,
                nombreMostrar: nombre === 'Zuri' ? '🦊 Zuri' : '🐦 Kiro'
            };
            
            if (esBueno) {
                playSound("correct");
                puntos += 20;
                historia = `✨ ¡Excelente elección! ${companero.nombreMostrar} resulta ser un compañero LEAL. ✨\nTe guiará sabiamente a través del bosque.`;
            } else {
                playSound("wrong");
                historia = `😈 ¡Oh no! ${companero.nombreMostrar} es el TRAIDOR. 😈\nAunque al principio parece amable, en realidad te llevará por mal camino...`;
            }
            
            resolver();
        };
    });
}

// Nivel 1: Elegir compañero
async function nivel1() {
    await elegirCompanero();
    nivel = 2;
    mostrarNivel();
}

// Nivel 2: Cruce de caminos
function nivel2() {
    return new Promise((resolve) => {
        const opcionBuena = companero.esBueno;
        
        container.innerHTML = `
            <div class="game-screen">
                <img src="https://i.pinimg.com/736x/8b/9a/0c/8b9a0c1d2e3f4a5b6c7d8e9f0a1b2c3d.jpg" class="scene-image"
                     onerror="this.src='https://placehold.co/800x250/2c5a2a/ffd700?text=Cruce+de+Caminos'">
                ${mostrarEstado()}
                <div class="story-text">
                    <p>🌲 Te adentras en el bosque y llegas a un CRUCE DE CAMINOS... 🌲</p>
                    <p>${companero.esBueno ? 
                        `✨ ${companero.nombreMostrar} te susurra: "El camino de la derecha es más seguro" ✨` : 
                        `😈 ${companero.nombreMostrar} te señala engañosamente: "Ve por la izquierda, es más rápido" 😈`}</p>
                </div>
                <div class="choices">
                    <button class="choice-btn" onclick="tomarDecisionCruce('izquierda', ${!companero.esBueno}, resolve)">🌿 Camino Izquierdo 🌿</button>
                    <button class="choice-btn" onclick="tomarDecisionCruce('derecha', ${companero.esBueno}, resolve)">🍂 Camino Derecho 🍂</button>
                </div>
            </div>
        `;
        
        window.tomarDecisionCruce = (camino, esCorrecto, resolver) => {
            if (esCorrecto) {
                playSound("correct");
                puntos += 30;
                historia = `✅ Tomaste el camino ${camino}. ¡Es la decisión correcta! Encuentras frutas mágicas y evitas a los lobos. ✅`;
                vidas = Math.min(vidas + 1, 5);
                resolver(true);
            } else {
                playSound("wrong");
                puntos = Math.max(0, puntos - 10);
                historia = `❌ El camino ${camino} estaba lleno de trampas. Aparecen LOBOS FEROCES y pierdes una vida. ❌`;
                vidas--;
                if (vidas > 0) resolver(false);
                else gameOver(false);
            }
        };
    });
}

// Nivel 3: Río o puente
function nivel3() {
    return new Promise((resolve) => {
        const opciones = [
            { nombre: "Río", texto: "💧 Cruzar nadando el río", correcta: true },
            { nombre: "Puente", texto: "🌉 Cruzar por el viejo puente", correcta: false }
        ];
        const correctaIndex = Math.floor(Math.random() * 2);
        opciones[0].correcta = (correctaIndex === 0);
        opciones[1].correcta = (correctaIndex === 1);
        
        container.innerHTML = `
            <div class="game-screen">
                <img src="https://i.pinimg.com/736x/7c/8d/9e/7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f.jpg" class="scene-image"
                     onerror="this.src='https://placehold.co/800x250/2c5a2a/ffd700?text=Río+o+Puente'">
                ${mostrarEstado()}
                <div class="story-text">
                    <p>🌊 Llegas a un río caudaloso. Debes decidir cómo cruzarlo... 🌊</p>
                    <p>${companero.esBueno ? 
                        `✨ ${companero.nombreMostrar} observa atentamente: "Mira las señales, confía en tu instinto" ✨` : 
                        `😈 ${companero.nombreMostrar} te apresura: "Date prisa, cualquier camino sirve" 😈`}</p>
                </div>
                <div class="choices">
                    <button class="choice-btn" onclick="tomarDecisionRio('${opciones[0].nombre}', ${opciones[0].correcta}, resolve)">${opciones[0].texto}</button>
                    <button class="choice-btn" onclick="tomarDecisionRio('${opciones[1].nombre}', ${opciones[1].correcta}, resolve)">${opciones[1].texto}</button>
                </div>
            </div>
        `;
        
        window.tomarDecisionRio = (opcion, esCorrecto, resolver) => {
            if (esCorrecto) {
                playSound("correct");
                puntos += 30;
                historia = `✅ Cruzaste por ${opcion}. ¡Decisión sabia! Encuentras un tesoro escondido. ✅`;
                resolver(true);
            } else {
                playSound("wrong");
                puntos = Math.max(0, puntos - 15);
                historia = `❌ ${opcion} era peligroso. Caes y pierdes una vida... ❌`;
                vidas--;
                if (vidas > 0) resolver(false);
                else gameOver(false);
            }
        };
    });
}

// Nivel 4: Templo final
function nivel4() {
    return new Promise((resolve) => {
        const acertijo = {
            pregunta: "🔮 Para llegar al corazón del bosque, responde: ¿Qué se moja mientras más seca está?",
            respuesta: "toalla"
        };
        
        container.innerHTML = `
            <div class="game-screen">
                <img src="https://i.pinimg.com/736x/6d/7e/8f/6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a.jpg" class="scene-image"
                     onerror="this.src='https://placehold.co/800x250/2c5a2a/ffd700?text=Templo+Final'">
                ${mostrarEstado()}
                <div class="story-text">
                    <p>🏛️ Llegas al TEMPLO SAGRADO del corazón del bosque... 🏛️</p>
                    <p>${companero.esBueno ? 
                        `✨ ${companero.nombreMostrar} te anima: "Has llegado lejos, responde con sabiduría" ✨` : 
                        `😈 ${companero.nombreMostrar} parece nervioso: "Date prisa, responde cualquier cosa" 😈`}</p>
                    <p style="margin-top: 15px; font-size: 1.2em; color: #ffd700;">${acertijo.pregunta}</p>
                    <input type="text" id="respuestaAcertijo" placeholder="Tu respuesta..." style="margin-top: 10px; padding: 10px; width: 80%; border-radius: 10px;">
                    <br>
                    <button class="choice-btn" onclick="responderAcertijo('${acertijo.respuesta}', resolve)" style="margin-top: 10px;">✨ Responder ✨</button>
                </div>
            </div>
        `;
        
        window.responderAcertijo = (respuestaCorrecta, resolver) => {
            const input = document.getElementById("respuestaAcertijo");
            if (!input || input.value.trim().toLowerCase() !== respuestaCorrecta) {
                playSound("wrong");
                historia = `❌ Respuesta incorrecta. La oscuridad te consume... Pierdes una vida. ❌`;
                vidas--;
                if (vidas > 0) resolver(false);
                else gameOver(false);
            } else {
                playSound("correct");
                puntos += 50;
                historia = `✅ ¡RESPUESTA CORRECTA! La luz del templo te bendice. ¡Has completado la misión! ✅`;
                resolver(true);
            }
        };
    });
}

// Función principal para mostrar niveles
async function mostrarNivel() {
    if (!juegoActivo || vidas <= 0) return;
    
    let resultado = false;
    
    switch(nivel) {
        case 1:
            await nivel1();
            break;
        case 2:
            resultado = await nivel2();
            if (resultado === undefined && vidas > 0) mostrarNivel();
            else if (vidas > 0) {
                nivel = 3;
                mostrarNivel();
            }
            break;
        case 3:
            resultado = await nivel3();
            if (resultado === undefined && vidas > 0) mostrarNivel();
            else if (vidas > 0) {
                nivel = 4;
                mostrarNivel();
            }
            break;
        case 4:
            resultado = await nivel4();
            if (resultado === undefined && vidas > 0) mostrarNivel();
            else if (vidas > 0 && resultado) {
                gameOver(true);
            } else if (vidas <= 0) {
                gameOver(false);
            }
            break;
        default:
            if (vidas > 0) gameOver(true);
            else gameOver(false);
    }
}

// Iniciar el juego mostrando la bienvenida
mostrarBienvenida();