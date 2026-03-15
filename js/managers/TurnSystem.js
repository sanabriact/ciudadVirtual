class TurnSystem {
    constructor(city, onTurnEnd) {
        this._city = city;
        this._currentTurn = 0;
        this._intervalId = null;
        this._turnDuration = 10000; // 10 segundos por defecto (configurable)

        // onTurnEnd es una función que la UI pasa para refrescarse
        // Cuando el turno termina, TurnSystem la llama y le pasa los datos nuevos
        this._onTurnEnd = onTurnEnd || function() {};
    }

    // ========== GETTERS ==========
    get currentTurn()    { return this._currentTurn; }
    get turnDuration()   { return this._turnDuration; }
    get isRunning()      { return this._intervalId !== null; }

    // ========== SETTERS ==========
    set turnDuration(ms) {
        if (ms > 0) this._turnDuration = ms;
    }

    // ========== MÉTODOS ==========

    // Arranca el reloj del juego
    start() {
        if (this.isRunning) return; // ya está corriendo, no lo arranques dos veces

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

    // Detiene el juego completamente y reinicia el turno
    stop() {
        this.pause();
        this._currentTurn = 0;
    }

    // Este es el corazón del TurnSystem
    // Se ejecuta automáticamente cada X segundos
    _processTurn() {
        this._currentTurn++;

        const city = this._city;
        const buildings = city._buildingManager._buildings;

        // --- PASO 1: Actualizar recursos ---
        city._resourceManager.updateResources(buildings);

        // --- PASO 2: Verificar game over ---
        const estado = city._resourceManager.checkGameOver();
        if (estado.gameOver) {
            this.pause(); // detiene el reloj
            this._onTurnEnd({
                turn: this._currentTurn,
                gameOver: true,
                reason: estado.reason,
                summary: city._resourceManager.getSummary()
            });
            return; // no sigue con los demás pasos
        }

        // --- PASO 3: Actualizar felicidad de ciudadanos ---
        city._citizenManager.updateHappiness(buildings);

        // --- PASO 4: Crecer población si se cumplen las condiciones ---
        city._citizenManager.growPopulation(buildings, city._resourceManager);

        // --- PASO 5: Calcular puntaje ---
        city._scoreManager.calculate(city);

        // --- PASO 6: Guardar en localStorage ---
        this._saveToLocalStorage();

        // --- PASO 7: Avisarle a la UI que todo cambió ---
        this._onTurnEnd({
            turn: this._currentTurn,
            gameOver: false,
            summary: city._resourceManager.getSummary(),
            population: city._citizenManager._population.length,
            score: city._scoreManager.score
        });
    }

    // Guarda el estado completo de la ciudad
    _saveToLocalStorage() {
        const estado = {
            turn: this._currentTurn,
            resources: this._city._resourceManager.toJSON(),
            buildings: this._city._buildingManager._buildings,
            citizens: this._city._citizenManager._population,
            score: this._city._scoreManager.score
        };
        localStorage.setItem("ciudadVirtual_save", JSON.stringify(estado));
    }
}