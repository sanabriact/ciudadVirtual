class Citizen {
    constructor(id,happiness,hasHome,hasJob){
        this._id = id || null;
        this._happiness = happiness || null;
        this._hasHome = hasHome || null;
        this._hasJob = hasJob || null;
    }
    //==========GETTERS=============
    get id(){ 
        return this._id;
    }
    get happiness(){
        return this._happiness;
    }
    get hasHome(){
        return this._hasHome;
    }
    get hasJob(){
        return this._hasJob;
    }
    //==========SETTERS=============
    set id(id){
        if(id >=0){
            this._id = id;
        }
    }
    set happiness(happiness){
        this._happiness = happiness;
    }
    set hasHome(hasHome){
        this._hasHome = hasHome;
    }
    set hasJob(hasJob){
        this._hasJob = hasJob;
    }

}