class ResourceManager {
    constructor(money,electricity,electricityProduction,electricConsumption,water,waterProduction,waterConsumption,food){
        this._money = money ?? 50000;
        this._electricity = electricity ?? 0;
        this._electricityProduction = electricityProduction ?? 0;
        this._electricConsumption = electricConsumption ?? 0;
        this._water = water ?? 0;
        this._waterProduction = waterProduction ?? 0;
        this._waterConsumption = waterConsumption ?? 0;
        this._food = food ?? 0;
    }

    //==========SETTERS=============
    set _money(money){
        if(money >=0){
            this._money = money;
        }
    }
    set _electricity(electricity){
        if(electricity >=0){
            this._electricity = electricity;
        }
    }
    set _electricityProduction(electricityProduction){
        if(electricityProduction >=0){
            this._electricityProduction = electricityProduction;
        }
    }
    set _electricConsumption(electricConsumption){
        if(electricConsumption >=0){
            this._electricConsumption = electricConsumption;
        }
    }
    set _water(water){
        if(water >=0){
            this._water = water;
        }
    }
    set _waterProduction(waterProduction){
        if(waterProduction >=0){
            this._waterProduction = waterProduction;
        }
    }
    set _waterConsumption(waterConsumption){
        if(waterConsumption >=0){
            this._waterConsumption = waterConsumption;
        }
    }
    set _food(food){
        if(food >=0){
            this._food = food;
        }
    }
}