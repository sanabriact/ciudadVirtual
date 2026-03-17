class BuildingManager {
    constructor() {
        this._buildings = []
    }

    addBuilding(building) {
        this._buildings.push(building)
    }

    deleteBuilding(x,y) {
    let buildingsNumber = this._buildings.length;
    this._buildings = this._buildings.filter(building => !(building._x === x && building._y === y));
    return this._buildings.length < buildingsNumber;
}

    createBuilding(buildingData) {
        let building;
        switch (buildingData.type) {
            case "CommercialBuilding":
                building = new CommercialBuilding(
                    buildingData._id,
                    buildingData._name,
                    buildingData._cost,
                    buildingData._electricityConsumption,
                    buildingData._waterConsumption,
                    buildingData._x,
                    buildingData._y,
                    buildingData._jobs,
                    buildingData._incomePerTurn
                )
                break;

            case "IndustrialBuilding":
                building = new IndustrialBuilding(
                    buildingData._id,
                    buildingData._name,
                    buildingData._cost,
                    buildingData._electricityConsumption,
                    buildingData._waterConsumption,
                    buildingData._x,
                    buildingData._y,
                    buildingData._jobs,
                    buildingData._productionType
                )
                break;


            case "Park":
                building = new Park(
                    buildingData._id,
                    buildingData._name,
                    buildingData._cost,
                    buildingData._electricityConsumption,
                    buildingData._waterConsumption,
                    buildingData._x,
                    buildingData._y,
                    buildingData._happinessBonus
                )
                break;


            case "ResidentialBuilding":
                building = new ResidentialBuilding(
                    buildingData._id,
                    buildingData._name,
                    buildingData._cost,
                    buildingData._electricityConsumption,
                    buildingData._waterConsumption,
                    buildingData._x,
                    buildingData._y,
                    buildingData._capacity,
                    buildingData._residents
                )
                break;


            case "ServiceBuilding":
                building = new ServiceBuilding(
                    buildingData._id,
                    buildingData._name,
                    buildingData._cost,
                    buildingData._electricityConsumption,
                    buildingData._waterConsumption,
                    buildingData._x,
                    buildingData._y,
                    buildingData._radius,
                    buildingData._happinessBonus
                )
                break;


            case "UtilityPlant":
                building = new UtilityPlant(
                    buildingData._id,
                    buildingData._name,
                    buildingData._cost,
                    buildingData._electricityConsumption,
                    buildingData._waterConsumption,
                    buildingData._x,
                    buildingData._y,
                    buildingData._productionAmount
                )
                break;

        }

        if (building) {
            this.addBuilding(building)
        }
    }


}