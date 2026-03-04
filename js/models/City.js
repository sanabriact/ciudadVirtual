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
    get population() {
        return this._citizenManager.population;
    }

    get buildings() {
        return this._buildingManager.buildings;
    }

    // ===== SETTERS =====

    set regionLat(regionLat) {
        if (regionLat >= 0)
            this._regionLat = regionLat;
    }

    set regionLon(regionLon) {
        if (regionLon >= 0)
            this._regionLon = regionLon;
    }

    set width(width) {
        if (width >= 0)
            this._width = width;
    }

    set height(height) {
        if (height >= 0)
            this._height = height;
    }

    set score(score) {
        if (score >= 0)
            this._score = score;
    }

}