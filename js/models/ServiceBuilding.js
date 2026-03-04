class ServiceBuilding extends Building {
    constructor(id, name, cost, electricityConsumption, waterConsumption, x, y, radius, happinessBonus) {
        super(id, name, cost, electricityConsumption, waterConsumption, x, y);
        this._radius = radius ?? 0;
        this._happinessBonus = happinessBonus ?? 0;
    }

    //============GETTERS=============
    get radius() {
        return this._radius;
    }

    get happinessBonus() {
        return this._happinessBonus;
    }

    //==========SETTERS==============

    set radius(radius) {
        this._radius = radius;
    }

    set happinessBonus(happinessBonus) {
        this._happinessBonus = happinessBonus;
    }
}