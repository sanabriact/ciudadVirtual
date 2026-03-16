class CitizenManager {
    constructor() {
        this._population = [];
        // Cuántos ciudadanos pueden llegar por turno (configurable)
        this._growthRate = 3;
    }

    // ============ GETTERS ============

    get population()    { return this._population; }
    get totalCitizens() { return this._population.length; }
    get growthRate()    { return this._growthRate; }

    // Felicidad promedio de todos los ciudadanos (0 si no hay nadie)
    get averageHappiness() {
        if (this._population.length === 0) return 0;
        const total = this._population.reduce((suma, c) => suma + c._happiness, 0);
        return Math.round(total / this._population.length);
    }

    // Cuántos ciudadanos tienen empleo
    get employedCount() {
        return this._population.filter(c => c._hasJob).length;
    }

    // Cuántos ciudadanos NO tienen empleo
    get unemployedCount() {
        return this._population.filter(c => !c._hasJob).length;
    }

    // ============ SETTERS ============

    set growthRate(value) {
        if (value > 0) this._growthRate = value;
    }

    // ============ MÉTODOS ============

    addCitizen(citizen) {
        this._population.push(citizen);
    }

    // Bug corregido: el filter original no tenía return
    deleteCitizen(id) {
        const cantidadInicial = this._population.length;
        this._population = this._population.filter(citizen => citizen._id !== id);
        return this._population.length < cantidadInicial;
    }

    createCitizen(id, happiness, hasHome, hasJob) {
        const citizen = new Citizen(id, happiness, hasHome, hasJob);
        this.addCitizen(citizen);
        return citizen;
    }

    // Actualiza la felicidad de cada ciudadano según los edificios activos.
    // Se llama cada turno desde TurnSystem.
    updateHappiness(buildings) {
        // Contamos cuántos bonos de felicidad hay en la ciudad
        let happinessBonus = 0;

        buildings.forEach(building => {
            if (building instanceof ServiceBuilding || building instanceof Park) {
                happinessBonus += building._happinessBonus || 0;
            }
        });

        // Actualizamos la felicidad de cada ciudadano individualmente
        this._population.forEach(citizen => {
            let happiness = 50; // base neutral

            // Factores positivos (según el documento)
            if (citizen._hasHome) happiness += 20;
            if (citizen._hasJob)  happiness += 15;
            happiness += happinessBonus; // suma parques, policía, bomberos, hospitales

            // Factores negativos
            if (!citizen._hasHome) happiness -= 20;
            if (!citizen._hasJob)  happiness -= 15;

            // La felicidad nunca sale del rango 0-100
            citizen._happiness = Math.min(100, Math.max(0, happiness));
        });
    }

    // Asigna hogar a ciudadanos que no tienen uno, si hay capacidad disponible
    assignHomes(buildings) {
        const residenciales = buildings.filter(b => b instanceof ResidentialBuilding);

        this._population.forEach(citizen => {
            if (!citizen._hasHome) {
                // Busca el primer edificio residencial con espacio
                const edificio = residenciales.find(b => b._residents < b._capacity);
                if (edificio) {
                    edificio._residents++;
                    citizen._hasHome = true;
                }
            }
        });
    }

    // Asigna empleo a ciudadanos desempleados, si hay vacantes
    assignJobs(buildings) {
        const comerciales   = buildings.filter(b => b instanceof CommercialBuilding);
        const industriales  = buildings.filter(b => b instanceof IndustrialBuilding);
        const edificiosConEmpleo = [...comerciales, ...industriales];

        this._population.forEach(citizen => {
            if (!citizen._hasJob) {
                const edificio = edificiosConEmpleo.find(b => b._employeesCount < b._jobs);
                if (edificio) {
                    edificio._employeesCount = (edificio._employeesCount || 0) + 1;
                    citizen._hasJob = true;
                }
            }
        });
    }

    // Hace crecer la población si se cumplen las condiciones del documento:
    // - Hay viviendas disponibles
    // - Felicidad promedio > 60
    // - Hay empleos disponibles
    growPopulation(buildings, resourceManager) {
        const hayVivienda = this._hayCapacidadResidencial(buildings);
        const felicidadOk = this.averageHappiness > 60;
        const hayEmpleo   = this._hayEmpleosDisponibles(buildings);

        if (!hayVivienda || !felicidadOk || !hayEmpleo) return;

        // Llegan entre 1 y growthRate ciudadanos nuevos
        const nuevos = Math.floor(Math.random() * this._growthRate) + 1;

        for (let i = 0; i < nuevos; i++) {
            if (!this._hayCapacidadResidencial(buildings)) break; // si se llenó, para

            const id = `citizen_${Date.now()}_${i}`;
            const ciudadano = this.createCitizen(id, 50, false, false);

            // Intenta asignarle hogar y empleo inmediatamente
            this.assignHomes(buildings);
            this.assignJobs(buildings);
        }
    }

    // Chequea si hay espacio en algún edificio residencial
    _hayCapacidadResidencial(buildings) {
        return buildings
            .filter(b => b instanceof ResidentialBuilding)
            .some(b => b._residents < b._capacity);
    }

    // Chequea si hay vacantes en algún edificio comercial o industrial
    _hayEmpleosDisponibles(buildings) {
        const edificios = buildings.filter(
            b => b instanceof CommercialBuilding || b instanceof IndustrialBuilding
        );
        return edificios.some(b => (b._employeesCount || 0) < b._jobs);
    }

    // Serializa para localStorage
    toJSON() {
        return {
            population: this._population,
            growthRate: this._growthRate
        };
    }
}