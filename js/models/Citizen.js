class Citizen {
    constructor(id, happiness, hasHome, hasJob){
        this._id = id || null;
        this._happiness = happiness ?? 50;
        this._hasHome = hasHome || false;
        this._hasJob = hasJob || false;
    }
}