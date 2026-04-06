class helpers {
    static updateUI() {
        const money = document.getElementById('money');
        money.textContent = `💵 $${city.money}`;
        document.getElementById('edit-electricity').value = `${city.electricity}`;
        document.getElementById('edit-water').value = `${city.water}`;
        document.getElementById('edit-food').value = `${city.food}`;
        document.getElementById('population').textContent = `👥 ${city.population.length}`;
        document.getElementById('happiness').textContent = `😊 ${city.calculateHappiness(city.buildings)}%`;
        document.getElementById('score-panel').textContent = `${city.score}`;

        money.classList.remove('money-green', 'money-yellow', 'money-red');

        if (city.money < 1000) {
            money.classList.add('money-red');
        } else if (city.money < 5000) {
            money.classList.add('money-yellow');
        } else {
            money.classList.add('money-green');
        }
    }

    static buildNewBuilding(type, x, y) {
        const building = city.buildingManager.createBuilding(type, x, y);

        if (!building) {
            return null;
        }

        if (city.canAfford(building)) {
            city.spendMoney(building);
            city.addBuilding(building);
            city.grid.setCellId(x, y, building.id);
            helpers.updateUI()
            return building;
        } else {
            alert("No tienes suficiente dinero para construir esto.");
            return null;
        }
    }

    static loadCities() {
        const cityService = new CityService();
        const inputRegion = document.getElementById('input-region');
        inputRegion.innerHTML = '<option value="">— Cargando ciudades —</option>';
        cityService.getCities()
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

    static getWeatherService(lat, lon) {
        const weatherRepository = new WeatherService();
        weatherRepository.getWeather(lat, lon)
            .then(data => {
                document.getElementById('city-temperature').textContent = `Temperatura: ${data.main.temp}°C`;
                document.getElementById('city-condition').textContent = `Condición: ${data.weather[0].description}`;
                document.getElementById('city-humidity').textContent = `Humedad: ${data.main.humidity}%`;
                document.getElementById('city-wind-velocity').textContent = `Velocidad del viento: ${data.wind.speed}m/s`;
                thereIsRegion = true;
            })
            .catch(() => {
                document.getElementById('city-temperature').textContent = `Temperatura: Error al conseguir temperatura.`;
                document.getElementById('city-condition').textContent = `Condición: Error al conseguir condición.`;
            });
    }

    static getNewsService(country) {
        const newsRepository = new NewsService();
        newsRepository.getNews(country)
            .then(data => {
                let newsPanel = document.getElementById('news-panel');
                newsPanel.innerHTML = '';
                data.articles.slice(0, 5).forEach(article => {
                    let card = document.createElement('div');
                    card.className = 'card mb-2';
                    card.innerHTML = `
                        <div class="card-body">
                            <h5 class="article-title">${article.title}</h5>
                            <p>${article.description}</p>
                            <a href="${article.url}">Link</a>
                            <img src="${article.urlToImage}" alt="news image" class="news-image">
                        </div>
                    `;
                    newsPanel.appendChild(card);
                });
            })
            .catch(() => {
                document.getElementById('news-title').textContent = `Título noticia: Error al conseguir el titulo`;
                document.getElementById('news-info').textContent = `Descripcion: Error al conseguir descripcion.`;
            });

    }

    static showScreen(screen_id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screen_id).classList.add('active');
    }

    static buildValidation(x, y, type) {
        if (type === "road") return true;
        x = parseInt(x);
        y = parseInt(y);

        const adyacent = [[0, -1], [0, 1], [-1, 0], [1, 0]];

        for (const [dx, dy] of adyacent) {
            const row = city.grid.cells[y + dy];
            const cell = row ? row[x + dx] : undefined;
            if (cell && cell.id === 'R') return true;
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

    static setupGridListener() {
        const gridContainer = document.getElementById("grid");
        const newContainer = gridContainer.cloneNode(true);
        gridContainer.parentNode.replaceChild(newContainer, gridContainer);

        newContainer.addEventListener("click", function (event) {
            const cell = event.target.closest(".cell");
            if (!cell) return;

            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);

            helpers.routing(cell, x, y);
            helpers.renderCellImage(cell, x, y);

        });
        return newContainer;
    }

    static renderCellImage(cell, x, y) {
        if (selectedButton === null) {
            // Solo demoler si hay algo Y el botón demoler está activo en la UI
            const btnDemolish = document.getElementById('btn-demolish');
            if (cell.innerHTML.trim() !== "" && btnDemolish.classList.contains('active')) {
                city.deleteBuilding(x, y);
                city.setCellId(x, y, "g");
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
    }

    static routing(cell, x, y) {
        if (routeMode) {
            const cellData = city.grid.cells[y][x];
            // Solo permite seleccionar edificios, no pasto ni vías
            if (cellData.id === "g" || cellData.id === "R") {
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
                RoutingService.calculateRoute(city.grid, routeOrigin.x, routeOrigin.y, x, y)
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
    }

    static loadCityFromStorage() {
        let loadedCity = CityBuilderStorage.loadCity();
        if (loadedCity) {
            city = loadedCity;
            document.getElementById('city-name').textContent = `Ciudad: ${city.name}`;
            document.getElementById('city-mayor').textContent = `Alcalde: ${city.mayor}`;
            city.startTurn();
            const container = helpers.setupGridListener(selectedButton);
            GridRenderer.render(city.grid, container);
            helpers.showScreen('game-page');
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

        helpers.updateUI();
        helpers.showScreen('game-page');
        cityNameContainer.textContent = `Ciudad: ${cityValue}`;
        cityMayorNameContainer.textContent = `Alcalde: ${mayorName}`;
        const container = helpers.setupGridListener();
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
            helpers.showScreen('initial-page');
        }
    }

    static getBuildingInfo(type) {
        const info = {

            'house': { name: 'Casa', cost: 1000, capacity: 4, jobs: null, income: null, production: null, electricity: 5, water: 3, food: null, happiness: null, radius: null },
            'apartment': { name: 'Apartamento', cost: 3000, capacity: 12, jobs: null, income: null, production: null, electricity: 15, water: 10, food: null, happiness: null, radius: null },
            'store': { name: 'Tienda', cost: 2000, capacity: null, jobs: 6, income: 500, production: null, electricity: 8, water: null, food: null, happiness: null, radius: null },
            'commercial-center': { name: 'Centro Comercial', cost: 8000, capacity: null, jobs: 20, income: 2000, production: null, electricity: 25, water: null, food: null, happiness: null, radius: null },
            'factory': { name: 'Fábrica', cost: 5000, capacity: null, jobs: 15, income: 800, production: null, electricity: 20, water: 15, food: null, happiness: null, radius: null },
            'farm': { name: 'Granja', cost: 3000, capacity: null, jobs: 8, income: null, production: 50, electricity: null, water: 10, food: 50, happiness: null, radius: null },
            'police-station': { name: 'Policía', cost: 4000, capacity: null, jobs: null, income: null, production: null, electricity: 15, water: null, food: null, happiness: 10, radius: 5 },
            'firefighter-station': { name: 'Bomberos', cost: 4000, capacity: null, jobs: null, income: null, production: null, electricity: 15, water: null, food: null, happiness: 10, radius: 5 },
            'hospital': { name: 'Hospital', cost: 6000, capacity: null, jobs: null, income: null, production: null, electricity: 20, water: 10, food: null, happiness: 10, radius: 7 },
            'power-plant': { name: 'Planta Eléctrica', cost: 10000, capacity: null, jobs: null, income: null, production: 200, electricity: null, water: null, food: null, happiness: null, radius: null },
            'water-plant': { name: 'Planta de Agua', cost: 8000, capacity: null, jobs: null, income: null, production: 150, electricity: 20, water: null, food: null, happiness: null, radius: null },
            'park': { name: 'Parque', cost: 1500, capacity: null, jobs: null, income: null, production: null, electricity: null, water: null, food: null, happiness: 5, radius: null },
            'road': { name: 'Vía', cost: 100, capacity: null, jobs: null, income: null, production: null, electricity: null, water: null, food: null, happiness: null, radius: null },
        };

        return info[type] ?? null;
    }

    static createInfoContainer(type) {
        const data = helpers.getBuildingInfo(type);
        if (!data) return null;

        const container = document.createElement('div');
        container.classList.add('building-info-panel');

        let html = `<ul class="building-info-list">`;

        if (data.cost) html += `<li>💰 Costo: $${data.cost.toLocaleString()}</li>`;
        if (data.capacity) html += `<li>👥 Capacidad: ${data.capacity} ciudadanos</li>`;
        if (data.jobs) html += `<li>💼 Empleos: ${data.jobs}</li>`;
        if (data.income) html += `<li>📈 Ingreso: $${data.income}/turno</li>`;
        if (data.production) html += `<li>🏭 Producción: ${data.production}</li>`;
        if (data.electricity) html += `<li>⚡ Electricidad: ${data.electricity} u/t</li>`;
        if (data.water) html += `<li>💧 Agua: ${data.water} u/t</li>`;
        if (data.food) html += `<li>🌾 Alimentos: ${data.food}/turno</li>`;
        if (data.happiness) html += `<li>😊 Felicidad: +${data.happiness}</li>`;
        if (data.radius) html += `<li>📡 Radio: ${data.radius} celdas</li>`;

        html += '</ul>';
        container.innerHTML = html;

        return container;
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

    static importFromJSON() {
        const input = document.createElement("input")
        input.type = "file";
        input.accept = ".json";
        input.addEventListener("change", (event) => {
            const file = event.target.files[0]
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    CityBuilderStorage.save(data, CityBuilderStorage.keyCity)
                } catch {
                    alert("Archivo inválido.")
                }
            };
            reader.readAsText(file)
        });

        input.click();
    }

    static importMapFromFile() {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = ".txt"

        input.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const rows = e.target.result
                        .trim()
                        .split("\n")
                        .map(line => line.trim().split(/\s+/));
                    //.split(/\s+/) hace que se revisen los espacios y se cree un arreglo de filas.
                    // Validar que todas las filas tengan el mismo ancho
                    const width = rows[0].length;
                    rows.forEach((row, i) => {
                        if (row.length !== width)
                            throw new Error(`Fila ${i + 1} tiene ${row.length} columnas, se esperaban ${width}.`);
                    });

                    if (rows.length < 15 || rows.length > 30) {
                        alert("El mapa no tiene un tamaño correcto.")
                        return;
                    }

                    const adyacent = [[0, -1], [0, 1], [-1, 0], [1, 0]];
                    let isCorrect = true
                    rows.forEach((row, y) => {
                        row.forEach((cellId, x) => {
                            if (cellId === "g" || cellId === "R") return; // vacío o vía, se salta

                            const hasAdyacentRow = adyacent.some(([dx, dy]) => {
                                const neighborRow = rows[y + dy];
                                const neighbor = neighborRow ? neighborRow[x + dx] : undefined;
                                return neighbor === "R";
                            });

                            if (!hasAdyacentRow) {
                                alert(`El edificio "${cellId}" en (${x}, ${y}) no tiene una vía adyacente.`);
                                isCorrect = false
                            }
                        });
                    });

                    if (isCorrect) {
                        loadedMap = rows;
                        alert("Mapa cargado. Completa los datos de la ciudad y presiona Crear.");
                        document.getElementById('map-size-display').textContent = `${rows.length}x${rows.length}`
                        document.getElementById('input-map-size').value = rows.length;
                    }

                } catch (e) {
                    alert("Formato erróneo.")
                    console.log(e)
                }
            };
            reader.readAsText(file);
        });

        input.click();
    }

    static adjustGamePageOffset() {
        const header = document.getElementById('header');
        const gamePage = document.getElementById('game-page');
        if (!header || !gamePage) return;

        const h = header.offsetHeight;
        gamePage.style.paddingTop = h + 'px';

        // Esto hace que map.css use la altura real del header
        document.documentElement.style.setProperty('--header-h', h + 'px');
    }
}