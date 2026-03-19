class CityBuilderStorage {

    static keyCity = "city"
    static keyResource = "resources"

    static save(object, key) {
        const json = JSON.stringify(object);
        const parsed = JSON.parse(json);
        console.log("JSON parseado:", parsed);
        localStorage.setItem(key, json);
    }

    static loadCity() {
        let cityData = localStorage.getItem(this.keyCity);
        if (!cityData) return null;

        const parsed = JSON.parse(cityData);
        // Reconstruir el grid
        const grid = new Grid(parsed._width, parsed._height);
        grid.initGrid();

        // Restaurar los ids de las celdas
        for (let row = 0; row < parsed._grid._cells.length; row++) {
            for (let col = 0; col < parsed._grid._cells[row].length; col++) {
                const savedCell = parsed._grid._cells[row][col];
                if (savedCell._id !== "g") {
                    grid._cells[row][col]._id = savedCell._id;
                }
            }
        }

        // Reconstruir la ciudad con las propiedades correctas
        const city = new City(
            parsed._name,
            parsed._mayor,
            parsed._regionLat,
            parsed._regionLon,
            parsed._width,
            parsed._height,
            parsed._score,
            parsed._hapinessAverage,
            grid
        );

        city._roads = parsed._roads || [];

        // Restaurar buildings
        if (parsed._buildingManager && parsed._buildingManager._buildings) {
            parsed._buildingManager._buildings.forEach(b => {
                const name = b._name.replace(/-\d+$/, "");
                const building = city._buildingManager.buildBuilding(name, b._x, b._y);

                if (building) {
                    building._residents = b._residents || 0;
                    building._employeesCount = b._employeesCount || 0;
                    city._buildingManager.addBuilding(building);
                }
            });
        }

        if (parsed._citizenManager && parsed._citizenManager._population) {
            parsed._citizenManager._population.forEach(c => {
                const name = c._name.replace(/-\d+$/, "");
                const citizen = new Citizen(name, c._happiness, c._hasHome, c._hasJob);
                city._citizenManager._population.addCitizen(citizen);
            });
        }

        // Restaurar growthRate
        if (parsed._citizenManager && parsed._citizenManager._growthRate) {
            city._citizenManager._growthRate = parsed._citizenManager._growthRate;
        }

        return city;
    }

    static loadResources() {
        let resourcesData = localStorage.getItem(this.keyResource);
        if (!resourcesData) return null;

        const parsed = JSON.parse(resourcesData);
        const resources = new ResourceManager(
            parsed._money,           // ← con _
            parsed._electricity,
            parsed._electricityProduction,
            parsed._electricConsumption,
            parsed._water,
            parsed._waterProduction,
            parsed._waterConsumption,
            parsed._food
        );

        return resources;
    }

    static clear(object) {
        localStorage.removeItem(object);
    }
}