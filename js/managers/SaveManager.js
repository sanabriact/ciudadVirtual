class CityStorage {

    static save(city) {
        const cityJSON = JSON.stringify(city);
        localStorage.setItem("city", cityJSON);
    }

    static load() {
        const cityData = localStorage.getItem("city");
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
            parsed.buildings.forEach(b => {
                city.buildingManager.createBuilding(b);
            });
        }

        //Restaurar citizens
        if (parsed.citizens) {
            parsed.citizens.forEach(c => {
                city.citizenManager.createCitizen(c);
            });
        }

        return city;
    }

    static clear() {
        localStorage.removeItem("city");
    }
}