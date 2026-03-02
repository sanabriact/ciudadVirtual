class UtilityPlant extends Building{
    constructor(id, name, cost, electricityConsumption, waterConsumption, x, y, productionAmount) {
        super(id, name, cost, electricityConsumption, waterConsumption, x, y);
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