class Road {
    constructor(id, cost, x, y) {
        this._id = id || null;
        this._cost = cost || null;
        this._x = x || null;
        this._y = y || null;
    }
    //==========GETTERS=============
    get id() {
        return this._id;
    }
    get cost() {
        return this._cost;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    //==========SETTERS=============
    set id(id) {
        if (id >= 0) {
            this._id = id;
        }
    }
    set cost(cost) {
        if (cost >= 0) {
            this._cost = cost;
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

}