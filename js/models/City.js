class City {
    constructor(name, mayor, regionLat, regionLon, width, height, score, hapinessAverage, grid) {
        this._name = name || "";
        this._mayor = mayor || "";
        this._regionLat = regionLat ?? 0;
        this._regionLon = regionLon ?? 0;
        this._width = width ?? 0;
        this._height = height ?? 0;
        this._score = score ?? 0;
        this._hapinessAverage = hapinessAverage ?? 0;
        this._grid = grid;
        this._roads = [];

        // Managers: cada uno controla un aspecto de la ciudad
        this._buildingManager = new BuildingManager();
        this._citizenManager = new CitizenManager();
        this._resourceManager = new ResourceManager();
        this._scoreManager = new ScoreManager(this._buildingManager, this._citizenManager, this._resourceManager);
        this._turnSystem = null;
    }

    // ============ GETTERS (delegados a los managers) ============
    get buildingManager() {
        return this._buildingManager;
    }
    get population() {
        return this._citizenManager.population;
    }

    get buildings() {
        return this._buildingManager._buildings;
    }

    get resources() {
        return this._resourceManager.getSummary();
    }

    get score() {
        return this._scoreManager.score;
    }

    get happinessAverage() {
        return this._citizenManager.averageHappiness;
    }

    // ============ SETTERS ============

    set regionLat(value) {
        if (value >= 0) {
            this._regionLat = value;
        }
    }
    set regionLon(value) {
        if (value >= 0) {
            this._regionLon = value;
        }
    }
    set width(value) {
        if (value >= 0) {
            this._width = value;
        }
    }
    set height(value) {
        if (value >= 0) {
            this._height = value;
        }
    }
    set score(value) {
        if (value >= 0) {
            this._score = value;
        }
    }

    // ============ MÉTODOS ============

    // Intenta construir un edificio: descuenta el dinero y lo registra
    // Retorna true si se pudo construir, false si no había dinero
    buildBuilding(buildingData) {
        const costo = buildingData._cost || 0;

        if (!this._resourceManager.canAfford(costo)) {
            return false;
        }

        this._resourceManager.spendMoney(costo);
        this._buildingManager.createBuilding(buildingData);
        return true;
    }

    // Demuele un edificio y devuelve el 50% del costo (según el documento)
    demolishBuilding(id) {
        const edificio = this._buildingManager._buildings.find(b => b._id === id);
        if (!edificio) return false;

        const reembolso = Math.floor((edificio._cost || 0) * 0.5);
        this._resourceManager.addIncome(reembolso);
        return this._buildingManager.deleteBuilding(id);
    }

    // Construye una vía ($100 por celda según el documento)
    buildRoad(x, y) {
        const costoPorCelda = 100;
        if (!this._resourceManager.canAfford(costoPorCelda)) return false;

        this._resourceManager.spendMoney(costoPorCelda);
        this._roads.push({ x, y });
        return true;
    }

    toJSON() {
        return {
            _name: this._name,
            _mayor: this._mayor,
            _regionLat: this._regionLat,
            _regionLon: this._regionLon,
            _width: this._width,
            _height: this._height,
            _score: this._scoreManager._score,
            _hapinessAverage: this._hapinessAverage,
            _grid: this._grid,
            _roads: this._roads,
            _buildingManager: this._buildingManager,
            _citizenManager: this._citizenManager,
            _resourceManager: this._resourceManager,
            _scoreManager: this._scoreManager
            // _turnSystem se omite intencionalmente
        };
    }
}
