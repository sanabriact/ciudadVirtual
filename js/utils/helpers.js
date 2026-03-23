class helpers {
    static updateUI() {
        document.getElementById('money').textContent = `$${city._resourceManager._money}`;
        document.getElementById('electricity').textContent = `⚡ ${city._resourceManager._electricity}`;
        document.getElementById('water').textContent = `💧 ${city._resourceManager._water}`;
        document.getElementById('food').textContent = `🌾 ${city._resourceManager._food}`;
        document.getElementById('population').textContent = `👥 ${city._citizenManager._population.length}`;
        document.getElementById('happiness').textContent = `😊 ${city._citizenManager.calculateHappiness(city._buildingManager._buildings)}%`;
        document.getElementById('score-panel').textContent = `${city._scoreManager.calculateScore()}`;
    }

    static buildNewBuilding(type, x, y) {
        const building = city._buildingManager.createBuilding(type, x, y);
        if (city._resourceManager.canAfford(building)) {
            city._resourceManager.spendMoney(building);
            city._buildingManager.addBuilding(building);
            city._grid.setCellId(x, y, building._id);
            document.getElementById('money').textContent = `$${city._resourceManager._money}`;
            return building;
        } else {
            alert("No tienes suficiente dinero para construir esto.");
            return null;
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
                alert("Error al cargar ciudades")
                inputRegion.innerHTML = '<option value="">— Error al cargar ciudades —</option>';
            });
    }

    static showScreen(screen_id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screen_id).classList.add('active');
    }

    static buildValidation(x, y, type) {
        if (type === "Road") return true;
        x = parseInt(x);
        y = parseInt(y);

        const adyacent = [[0, -1], [0, 1], [-1, 0], [1, 0]];

        for (const [dx, dy] of adyacent) {
            const row = city._grid.cells[y + dy];
            const cell = row ? row[x + dx] : undefined;

            if (cell && cell._id === 'R') return true;
        }

        return false;
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

    // =====================================================
    // 🗺️ ACTUALIZADO: setupGridListener
    // Se agregó el bloque "Modo ruta" al inicio del click
    // Todo lo demás queda exactamente igual que antes
    // =====================================================
    static setupGridListener() {
        const gridContainer = document.getElementById("grid");
        const newContainer = gridContainer.cloneNode(true);
        gridContainer.parentNode.replaceChild(newContainer, gridContainer);

        newContainer.addEventListener("click", function (event) {
            const cell = event.target.closest(".cell");
            if (!cell) return;

            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);

            // -------------------------------------------------------
            if (routeMode) {
                const cellData = city._grid.cells[y][x];

                // Solo permite seleccionar edificios, no pasto ni vías
                if (cellData._id === "g" || cellData._id === "R") {
                    alert("Selecciona un edificio como origen o destino, no una vía ni terreno vacío.");
                    return;
                }

                if (!routeOrigin) {
                    // Primer clic: guardar como ORIGEN
                    routeOrigin = { x, y };
                    cell.classList.add("route-highlight");
                    document.getElementById('btn-route').textContent = '🗺️ Selecciona destino...';
                } else {
                    // Segundo clic: calcular ruta al DESTINO
                    RoutingService.calculateRoute(city._grid, routeOrigin.x, routeOrigin.y, x, y)
                        .then(route => {
                            if (route) RoutingService.highlightRoute(route);
                        });

                    // Apagar modo ruta automáticamente
                    routeMode = false;
                    routeOrigin = null;
                    document.getElementById('btn-route').classList.remove('active');
                    document.getElementById('btn-route').textContent = '🗺️ Calcular Ruta';
                }
                return; // ← Importante: evita que construya o demuela
            }
            // -------------------------------------------------------

            // Lo que ya existía — sin cambios:
            if (selectedButton === null) {
                // Solo demoler si hay algo Y el botón demoler está activo en la UI
                const btnDemolish = document.getElementById('btn-demolish');
                if (cell.innerHTML.trim() !== "" && btnDemolish.classList.contains('active')) {
                    city._buildingManager.deleteBuilding(x, y);
                    city._grid.setCellId(x, y, "g");
                    cell.innerHTML = "";
                }

            } else if (cell.innerHTML.trim() === "") {
                if (selectedButton.type === "road") {
                    let building = helpers.buildNewBuilding(selectedButton.type, x, y);

                    if (building !== null) {
                        cell.innerHTML = `<img src="${selectedButton.img}" class="cell-icon"/>`;
                    }

                } else if (helpers.buildValidation(x, y, selectedButton.type)) {
                    let building = helpers.buildNewBuilding(selectedButton.type, x, y);

                    if (building !== null) {
                        cell.innerHTML = `<img src="${selectedButton.img}" class="cell-icon"/>`;
                    }

                } else {
                    alert("No puedes construir aquí porque no hay una vía adyacente.");
                }
            }
        });

        return newContainer;
    }

    static loadCityFromStorage() {
        let loadedCity = CityBuilderStorage.loadCity();
        if (loadedCity) {
            city = loadedCity;
            city._turnSystem = new TurnSystem(city, city._turnDuration ?? 5);
            city._turnSystem.start();
            helpers.showScreen('game-page');
            const container = helpers.setupGridListener(selectedButton);
            GridRenderer.render(city._grid, container);
        } else {
            alert("No se encontró ninguna partida guardada.");
        }
    }

    static saveCityToStorage(){
        try {
            CityBuilderStorage.save(city, CityBuilderStorage.keyCity);
            alert("Partida guardada exitosamente.")
        } catch (e) {
            alert("Error al guardar partida", e)
        }
    }

    static createNewGame() {
        if (city && city._turnSystem) city._turnSystem.stop();

        const gridSize = parseInt(document.getElementById("input-map-size").value);
        const cityNameInput = document.getElementById("input-city-name");
        const cityMayorInput = document.getElementById("input-mayor-name");
        const cityValue = cityNameInput.value.trim();
        const mayorName = cityMayorInput.value.trim();
        let electricity = parseInt(document.getElementById("input-init-electricity").value);
        let water = parseInt(document.getElementById("input-init-water").value);
        let food = parseInt(document.getElementById("input-init-food").value);
        const turnDuration = parseInt(document.getElementById("input-turn-duration").value);
        const growthRate = parseInt(document.getElementById("input-growth-rate").value);

        const grid = new Grid(gridSize, gridSize);
        grid.initGrid();

        city = new City(cityValue, mayorName, 0, 0, gridSize, gridSize, 0, 0, grid, turnDuration);
        city._turnSystem = new TurnSystem(city, turnDuration);
        city._citizenManager.growthRate = growthRate;
        city._resourceManager._electricity = electricity;
        city._resourceManager._water = water;
        city._resourceManager._food = food;
        helpers.updateUI();
        document.getElementById('city-name').textContent = `Ciudad: ${cityValue}`;
        document.getElementById('city-mayor').textContent = `Alcalde: ${mayorName}`;
        const container = helpers.setupGridListener();
        GridRenderer.render(grid, container);
        city._turnSystem.start();
        helpers.showScreen('game-page');
    }

    static returnToStartPage(){
        let response = confirm("¿Desea salir de la partida?")
        if(response){
            CityBuilderStorage.save(city, CityBuilderStorage.keyCity);
            alert("Partida guardada exitosamente.")
            city._turnSystem.stop();
            helpers.showScreen('initial-page');
        }
    }
}