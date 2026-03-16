class localStorage{

    static keyCity = "city"
    static keyResource = "resources"
    
    static save(object, key) {
        const json = JSON.stringify(object);
        localStorage.setItem(key, json);
    }

    static loadCity() {
        const cityData = localStorage.getItem(this.keyCity);
        if (!cityData) return null;

        const parsed = JSON.parse(cityData);
        // Reconstruimos la ciudad
        const city = new City(
            parsed.name,
            parsed.mayor,
            parsed.regionLat,
            parsed.regionLon,
            parsed.width,
            parsed.height
        );

        city.score = parsed.score;
        city.roads = parsed.roads || [];

        // Restaurar managers
        if (parsed.buildings) {
            parsed.buildings.forEach(building => {
                city.buildingManager.createBuilding(building);
            });
        }

        //Restaurar citizens
        if (parsed.citizens) {
            parsed.citizens.forEach(citizen => {
                city.citizenManager.createCitizen(c);
            });
        }

        return city;
    }

    static loadResources() {
        const resourcesData = localStorage.getItem(this.keyResource);
        if (!resourcesData) return null;

        const parsed = JSON.parse(resourcesData);
        const resources = new ResourceManager(
            parsed.money,
            parsed.electricity,
            parsed.electricityProduction,
            parsed.electricConsumption,
            parsed.water,
            parsed.waterProduction,
            parsed.waterConsumption,
            parsed.food
        );
        
        return resources;
    }

    static clear(object) {
        localStorage.removeItem(object);
    }
}