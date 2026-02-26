class ResourceManager {
    constructor(money,electricity,electricityProduction,electricConsumption,water,waterProduction,waterConsumption,food){
        this._money = money || null;
        this._electricity = electricity || null;
        this._electricityProduction = electricityProduction|| null;
        this._electricConsumption = electricConsumption || null;
        this._water = water || null;
        this._waterProduction = waterProduction || null;
        this._waterConsumption = waterConsumption || null;
        this._food = food || null;
    }
    //==========GETTERS=============
    get money(){
        return this._money;
    }
    get electricity(){
        return this._electricity;
    }
    get electricityProduction(){
        return this._electricityProduction;
    }
    get electricConsumption(){
        return this._electricConsumption;
    }
    get water(){
        return this._water;
    }
    get waterProduction(){
        return this._waterProduction;
    }
    get waterConsumption(){
        return this._waterComsumption;
    }
    get food(){
        return this._food;
    }
    //==========SETTERS=============
    set money(money){
       if(money >=0){
         this._money = money;
       }
    }
    set electricity(electricity){
        if(electricity >=0){
            this._electricity = electricity;
        }
    }
    set electricityProduction(electricityProduction){
        if(electricityProduction >=0){
            this._electricityProduction = electricityProduction;
        }
    }
    set electricConsumption(electricConsumption){
        if(electricConsumption >=0){
            this._electricConsumption = electricConsumption;
        }
    }
    set water(water){
        if(water >=0){
            this._water = water;
        }
    }
    set waterProduction(waterProduction){
        if(waterProduction >=0){
            this._waterProduction = waterProduction;
        }
    }
    set waterConsumption(waterConsumption){
        if(waterConsumption >=0){
            this._waterConsumption = waterConsumption;
        }
    }
    set food(food){
        if(food >=0){
            this._food = food;
        }
    }
}