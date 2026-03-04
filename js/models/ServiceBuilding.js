class ServiceBuilding extends Building {
    constructor(id, name, cost, electricityConsumption, waterConsumption, x, y, radius, happinessBonus) {
        super(id, name, cost, electricityConsumption, waterConsumption, x, y);
        this._radius = radius ?? 0;
        this._happinessBonus = happinessBonus ?? 0;
    }

    //==========SETTERS==============

    set _radius(radius) {
        if (radius >= 5) {
            this._radius = radius;
        }
    }

    set _happinessBonus(happinessBonus) {
        if (hapinessBonus >= 0){
            this._happinessBonus = happinessBonus;
        }
    }
}