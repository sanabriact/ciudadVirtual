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
        this._buildingManager = new BuildingManager();
        this._citizenManager = new CitizenManager();
        this._roads = [];
    }

    
    // Delegados a managers
    get _population() {
        return this._citizenManager.population;
    }

    get _buildings() {
        return this._buildingManager.buildings;
    }

    // ===== SETTERS =====

    set _regionLat(regionLat) {
        if (regionLat >= 0)
            this._regionLat = regionLat;
    }

    set _regionLon(regionLon) {
        if (regionLon >= 0)
            this._regionLon = regionLon;
    }

    set _width(width) {
        if (width >= 0)
            this._width = width;
    }

    set _height(height) {
        if (height >= 0)
            this._height = height;
    }

    set _score(score) {
        if (score >= 0)
            this._score = score;
    }

}