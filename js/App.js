let city       = null;
let turnSystem = null;

// ─── Inicializar el juego ───────────────────────────────────────────────────

function iniciarJuego(nombre, alcalde, lat, lon, ancho, alto) {
    // 1. Crear la ciudad
    city = new City(nombre, alcalde, lat, lon, ancho, alto);

    // 2. Crear el TurnSystem pasándole la ciudad y el callback de la UI
    turnSystem = new TurnSystem(city, actualizarUI);

    // 3. Arrancar el reloj
    turnSystem.start();
}

// ─── Callback que la UI recibe al final de cada turno ──────────────────────

function actualizarUI(datos) {
    if (datos.gameOver) {
        // Mostrar pantalla de game over con el motivo
        console.log("GAME OVER:", datos.reason);
        // mostrarPantallaGameOver(datos.reason);
        return;
    }

    // Actualizar panel de recursos en pantalla
    const { summary } = datos;
    console.log(`--- Turno ${datos.turn} ---`);
    console.log(`Dinero:        $${summary.money}`);
    console.log(`Electricidad:  ${summary.electricityProduction} - ${summary.electricConsumption} = ${summary.electricityBalance}`);
    console.log(`Agua:          ${summary.waterProduction} - ${summary.waterConsumption} = ${summary.waterBalance}`);
    console.log(`Comida:        ${summary.food}`);
    console.log(`Población:     ${datos.population} (${datos.employed} empleados, ${datos.unemployed} desempleados)`);
    console.log(`Felicidad:     ${datos.happiness}%`);
    console.log(`Puntaje:       ${datos.score}`);
}

// ─── Ejemplo de uso ────────────────────────────────────────────────────────

// Iniciar una partida nueva
iniciarJuego("Manizales Virtual", "Alcalde Pérez", 5.0703, -75.5138, 20, 20);

// Construir una planta eléctrica
city.buildBuilding({
    type:                   "UtilityPlant",
    _id:                    1,
    _name:                  "Planta Eléctrica",
    _cost:                  10000,
    _electricityConsumption: 0,
    _waterConsumption:       0,
    _x:                     5,
    _y:                     5,
    _productionType:        "electricity",
    _productionAmount:      200
});

// Construir una planta de agua
city.buildBuilding({
    type:                   "UtilityPlant",
    _id:                    2,
    _name:                  "Planta de Agua",
    _cost:                  8000,
    _electricityConsumption: 20,
    _waterConsumption:       0,
    _x:                     6,
    _y:                     5,
    _productionType:        "water",
    _productionAmount:      150
});

// Construir una casa residencial
city.buildBuilding({
    type:                   "ResidentialBuilding",
    _id:                    3,
    _name:                  "Casa",
    _cost:                  1000,
    _electricityConsumption: 5,
    _waterConsumption:       3,
    _x:                     7,
    _y:                     5,
    _capacity:              4,
    _residents:             0
});

// Pausar / reanudar desde un botón de la UI
function togglePausa() {
    if (turnSystem.isRunning) {
        turnSystem.pause();
    } else {
        turnSystem.resume();
    }
}

// Cambiar la duración del turno (en milisegundos) — configurable según el documento
function cambiarVelocidadTurno(segundos) {
    turnSystem.turnDuration = segundos * 1000;
}