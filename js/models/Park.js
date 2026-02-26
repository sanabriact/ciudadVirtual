class Park extends Building{
    constructor(id, name, cost, electricityConsumption, waterConsumption, x, y, active, happinessBonus) {
        super(id, name, cost, electricityConsumption, waterConsumption, x, y, active);
        this._happinesBonus = happinessBonus || null;
    }

    //==========GETTERS==========
    get happinessBonus() {
        return this._happinesBonus;
    }

    //========SETTERS============
    set happinessBonus(happinessBonus) {
        this._happinesBonus = happinessBonus;
    }
}