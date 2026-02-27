class CitizenManager {
    constructor() {
        this._population = []
    }

    createCitizen(id) {
        this._population.push(new Citizen(id))
    }

    deleteCitizen(id) {
        for (citizen in this._population) {
            this._population.filter(citizen => citizen !== id)

        }
    }

}