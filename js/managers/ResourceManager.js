class ResourceManager {
    constructor(money, electricity, electricityProduction, electricConsumption,
        water, waterProduction, waterConsumption, food) {

        // Usamos __ para evitar recursión infinita en los setters
        this._money = money ?? 50000;
        this._electricity = electricity ?? 0;
        this._electricityProduction = electricityProduction ?? 0;
        this._electricConsumption = electricConsumption ?? 0;
        this._water = water ?? 0;
        this._waterProduction = waterProduction ?? 0;
        this._waterConsumption = waterConsumption ?? 0;
        this._food = food ?? 0;
    }

    // ============ SETTERS ============

    set money(value) {
        if (value >= 0) {

            this.__money = value;
        }
    }
    set electricity(value) {
        if (value >= 0) {
            this.__electricity = value;
        }
    }
    set electricityProduction(value) {
        if (value >= 0) {
            this.__electricityProduction = value;
        }
    }
    set electricConsumption(value) {
        if (value >= 0) { 
            this.__electricConsumption = value; 
        
        }
    }
    set water(value) {
        if (value >= 0) { 
            this.__water = value; 
        }
    }
    set waterProduction(value) {
        if (value >= 0) { 
            this.__waterProduction = value;
        }
    }
    set waterConsumption(value) {
        if (value >= 0) { 
            this.__waterConsumption = value; 
        }
    }
    set food(value) {
        if (value >= 0) { 
            this.__food = value; 
        }
    }

    // ============ MÉTODOS ============

    // ¿Hay suficiente dinero para construir algo?
    canAfford(cost) {
        return this.__money >= cost;
    }

    // Gastar dinero (al construir un edificio o vía)
    // Retorna true si pudo gastar, false si no alcanzaba el dinero
    spendMoney(amount) {
        if (amount > 0 && this.canAfford(amount)) {
            this.__money -= amount;
            return true;
        }
        return false;
    }

    // Sumar ingresos al dinero total
    addIncome(amount) {
        if (amount > 0) {
            this.__money += amount;
        }
    }

    // Método principal: se llama cada turno desde TurnSystem.
    // Recorre todos los edificios, calcula qué producen y qué consumen,
    // y actualiza todos los recursos de la ciudad.
    updateResources(buildings) {
        let totalElectricityProduction = 0;
        let totalElectricityConsumption = 0;
        let totalWaterProduction = 0;
        let totalWaterConsumption = 0;
        let totalFoodProduction = 0;
        let totalIncome = 0;

        buildings.forEach(building => {

            // Todos los edificios consumen electricidad y agua (los parques consumen 0)
            totalElectricityConsumption += building._electricityConsumption || 0;
            totalWaterConsumption += building._waterConsumption || 0;

            // Plantas de utilidad: producen electricidad o agua
            if (building instanceof UtilityPlant) {
                if (building._productionType === "electricity") {
                    totalElectricityProduction += building._productionAmount || 0;
                } else if (building._productionType === "water") {
                    // La planta de agua necesita electricidad para funcionar
                    // (su consumo ya está sumado arriba, eso la "frena" si no hay luz)
                    totalWaterProduction += building._productionAmount || 0;
                }
            }

            // Edificios comerciales: generan dinero solo si hay electricidad
            if (building instanceof CommercialBuilding) {
                const thereIsElectricity = (totalElectricityProduction - totalElectricityConsumption) >= 0;
                if (thereIsElectricity) {
                    totalIncome += building._incomePerTurn || 0;
                }
            }

            // Edificios industriales: fábricas (dinero) o granjas (comida)
            if (building instanceof IndustrialBuilding) {
                const thereIsElectricity = (totalElectricityProduction - totalElectricityConsumption) >= 0;
                const thereIsWater = (totalWaterProduction - totalWaterConsumption) >= 0;

                if (building._productionType === "money") {
                    // Fábrica: necesita electricidad Y agua
                    if (thereIsElectricity && thereIsWater) {
                        totalIncome += building._incomePerTurn || 0;
                    } else {
                        // Sin algún recurso produce al 50% (según el documento)
                        totalIncome += (building._incomePerTurn || 0) * 0.5;
                    }
                } else if (building._productionType === "food") {
                    // Granja: solo necesita agua
                    if (thereIsWater) {
                        totalFoodProduction += building._productionAmount || 0;
                    } else {
                        totalFoodProduction += (building._productionAmount || 0) * 0.5;
                    }
                }
            }
        });

        // Guardamos los totales de producción y consumo
        this.__electricityProduction = totalElectricityProduction;
        this.__electricConsumption = totalElectricityConsumption;
        this.__waterProduction = totalWaterProduction;
        this.__waterConsumption = totalWaterConsumption;

        // El stock nunca baja de 0 (Math.max lo protege)
        // Si el balance es negativo, checkGameOver() lo detecta aparte
        this.__electricity = Math.max(0, totalElectricityProduction - totalElectricityConsumption);
        this.__water = Math.max(0, totalWaterProduction - totalWaterConsumption);

        // La comida se acumula turno a turno
        this.__food += totalFoodProduction;

        // Sumamos los ingresos al dinero total
        this.addIncome(totalIncome);
    }

    // Verifica si el juego debe terminar.
    // Según el documento: electricidad o agua en balance negativo = game over.
    checkGameOver() {
        if (this.electricityBalance < 0) {
            return { gameOver: true, reason: "¡Te quedaste sin electricidad!" };
        }
        if (this.waterBalance < 0) {
            return { gameOver: true, reason: "¡Te quedaste sin agua!" };
        }
        return { gameOver: false };
    }
}