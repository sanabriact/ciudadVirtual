class CitizenManager {
    constructor() {
        this._population = [];
    }

    addCitizen(citizen) {
        this._population.push(citizen);
    }

    deleteCitizen(id) {
        for (citizen in this._population) {
            this._population.filter(citizen => citizen !== id)
            return true;
        }
        return false;
    }

    createCitizen(id, happiness, hasHome, hasJob){
        let citizen = new Citizen(id, happiness, hasHome, hasJob);
        this.addCitizen(citizen);
        return true;
    }

    get population(){
        return this._population; 
    }

}