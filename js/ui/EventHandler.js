document.addEventListener("DOMContentLoaded", () => {
    let btnNewCity = document.getElementById('btn-new-city');
    let btnCreateGame = document.getElementById('btn-create-game');
    let btnLoadGame = document.getElementById('btn-load-game');
    let btnDeleteGame = document.getElementById('btn-delete-game');
    let btnReturnStartPage = document.getElementById('return-start-page');
    let btnBack = document.querySelectorAll(".btn-back")
    let mapSizeDisplay = document.getElementById('map-size-display')
    let mapSizeSlider = document.getElementById('input-map-size')
    let inputRegion = document.getElementById('input-region');
    const weatherRepository = new WeatherService();
    const newsRepository = new NewsService();

    // Intro → Crear ciudad
    btnNewCity.addEventListener('click', () => {
        helpers.showScreen('city-info-page');
        helpers.loadCities();
    });

    btnDeleteGame.addEventListener('click', () => {
        helpers.showScreen('delete-game-page')
    });

    btnLoadGame.addEventListener('click', () => {
        helpers.showScreen('load-game-page');
    })

    btnBack.forEach(function (btn) {
        btn.addEventListener("click", function () {
            helpers.showScreen('initial-page')
        })
    })

    btnReturnStartPage.addEventListener('click', () => {
        let response = confirm("¿Desea guardar partida?")

        if (!response) {
            response = confirm("¡Todo su progreso se perderá!")
        }

        if (response) {
            console.clear();
            helpers.showScreen('initial-page')
        }
    });

    mapSizeSlider.addEventListener('input', () => {
        mapSizeDisplay.textContent = `${mapSizeSlider.value}x${mapSizeSlider.value}`;
    })


    inputRegion.addEventListener('change', function () {
        let option = this.options[this.selectedIndex];
        let lat = option.dataset.lat;
        let lon = option.dataset.lon;
        let temperatureData = document.getElementById('city-temperature');
        let cityCondition = document.getElementById('city-condition');
        let cityHumidity = document.getElementById("city-humidity");
        let cityWindVelocity = document.getElementById("city-wind-velocity");
        let newsTitle = document.getElementById('news-title');
        let newsInfo = document.getElementById('news-info')

        weatherRepository.getWeather(lat, lon)
            .then(function (data) {
                temperatureData.textContent = `Temperatura: ${data.main.temp}°C`
                cityCondition.textContent = `Condición: ${data.weather[0].description}`
                cityHumidity.textContent = `Humedad: ${data.main.humidity}%`
                cityWindVelocity.textContent = `Velocidad del viento: ${data.wind.speed}m/s`

            })
            .catch(function (error) {
                temperatureData.textContent = `Temperatura: Error al conseguir temperatura.`
                cityCondition.textContent = `Condición: Error al conseguir condición.`
            })

        newsRepository.getNews("co")
            .then(function (data) {
                console.log(data)
                let newsPanel = document.getElementById('news-panel');
                newsPanel.innerHTML = '';

                let news = data.articles.slice(0, 5);

                news.forEach(function (article) {
                    let card = document.createElement('div');

                    card.className = 'card mb-2';
                    card.innerHTML = `
                <div class="card-body">
                <h5 class="article-title">${article.title}</h6>
                <p>${article.description}</p>
                <a href="${article.url}">Link</a>
                    <img src="${article.urlToImage}" alt="news image" class="news-image">
                    </div>
                    `;
                    newsPanel.appendChild(card);
                });
            })
            .catch(function (error) {
                newsTitle.textContent = `Título noticia: Error al conseguir el titulo de la noticia`
                newsInfo.textContent = `Descripcion: Error al conseguir descripcion de la noticia.`
            })

    })

    let btnHouse = document.getElementById('btn-house');
    let btnApartment = document.getElementById('btn-apartment');
    let btnStore = document.getElementById('btn-store');
    let btnCommercial = document.getElementById('btn-commercial-center');
    let btnFactory = document.getElementById('btn-factory');
    let btnFarm = document.getElementById('btn-farm');
    let btnPolice = document.getElementById('btn-police-station');
    let btnFirefighters = document.getElementById('btn-firefighters');
    let btnHospital = document.getElementById('btn-hospital');
    let btnPowerPlant = document.getElementById('btn-power-plant');
    let btnWaterPlant = document.getElementById('btn-water-plant');
    let btnPark = document.getElementById('btn-park');
    let btnRoad = document.getElementById('btn-road');
    let btnDemolish = document.getElementById('btn-demolish');

    let buttonList = [btnDemolish, btnHouse, btnApartment, btnStore, btnCommercial, btnFactory, btnFarm, btnPolice, btnFirefighters, btnHospital, btnPowerPlant, btnWaterPlant, btnPark, btnRoad]
    let selectedButton = null;

    btnCreateGame.addEventListener('click', () => {
        const gridSize = parseInt(document.getElementById("input-map-size").value);
        const cityName = document.getElementById("input-city-name");
        const cityMayor = document.getElementById("input-mayor-name");
        const cityValue = cityName.value.trim();
        const mayorName = cityMayor.value.trim();
        const turnDuration = parseInt(document.getElementById("input-turn-duration").value);
        const gridContainer = document.getElementById("grid");
        const growthRate = parseInt(document.getElementById("input-growth-rate").value);

        const grid = new Grid(gridSize, gridSize);
        grid.initGrid();

        // ← Crear la ciudad aquí
        city = new City(cityValue, mayorName, 0, 0, gridSize, gridSize, 0, 0, grid);
        helpers.showScreen('game-page');
        city._turnSystem = new TurnSystem(city, turnDuration);
        city._turnSystem.start();
        city._citizenManager.growthRate = growthRate;
        GridRenderer.render(grid, gridContainer);

        gridContainer.addEventListener("click", function (event) {
            const cell = event.target.closest(".cell");
            if (!cell) return;

            const x = cell.dataset.x;
            const y = cell.dataset.y;

            if (selectedButton === null) {
                // DEMOLER
                if (cell.innerHTML.trim() !== "") {
                    city._buildingManager.deleteBuilding(x, y);
                    grid.setCellId(x, y, "g");
                    cell.innerHTML = "";
                }
            } else if (cell.innerHTML.trim() === "") {
                // CONSTRUIR
                cell.innerHTML = `<img src="${selectedButton.img}" class="cell-icon"/>`;
                helpers.buildNewBuilding(selectedButton.type, x, y);
                
                console.log(city.buildings);
            }
        });


        cityName.textContent = `Ciudad: ${cityValue}`;
        cityMayor.textContent = `Alcalde: ${mayorName}`;
    });

    buttonList.forEach((btn) => {
        btn.addEventListener('click', () => {
            if (btn === btnDemolish) {
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


