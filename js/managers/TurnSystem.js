class TurnSystem {
    constructor(city, turnDuration) {
        this._city = city;
        this._turnDuration = turnDuration * 1000; // convertir a milisegundos
        this._turnNumber = 0;
        this._interval = null;
    }

    start() {
        this._interval = setInterval(() => {
            this.nextTurn();
        }, this._turnDuration);
    }

    stop() {
        clearInterval(this._interval);
        this._interval = null;
    }

    nextTurn() {
        this._turnNumber++;
        console.log(`Turno ${this._turnNumber}`);
        CityBuilderStorage.save(this._city, "city")

        let buildings = this._city._buildingManager._buildings;
        
        // 1. Actualizar recursos
        this._city._resourceManager.updateResources(buildings);
        
        // 2. Hacer crecer población
        this._city._citizenManager.growPopulation(buildings);
        
        // 3. Asignar hogares y empleos
        this._city._citizenManager.assignHomes(buildings);
        this._city._citizenManager.assignJobs(buildings);
        
        // 4. Calcular felicidad
        this._city._citizenManager.calculateHappiness(buildings);
        
        // 5. Calcular puntuación
        this._city._scoreManager.calculateScore();
        
        // 6. Actualizar UI
        helpers.updateUI();

        // 7. Verificar game over
        const gameOver = this._city._resourceManager.checkGameOver();
        if (gameOver.gameOver) {
            this.stop();
            document.getElementById('game-over-reason').textContent = gameOver.reason;
            document.getElementById('game-over-score').textContent =
                `Puntuación final: ${this._city._scoreManager._score > 0 ? this._city._scoreManager._score : 0}`;
            helpers.showScreen("game-over-page");
        }
    }
}