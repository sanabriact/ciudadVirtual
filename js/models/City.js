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


    toJSON() {
        return {
            _name: this._name,
            _mayor: this._mayor,
            _regionLat: this._regionLat,
            _regionLon: this._regionLon,
            _width: this._width,
            _height: this._height,
            _score: this._scoreManager._score,
            _hapinessAverage: this._citizenManager.hapinessAverage,
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
