document.addEventListener("DOMContentLoaded", () => {
    let btnNewCity = document.getElementById('btn-new-city');
    let btnCreateGame = document.getElementById('btn-create-game');
    let btnLoadGamePage = document.getElementById('btn-load-game-page');
    let btnDeleteGame = document.getElementById('btn-delete-game');
    let btnReturnStartPage = document.getElementById('return-start-page');
    let btnBack = document.querySelectorAll(".btn-back");
    let btnGameInfo = document.getElementById('btn-game-info');
    let btnLoadGame = document.getElementById('btn-load-game');
    let mapSizeDisplay = document.getElementById('map-size-display');
    let mapSizeSlider = document.getElementById('input-map-size');
    let inputRegion = document.getElementById('input-region');
    let saveGameButton = document.getElementById('save-game-button');
    let deleteGameButton = document.getElementById('delete-game-button');

    const weatherRepository = new WeatherService();
    const newsRepository = new NewsService();

    // =====================================================
    // 🗺️ NUEVO: Variables para el modo de rutas
    // ====================================================
    btnRoute = document.getElementById('btn-route'); // Botón de ruta en el HTML
    // =====================================================

    let buttonList = [
        document.getElementById('btn-demolish'),
        document.getElementById('btn-house'),
        document.getElementById('btn-apartment'),
        document.getElementById('btn-store'),
        document.getElementById('btn-commercial-center'),
        document.getElementById('btn-factory'),
        document.getElementById('btn-farm'),
        document.getElementById('btn-police-station'),
        document.getElementById('btn-firefighters'),
        document.getElementById('btn-hospital'),
        document.getElementById('btn-power-plant'),
        document.getElementById('btn-water-plant'),
        document.getElementById('btn-park'),
        document.getElementById('btn-road')
    ];

    saveGameButton.addEventListener('click', () => {
        try {
            CityBuilderStorage.save(city, CityBuilderStorage.keyCity);
            alert("Partida guardada exitosamente.")
        } catch (e) {
            alert("Error al guardar partida", e)
        }
    });

    btnNewCity.addEventListener('click', () => {
        helpers.showScreen('city-info-page');
        helpers.loadCities();
    });

    btnDeleteGame.addEventListener('click', () => {
        helpers.showScreen('delete-game-page');
        helpers.loadSavedGames('delete-games-list');
    });

    btnLoadGamePage.addEventListener('click', () => {
        helpers.showScreen('load-game-page');
        helpers.loadSavedGames('saved-games-list');
    });

    deleteGameButton.addEventListener('click', () => {
        if(helpers.deleteGame()){
            helpers.showScreen('initial-page');
        }
    })  

    btnGameInfo.addEventListener('click', () => {
        helpers.showScreen('game-info-page')
    });

    btnLoadGame.addEventListener('click', () => {
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
    });

    btnBack.forEach(function (btn) {
        btn.addEventListener("click", function () {
            helpers.showScreen('initial-page')
        })
    });

    btnReturnStartPage.addEventListener('click', () => {
        let response = confirm("¿Desea salir de la partida?")
        if(response){
            CityBuilderStorage.save(city, CityBuilderStorage.keyCity);
            alert("Partida guardada exitosamente.")
            city._turnSystem.stop();
            helpers.showScreen('initial-page');
        }
    });

    mapSizeSlider.addEventListener('input', () => {
        mapSizeDisplay.textContent = `${mapSizeSlider.value}x${mapSizeSlider.value}`;
    });

    inputRegion.addEventListener('change', function () {
        let option = this.options[this.selectedIndex];
        let lat = option.dataset.lat;
        let lon = option.dataset.lon;

        weatherRepository.getWeather(lat, lon)
            .then(data => {
                document.getElementById('city-temperature').textContent = `Temperatura: ${data.main.temp}°C`;
                document.getElementById('city-condition').textContent = `Condición: ${data.weather[0].description}`;
                document.getElementById('city-humidity').textContent = `Humedad: ${data.main.humidity}%`;
                document.getElementById('city-wind-velocity').textContent = `Velocidad del viento: ${data.wind.speed}m/s`;
            })
            .catch(() => {
                document.getElementById('city-temperature').textContent = `Temperatura: Error al conseguir temperatura.`;
                document.getElementById('city-condition').textContent = `Condición: Error al conseguir condición.`;
            });

        newsRepository.getNews("co")
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
    });

    btnCreateGame.addEventListener('click', () => {
        if (city && city._turnSystem) city._turnSystem.stop();

        const gridSize = parseInt(document.getElementById("input-map-size").value);
        const cityNameInput = document.getElementById("input-city-name");
        const cityMayorInput = document.getElementById("input-mayor-name");
        const cityValue = cityNameInput.value.trim();
        const mayorName = cityMayorInput.value.trim();
        const turnDuration = parseInt(document.getElementById("input-turn-duration").value);
        const growthRate = parseInt(document.getElementById("input-growth-rate").value);

        const grid = new Grid(gridSize, gridSize);
        grid.initGrid();

        city = new City(cityValue, mayorName, 0, 0, gridSize, gridSize, 0, 0, grid, turnDuration);
        city._turnSystem = new TurnSystem(city, turnDuration);
        city._turnSystem.start();
        city._citizenManager.growthRate = growthRate;

        helpers.showScreen('game-page');

        document.getElementById('city-name').textContent = `Ciudad: ${cityValue}`;
        document.getElementById('city-mayor').textContent = `Alcalde: ${mayorName}`;

        const container = helpers.setupGridListener();
        GridRenderer.render(grid, container);
    });

    buttonList.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.id === 'btn-demolish') {
                selectedButton = null;
            } else {
                selectedButton = {
                    img: btn.dataset.image,
                    type: btn.dataset.type
                };
            }
            buttonList.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // =====================================================
    // 🗺️ NUEVO: Listener del botón "Calcular Ruta"
    // Al hacer clic activa/desactiva el modo ruta
    // =====================================================
    btnRoute.addEventListener('click', () => {
        routeMode = !routeMode;  // Encender o apagar el modo ruta
        routeOrigin = null;      // Reiniciar origen cada vez

        RoutingService.clearRoute(); // Limpiar ruta pintada anterior

        if (routeMode) {
            // Modo ruta encendido: desactivar botones de construcción
            buttonList.forEach(b => b.classList.remove('active'));
            selectedButton = null;
            btnRoute.classList.add('active');
            btnRoute.textContent = '🗺️ Selecciona origen...';
        } else {
            // Modo ruta apagado
            btnRoute.classList.remove('active');
            btnRoute.textContent = '🗺️ Calcular Ruta';
        }
    });
    // =====================================================

});


// =====================================================
// 🗺️ NUEVO: setupGridListener en helpers.js
// Reemplaza el setupGridListener existente en helpers.js
// con esta versión que incluye el manejo del modo ruta.
//
// IMPORTANTE: Esto va en helpers.js, NO aquí.
// Lo dejamos como referencia:
// =====================================================
/*
static setupGridListener() {
    const gridContainer = document.getElementById("grid");
    const newContainer = gridContainer.cloneNode(true);
    gridContainer.parentNode.replaceChild(newContainer, gridContainer);

    newContainer.addEventListener("click", function (event) {
        const cell = event.target.closest(".cell");
        if (!cell) return;

        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);

        // 🗺️ NUEVO: Modo ruta — intercepta el clic antes que todo lo demás
        if (routeMode) {
            const cellData = city._grid.cells[y][x];

            // Solo se pueden seleccionar celdas con edificio (no pasto "g", no vía "R")
            if (cellData._id === "g" || cellData._id === "R") {
                alert("Selecciona un edificio como origen o destino.");
                return;
            }

            if (!routeOrigin) {
                // Primer clic → guardar como origen y resaltar
                routeOrigin = { x, y };
                cell.classList.add("route-highlight");
                document.getElementById('btn-route').textContent = '🗺️ Selecciona destino...';
            } else {
                // Segundo clic → calcular ruta hacia el destino
                RoutingService.calculateRoute(city._grid, routeOrigin.x, routeOrigin.y, x, y)
                    .then(route => {
                        if (route) RoutingService.highlightRoute(route);
                    });

                // Apagar modo ruta
                routeMode = false;
                routeOrigin = null;
                document.getElementById('btn-route').classList.remove('active');
                document.getElementById('btn-route').textContent = '🗺️ Calcular Ruta';
            }
            return; // Salir para no construir nada
        }
        // 🗺️ FIN bloque nuevo

        // Lo que ya existía (demoler / construir):
        if (selectedButton === null) {
            if (cell.innerHTML.trim() !== "") {
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
*/