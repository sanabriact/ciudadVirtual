class City {
    constructor(name, mayor, regionLat, regionLon, width, height) {
        this._name = name || "";
        this._mayor = mayor || "";
        this._regionLat = regionLat || null;;
        this._regionLon = regionLon || null;
        this._width = width || null;
        this._height = height || null;
        this._score = null
        this._map = null;

        this._buildings = [];
        this._roads = [];
        this._population = [];

    }

    //==========GETTERS=============
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

    get map() {
        return this._map;
    }

    get population() {
        return this._population;
    }

    get buildings() {
        return this._buildings;
    }

    get roads() {
        return this._roads;
    }

    //=============SETTERS===============
    set name(name) {
        this._name = name;
    }

    set mayor(mayor) {
        this._mayor = mayor;
    }

    set regionLat(regionLat) {
        this._regionLat = regionLat;
    }

    set regionLon(regionLon) {
        this._regionLon = regionLon;
    }

    set width(width){
        this._width = width;
    }

    set height(height){
        this._height = height;
    }



}