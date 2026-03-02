class IndustrialBuilding extends Building{
    constructor(id, name, cost, electricityConsumption, waterConsumption, x, y,jobs, productionType) {
        super(id, name, cost, electricityConsumption, waterConsumption, x, y);
        this._jobs = jobs || null;
        this._productionType = productionType || "";
    }
//============GETTERS============
    get jobs() {
        return this._jobs;
    }

    get productionType() {
        return this._productionType;
    }

//=========SETTERS===========

    set jobs(jobs) {
        if (jobs >= 0) {
            this._jobs = jobs;
        }
    }

    set productionType(productionType) {
        this._productionType = productionType;
    }

}