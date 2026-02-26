class ServiceBuilding extends Building{
    constructor(id, name, cost, electricityConsumption, waterConsumption, x, y, active, radius, happinessBonus) {
        super(id, name, cost, electricityConsumption, waterConsumption, x, y, active);
        this._radius = radius || null;
        this._happinessBonus = happinessBonus|| null;
    }

//============GETTERS=============
    get radius(){
        return this._radius;
    }

    get happinessBonus(){
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