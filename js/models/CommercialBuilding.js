class ComercialBuilding extends Building {
    constructor(id, name, cost, electricityConsumption, waterConsumption, x, y, active, jobs, incomePerTurn) {
        super(id, name, cost, electricityConsumption, waterConsumption, x, y, active);
        this._jobs = jobs || null;
        this._incomePerTurn = incomePerTurn || null;
    }

    //============GETTERS============
    get jobs() {
        return this._jobs;
    }

    get incomePerTurn() {
        return this._incomePerTurn;
    }

    //=========SETTERS===========

    set jobs(jobs) {
        if (jobs >= 0) {
            this._jobs = jobs;
        }
    }

    set incomePerTurn(incomePerTurn) {
        if (incomePerTurn >= 0) {
            this._incomePerTurn = incomePerTurn;
        }
    }
}