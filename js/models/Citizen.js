class Citizen {
    constructor(id){
        this._id = id || null;
        this._happiness = 50;
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