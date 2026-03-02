class BuildingManager {
    constructor() {
        this._buildings = []
    }

    addBuilding(building) {
        this._buildings.push(building);
    }

    deleteBuilding(id) {
        for (building in this._buildings) {
            this._buildings.filter(building => building !== id);
        }
    }

} 

console.log("hola")