class helpers{
    static updateUI() {
        console.log("city:", city);
        console.log("resourceManager:", city._resourceManager);
        console.log("buildingManager:", city._buildingManager);
        console.log("buildings:", city._buildingManager._buildings);

        city._resourceManager.updateResources(city._buildingManager._buildings);

        console.log("money:", city._resourceManager._money);
        console.log("electricity:", city._resourceManager._electricity);
        console.log("water:", city._resourceManager._water);
        console.log("food:", city._resourceManager._food);

        document.getElementById('money').textContent = `$${city._resourceManager._money}`;
        document.getElementById('electricity').textContent = `⚡ ${city._resourceManager._electricity}`;
        document.getElementById('water').textContent = `💧 ${city._resourceManager._water}`;
        document.getElementById('food').textContent = `🌾 ${city._resourceManager._food}`;
        document.getElementById('happiness').textContent = `😊 ${city._citizenManager.calculateHappiness(city._buildingManager._buildings)}%`;
        document.getElementById('score-panel').textContent = `${city._scoreManager.calculateScore()}`;
    }

    static buildNewBuilding(type, x, y) {
        const building = city._buildingManager.buildBuilding(type);
        if (city._resourceManager.canAfford(building)) {
            city._resourceManager.spendMoney(building);
            city._buildingManager.addBuilding(building);
            city._grid.setCellId(x, y, building._id);
        }
    }

    static loadCities() {
        const cityRepository = new CityRepository();
        const inputRegion = document.getElementById('input-region');
        inputRegion.innerHTML = '<option value="">— Cargando ciudades —</option>';

        cityRepository.getCities()
            .then(function (cities) {
                cities.sort(function (city1, city2) {
                    return city1.name.localeCompare(city2.name);
                })

                inputRegion.innerHTML = '<option value="">— Selecciona una ciudad —</option>';

                cities.forEach(function (city) {
                    let option = document.createElement('option')

                    option.value = city.id;
                    option.textContent = city.name;
                    option.dataset.lat = city.latitude;
                    option.dataset.lon = city.longitude;

                    inputRegion.appendChild(option);
                })
            })
            .catch(function (error) {
                console.log("Error al cargar ciudades")
                inputRegion.innerHTML = '<option value="">— Error al cargar ciudades —</option>';
            });
    }

    static showScreen(screen_id) {
        // Ocultar todas las pantallas
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

        // Mostrar la que se pide
        document.getElementById(screen_id).classList.add('active');
    }
}