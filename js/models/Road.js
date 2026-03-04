class Road {
    constructor(id, x, y) {
        this._id = id || null;
        this._cost = 100;
        this._x = x;
        this._y = y;
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
            this._id = id;
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