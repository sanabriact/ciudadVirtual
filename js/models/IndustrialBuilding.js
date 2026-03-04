class IndustrialBuilding extends Building{
    constructor(id, name, cost, electricityConsumption, waterConsumption, x, y,jobs, productionType) {
        super(id, name, cost, electricityConsumption, waterConsumption, x, y);
        this._jobs = jobs ?? 0;
        this._productionType = productionType || "";
    }

//=========SETTERS===========

    set _jobs(jobs) {
        if (jobs >= 0) {
            this._jobs = jobs;
        }
    }

}