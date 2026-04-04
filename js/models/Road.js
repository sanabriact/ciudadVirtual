class Road {
    static number = 1;
    constructor(id, name, x, y) {
        this._id = id || null;
        this._name = name+"-"+Road.number++;
        this._cost = 100;
        this._x = x;
        this._y = y;
    }

    get id(){
        return this._id;
    }

    get name(){
        return this._name;
    }

    get x(){
        return this._x;
    }

    get y(){
        return this._y;
    }

    get cost(){
        return this._cost;
    }

    set id(id){
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

    set name(name){
        this._name = name;
    }
}