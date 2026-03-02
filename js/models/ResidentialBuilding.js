class ResidentialBuilding extends Building {
    constructor(id, name, cost, electricityConsumption, waterConsumption, x, y, capacity) {
        super(id, name, cost, electricityConsumption, waterConsumption, x, y)
        this._capacity = capacity;
        this._residents = 0;
    }

    get capacity() {
        return this._capacity;
    }

    get residents() {
        return this._residents;
    }

    set capacity(capacity) {
        if (capacity >= 0) {
            this._capacity = capacity;
        }
    }

    set residents(residents) {
        if (residents <= capacity && residents >= 0) {
            this._residents = residents;
        }
    }
}