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

    // ===== GETTERS =====

    get name() {
        return this._name;
    }


    get mayor() {
        return this._mayor;
    }

    get regionLat() {
        return this._regionLat;

    }

    get regionLon() {
        return this._regionLon;

    }

    get width() {
        return this._width;

    }

    get height() {
        return this._height;

    }

    get score() {
        return this._score;

    }

    get grid() {
        return this._grid;

    }

    get roads() {
        return this._roads;

    }

    // Delegados a managers
    get population() {
        return this._citizenManager.population;
    }

    get buildings() {
        return this._buildingManager.buildings;
    }

    get citizenManager() {
        return this._citizenManager;
    }

    get buildingManager() {
        return this._buildingManager;
    }

    get hapinessAverage() {
        return this._hapinessAverage;
    }

    // ===== SETTERS =====

    set name(name) {
        this._name = name;
    }

    set mayor(mayor) {
        this._mayor = mayor;
    }

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

    set grid(grid) {
        this._grid = grid;
    }

    set roads(roads) {
        this._roads = roads;
    }
    
    set hapinessAverage(hapinessAverage) {
        this._hapinessAverage = hapinessAverage;
    }
}