class TurnSystem {
    constructor(city, onTurnEnd) {
        this._city         = city;
        this._currentTurn  = 0;
        this._intervalId   = null;
        this._turnDuration = 10000; // 10 segundos por defecto (configurable)

        // onTurnEnd es la función que la UI pasa para refrescarse al final de cada turno.
        // TurnSystem la llama con un objeto que contiene todos los datos actualizados.
        this._onTurnEnd = onTurnEnd || function() {};
    }

    // ============ GETTERS ============

    get currentTurn()   { return this._currentTurn; }
    get turnDuration()  { return this._turnDuration; }
    get isRunning()     { return this._intervalId !== null; }

    // ============ SETTERS ============

    // Permite cambiar la duración del turno en tiempo real (en milisegundos)
    set turnDuration(ms) {
        if (ms > 0) {
            this._turnDuration = ms;
            // Si ya está corriendo, reinicia el intervalo con la nueva duración
            if (this.isRunning) {
                this.pause();
                this.start();
            }
        }
    }

    // ============ MÉTODOS PÚBLICOS ============

    // Arranca el reloj del juego
    start() {
        if (this.isRunning) return; // ya está corriendo, no arrancar dos veces

        this._intervalId = setInterval(() => {
            this._processTurn();
        }, this._turnDuration);
    }

    // Pausa el juego (la ciudad se congela)
    pause() {
        if (!this.isRunning) return;
        clearInterval(this._intervalId);
        this._intervalId = null;
    }

    // Reanuda después de pausar
    resume() {
        this.start();
    }

    // Detiene y reinicia el turno (para nueva partida)
    stop() {
        this.pause();
        this._currentTurn = 0;
    }

    // ============ NÚCLEO DEL SISTEMA ============

    // Este método se ejecuta automáticamente cada X segundos.
    // Sigue exactamente el orden del documento.
    _processTurn() {
        this._currentTurn++;

        const city      = this._city;
        const buildings = city._buildingManager._buildings;

        // --- PASO 1: Calcular producción y consumo de recursos ---
        city._resourceManager.updateResources(buildings);

        // --- PASO 2: Verificar si el juego terminó ---
        const estado = city._resourceManager.checkGameOver();
        if (estado.gameOver) {
            this.pause(); // detiene el reloj
            this._onTurnEnd({
                turn:     this._currentTurn,
                gameOver: true,
                reason:   estado.reason,
                summary:  city._resourceManager.getSummary()
            });
            return; // no ejecuta los pasos siguientes
        }

        // --- PASO 3: Actualizar felicidad de ciudadanos ---
        city._citizenManager.updateHappiness(buildings);

        // --- PASO 4: Crecer la población si se cumplen las condiciones ---
        city._citizenManager._growPopulation(buildings, city._resourceManager);

        // --- PASO 5: Calcular puntaje ---
        city._scoreManager.calculate(city);

        // --- PASO 6: Guardar en localStorage ---
        this._saveToLocalStorage();

        // --- PASO 7: Notificar a la UI con todos los datos actualizados ---
        this._onTurnEnd({
            turn:       this._currentTurn,
            gameOver:   false,
            summary:    city._resourceManager.getSummary(),
            population: city._citizenManager.totalCitizens,
            employed:   city._citizenManager.employedCount,
            unemployed: city._citizenManager.unemployedCount,
            happiness:  city._citizenManager.averageHappiness,
            score:      city._scoreManager.score
        });
    }

    // Guarda el estado completo de la ciudad en localStorage
    _saveToLocalStorage() {
        const estado = {
            turn:      this._currentTurn,
            resources: this._city._resourceManager.toJSON(),
            buildings: this._city._buildingManager._buildings,
            citizens:  this._city._citizenManager.toJSON(),
            score:     this._city._scoreManager.toJSON()
        };

        try {
            localStorage.setItem("ciudadVirtual_save", JSON.stringify(estado));
        } catch (e) {
            // localStorage puede lanzar error si está lleno
            console.warn("No se pudo guardar en localStorage:", e);
        }
    }
}