class ScoreManager {
    constructor(buildingManager, citizenManager, resourceManager) {
        this._population = citizenManager._population.length ?? 0;
        this._happinessAverage = citizenManager._happinessAverage ?? 0;
        this._money = resourceManager._money ?? 0;
        this._buildingsNumber = buildingManager._buildings.length ?? 0;
        this._electricityBalance = resourceManager.electricityBalance ?? 0;
        this._waterBalance = resourceManager.waterBalance ?? 0;
        this._score = 0;
    }

    allHasJob(citizens) {
        return citizens.every(citizen => citizen._hasJob);
    }

    happinnessValidation(happinessAverage) {
        if (happinessAverage > 80) {
            return 300;
        }
        if(happinessAverage < 40){
            
        }
        return ;
    }


    calculateScore() {
        let score = 0

    }
}