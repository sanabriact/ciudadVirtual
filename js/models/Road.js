class Road {
    constructor(id, x, y) {
        this._id = id || null;
        this._cost = 100;
        this._x = x;
        this._y = y;
    }

    //==========SETTERS=============
    
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