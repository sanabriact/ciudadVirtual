class UtilityPlant extends Building{
    constructor(id, name, cost, electricityConsumption, waterConsumption, x, y, active, productionAmount) {
        super(id, name, cost, electricityConsumption, waterConsumption, x, y, active);
        this._productionAmount = productionAmount || null;
    }

    //========GETTERS==========
    get productionAmount(){
        return this._productionAmount;
    }


    //=======SETTERS==========
    set productionAmount(productionAmount){
        if(productionAmount >= 0) {
            this._productionAmount = productionAmount;
        }
    }
}