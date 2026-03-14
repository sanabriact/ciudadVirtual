class CitizenManager {
    constructor() {
        this._population = [];
    }

    addCitizen(citizen) {
        this._population.push(citizen);
    }

    deleteCitizen(id) {
    const cantidadInicial = this._population.length;
    
    this._population = this._population.filter(citizen =>{
        citizen._id !== id;
    });
    
    return this._population.length < cantidadInicial;
}

    createCitizen(id, happiness, hasHome, hasJob){
        let citizen = new Citizen(id, happiness, hasHome, hasJob);
        this.addCitizen(citizen);
        return true;
    }
}