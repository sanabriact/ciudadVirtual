class Building {
    constructor(id, name, cost, electricityConsumption, waterConsumption, x, y) {
        if (new.target === Building) {
            throw new Error("Building es una clase abstracta");
        }
        this._id = id || null;
        this._name = name || "";
        this._cost = cost || null;
        this._electricityConsumption = electricityConsumption || null;
        this._waterConsumption = waterConsumption || null;
        this._x = x || null;
        this._y = y || null;

    }

    //============SETTERS=============

    set id(id) {
        this._id = id;
    }

    set name(name) {
        this._name = name;
    }

    set cost(cost) {
        if (cost >= 0) {
            this._cost = cost;
        }
    }

    set electricityConsumption(electricityConsumption) {
        if (electricityConsumption >= 0) {
            this._electricityConsumption = electricityConsumption;
        }
    }

    set waterConsumption(waterConsumption) {
        if (waterConsumption >= 0) {
            this._waterConsumption = waterConsumption;
        }
    }

    set x(x) {
        if (x >= 0) {
            this._x = x;
        }
    }

    set y(y) {
        if (y >= 0) {
            this._y = y;
        }
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get cost() {
        return this._cost;
    }

    get electricityConsumption() {
        return this._electricityConsumption;
    }

    get waterConsumption() {
        return this._waterConsumption;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }
}