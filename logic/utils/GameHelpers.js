class GameHelpers {

    static createNewGame() {
        if (city && city.turnSystem) {
            city.turnSystem.stop()
            CityBuilderStorage.stopAutoSave();
        };

        const gridSize = parseInt(document.getElementById("input-map-size").value);
        const cityValue = document.getElementById('input-city-name').value.trim();
        const mayorName = document.getElementById('input-mayor-name').value.trim();
        const inputRegion = document.getElementById('input-region');
        const selectedOption = inputRegion.options[inputRegion.selectedIndex];
        const regionLat = parseFloat(selectedOption.dataset.lat) || 0;
        const regionLon = parseFloat(selectedOption.dataset.lon) || 0;
        const cityNameContainer = document.getElementById('city-name');
        const cityMayorNameContainer = document.getElementById('city-mayor')
        let electricity = parseInt(document.getElementById("input-init-electricity").value);
        let water = parseInt(document.getElementById("input-init-water").value);
        let food = parseInt(document.getElementById("input-init-food").value);
        const turnDuration = parseInt(document.getElementById("input-turn-duration").value);
        const growthRate = parseInt(document.getElementById("input-growth-rate").value);
        const grid = new Grid(gridSize, gridSize);
        grid.initGrid();

        if (cityValue !== "") thereIsCityName = true;
        if (mayorName !== "") thereIsMayorName = true;

        if (!thereIsCityName || !thereIsMayorName || !thereIsRegion) {
            alert("Por favor, ingresa un nombre para la ciudad, el alcalde y/o selecciona una región.");
            return;
        }

        city = new City(cityValue, mayorName, regionLat, regionLon, gridSize, gridSize, 0, 0, grid, turnDuration);
        city.turnSystem = new TurnSystem(city, turnDuration);
        city.growthRate = growthRate;
        city.electricity = electricity;
        city.water = water;
        city.food = food;

        if (loadedMap) {
            const idToType = {
                "R": "road",
                "R1": "house",
                "R2": "apartment",
                "C1": "store",
                "C2": "commercial-center",
                "I1": "factory",
                "I2": "farm",
                "S1": "police-station",
                "S2": "firefighter-station",
                "S3": "hospital",
                "U1": "power-plant",
                "U2": "water-plant",
                "P1": "park"
            };

            loadedMap.forEach((row, y) => {
                row.forEach((cellId, x) => {
                    if (cellId === "g") return;
                    const type = idToType[cellId];
                    const building = city.buildingManager.createBuilding(type, x, y);
                    city.addBuilding(building);
                    city.setCellId(x, y, cellId);
                });
            });

            city.updateResources();
            loadedMap = null; // limpiar para la próxima partida
        }

        UIhelpers.updateUI();
        UIhelpers.showScreen('game-page');
        cityNameContainer.textContent = `Ciudad: ${cityValue}`;
        cityMayorNameContainer.textContent = `Alcalde: ${mayorName}`;
        const container = listenerHelpers.setupGridListener();
        GridRenderer.render(grid, container);
        city.startTurn();
        CityBuilderStorage.autoSave(city, CityBuilderStorage.keyCity);
    }

    static returnToStartPage() {
        let response = confirm("¿Desea salir de la partida?")
        if (response) {
            CityBuilderStorage.save(city, CityBuilderStorage.keyCity);
            alert("Partida guardada exitosamente.")
            city.stopTurn();
            UIhelpers.showScreen('initial-page');
        }
    }
    
    static loadCityFromStorage() {
        let loadedCity = CityBuilderStorage.loadCity();
        if (loadedCity) {
            city = loadedCity;
            document.getElementById('city-name').textContent = `Ciudad: ${city.name}`;
            document.getElementById('city-mayor').textContent = `Alcalde: ${city.mayor}`;
            city.startTurn();
            const container = listenerHelpers.setupGridListener(selectedButton);
            GridRenderer.render(city.grid, container);
            UIhelpers.showScreen('game-page');
            CityBuilderStorage.autoSave(city, CityBuilderStorage.keyCity);
        } else {
            alert("No se encontró ninguna partida guardada.");
        }
    }
    
    static saveCityToStorage() {
        try {
            CityBuilderStorage.save(city, CityBuilderStorage.keyCity);
            alert("Partida guardada exitosamente.")
        } catch (error) {
            alert("Error al guardar partida")
            console.log(error)
        }
    }
    
    static loadSavedGames(id) {
        let savedGamesList = document.getElementById(id);
        savedGamesList.innerHTML = "";

        if (localStorage.getItem(CityBuilderStorage.keyCity)) {
            savedGamesList.innerHTML = `
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <span>🏙️ Partida guardada</span>
                </div>
            `;
        } else {
            savedGamesList.innerHTML = `<h2 class="screen-subtitle">No hay ciudades guardadas</h2>`;
        }
    }   
    
    static deleteGame() {
        if (localStorage.getItem(CityBuilderStorage.keyCity)) {
            CityBuilderStorage.clear()
            document.getElementById('delete-games-list').innerHTML = `
            <h2 class="screen-subtitle">Ciudades eliminadas</h2>`
            alert("Partida borrada exitosamente.")
            return true;
        } else {
            alert("No hay ciudades para borrar.")
            return false;
        }
    }

    static exportToJSON() {
        const data = CityBuilderStorage.loadCity();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], {
            type: "application/json"
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url;
        a.download = "cityBuilderGame.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a)
        URL.revokeObjectURL(url);
    }
}