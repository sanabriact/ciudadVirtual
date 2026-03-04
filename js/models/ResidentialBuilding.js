class ResidentialBuilding extends Building {
    constructor(id, name, cost, electricityConsumption, waterConsumption, x, y, capacity, residents) {
        super(id, name, cost, electricityConsumption, waterConsumption, x, y)
        this._capacity = capacity ?? 0;
        this._residents = residents ?? 0;
    }
    
    //=========SETTERS===========
    set _capacity(capacity) {
        if (capacity >= 0) {
            this._capacity = capacity;
        }
    }

    set _residents(residents) {
        if (residents <= capacity && residents >= 0) {
            this._residents = residents;
        }
    }
}