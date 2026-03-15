class ResourceManager {
    constructor(money, electricity, electricityProduction, electricConsumption,
                water, waterProduction, waterConsumption, food) {

        // Usamos variables con guion bajo doble para evitar recursión en setters
        this.__money               = money               ?? 50000;
        this.__electricity         = electricity         ?? 0;
        this.__electricityProduction = electricityProduction ?? 0;
        this.__electricConsumption = electricConsumption ?? 0;
        this.__water               = water               ?? 0;
        this.__waterProduction     = waterProduction     ?? 0;
        this.__waterConsumption    = waterConsumption    ?? 0;
        this.__food                = food                ?? 0;
    }

    // ============ GETTERS ============

    get money()                { return this.__money; }
    get electricity()          { return this.__electricity; }
    get electricityProduction(){ return this.__electricityProduction; }
    get electricConsumption()  { return this.__electricConsumption; }
    get water()                { return this.__water; }
    get waterProduction()      { return this.__waterProduction; }
    get waterConsumption()     { return this.__waterConsumption; }
    get food()                 { return this.__food; }

    // Balance neto de electricidad y agua (producción - consumo)
    get electricityBalance()   { return this.__electricityProduction - this.__electricConsumption; }
    get waterBalance()         { return this.__waterProduction - this.__waterConsumption; }

    // ============ SETTERS ============
    // Ahora sí apuntan a la variable privada (__) y no a sí mismos

    set money(value) {
        if (value >= 0) this.__money = value;
    }
    set electricity(value) {
        if (value >= 0) this.__electricity = value;
    }
    set electricityProduction(value) {
        if (value >= 0) this.__electricityProduction = value;
    }
    set electricConsumption(value) {
        if (value >= 0) this.__electricConsumption = value;
    }
    set water(value) {
        if (value >= 0) this.__water = value;
    }
    set waterProduction(value) {
        if (value >= 0) this.__waterProduction = value;
    }
    set waterConsumption(value) {
        if (value >= 0) this.__waterConsumption = value;
    }
    set food(value) {
        if (value >= 0) this.__food = value;
    }

    // ============ MÉTODOS ============

    // Verificar si hay dinero suficiente para construir algo
    canAfford(cost) {
        return this.__money >= cost;
    }

    // Gastar dinero al construir un edificio o vía
    // Retorna true si pudo gastar, false si no hay suficiente dinero
    spendMoney(amount) {
        if (amount > 0 && this.canAfford(amount)) {
            this.__money -= amount;
            return true;
        }
        return false;
    }

    // Agregar ingresos (edificios comerciales/industriales)
    addIncome(amount) {
        if (amount > 0) {
            this.__money += amount;
        }
    }

    // Este es el método más importante.
    // Se llama cada turno desde TurnSystem.
    // Recorre todos los edificios y recalcula los recursos.
    updateResources(buildings) {
        // Reiniciamos los contadores de producción y consumo
        let totalElectricityProduction = 0;
        let totalElectricityConsumption = 0;
        let totalWaterProduction = 0;
        let totalWaterConsumption = 0;
        let totalFoodProduction = 0;
        let totalIncome = 0;

        buildings.forEach(building => {
            // Todos los edificios consumen electricidad y agua
            totalElectricityConsumption += building._electricityConsumption || 0;
            totalWaterConsumption       += building._waterConsumption       || 0;

            // Las plantas de utilidad producen electricidad o agua
            if (building instanceof UtilityPlant) {
                if (building._productionType === "electricity") {
                    totalElectricityProduction += building._productionAmount || 0;
                } else if (building._productionType === "water") {
                    totalWaterProduction += building._productionAmount || 0;
                }
            }

            // Los edificios comerciales generan dinero (solo si hay electricidad)
            if (building instanceof CommercialBuilding) {
                if (this.electricityBalance >= 0) {
                    totalIncome += building._incomePerTurn || 0;
                }
            }

            // Las fábricas generan dinero, las granjas generan comida
            if (building instanceof IndustrialBuilding) {
                if (building._productionType === "money") {
                    // Fábrica: genera dinero si tiene agua y electricidad
                    if (this.electricityBalance >= 0 && this.waterBalance >= 0) {
                        totalIncome += building._incomePerTurn || 0;
                    } else {
                        // Sin recursos produce al 50%
                        totalIncome += (building._incomePerTurn || 0) * 0.5;
                    }
                } else if (building._productionType === "food") {
                    // Granja: genera comida si tiene agua
                    if (this.waterBalance >= 0) {
                        totalFoodProduction += building._productionAmount || 0;
                    } else {
                        totalFoodProduction += (building._productionAmount || 0) * 0.5;
                    }
                }
            }
        });

        // Guardamos los totales de producción y consumo
        this.__electricityProduction = totalElectricityProduction;
        this.__electricConsumption   = totalElectricityConsumption;
        this.__waterProduction       = totalWaterProduction;
        this.__waterConsumption      = totalWaterConsumption;

        // Aplicamos el balance: producción - consumo
        // Math.max(0, ...) evita que quede negativo en el stock
        // (el juego termina si el balance es negativo, eso lo maneja TurnSystem)
        this.__electricity = Math.max(0, totalElectricityProduction - totalElectricityConsumption);
        this.__water       = Math.max(0, totalWaterProduction - totalWaterConsumption);

        // Comida se acumula turno a turno
        this.__food += totalFoodProduction;

        // Sumamos los ingresos al dinero
        this.addIncome(totalIncome);
    }

    // Verifica si el juego debe terminar (electricidad o agua en negativo)
    // Retorna un objeto con el motivo si el juego terminó
    checkGameOver() {
        if (this.electricityBalance < 0) {
            return { gameOver: true, reason: "¡Te quedaste sin electricidad!" };
        }
        if (this.waterBalance < 0) {
            return { gameOver: true, reason: "¡Te quedaste sin agua!" };
        }
        return { gameOver: false };
    }

    // Resumen completo para guardar en LocalStorage o mostrar en UI
    getSummary() {
        return {
            money:                this.__money,
            electricity:          this.__electricity,
            electricityProduction: this.__electricityProduction,
            electricConsumption:  this.__electricConsumption,
            electricityBalance:   this.electricityBalance,
            water:                this.__water,
            waterProduction:      this.__waterProduction,
            waterConsumption:     this.__waterConsumption,
            waterBalance:         this.waterBalance,
            food:                 this.__food
        };
    }

    // Para poder reconstruir el objeto desde LocalStorage
    toJSON() {
        return this.getSummary();
    }
}
