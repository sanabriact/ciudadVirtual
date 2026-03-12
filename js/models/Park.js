class Park extends Building {
    constructor(id, name, cost, electricityConsumption, waterConsumption, x, y, happinessBonus) {
        super(id, name, cost, electricityConsumption, waterConsumption, x, y);
        this._happinessBonus = happinessBonus ?? 0;
    }

    //========SETTERS============
    set _happinessBonus(happinessBonus) {
        if (happinessBonus >= 0) {
            this._happinessBonus = happinessBonus;
        }
    }
}