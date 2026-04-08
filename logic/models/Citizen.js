class Citizen {
    static number = 1;
    constructor(name, happiness, hasHome, hasJob) {
        this._name = name + "-" + Citizen.number++;
        this._happiness = happiness ?? 50;
        this._hasHome = hasHome || false;
        this._hasJob = hasJob || false;
    }

    get name() {
        return this._name;
    }

    get happiness() {
        return this._happiness;
    }

    get hasHome() {
        return this._hasHome;
    }

    get hasJob() {
        return this._hasJob;
    }

    set name(name) {
        this._name = name;
    }

    set happiness(value) {
        if (value >= 0 && value <= 100) {
            this._happiness = value;
        }
    }

    set hasHome(value) {
        this._hasHome = value;
    }

    set hasJob(value) {
        this._hasJob = value;
    }

}