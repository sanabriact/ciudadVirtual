class Park extends Building{
    constructor(id, name, cost, electricityConsumption, waterConsumption, x, y, happinessBonus) {
        super(id, name, cost, electricityConsumption, waterConsumption, x, y);
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