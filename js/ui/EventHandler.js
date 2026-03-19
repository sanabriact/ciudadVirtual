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
            /* CityBuilderStorage.save(city._resourceManager, CityBuilderStorage.keyResource); */
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
        /* let loadedResources = CityBuilderStorage.loadResources(); */
        if (loadedCity /* && loadedResources */) {
            city = loadedCity;
            /* city._resourceManager = loadedResources; */
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
/*             CityBuilderStorage.save(city._resourceManager, CityBuilderStorage.keyResource); */
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
});