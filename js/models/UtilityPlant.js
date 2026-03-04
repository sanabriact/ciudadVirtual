class UtilityPlant extends Building{
    constructor(id, name, cost, electricityConsumption, waterConsumption, x, y, productionAmount) {
        super(id, name, cost, electricityConsumption, waterConsumption, x, y);
        this._productionAmount = productionAmount ?? 0;
    }
    
    //=======SETTERS==========
    set _productionAmount(productionAmount){
        if(productionAmount >= 0) {
            this._productionAmount = productionAmount;
        }
    }
}