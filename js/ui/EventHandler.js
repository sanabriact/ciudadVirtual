document.addEventListener("DOMContentLoaded", () => {

    let gridContainer = document.getElementById("grid");
    let btnNewCity = document.getElementById('btn-new-city');
    let btnCreateGame = document.getElementById('btn-create-game');
    let btnLoadGame = document.getElementById('btn-load-game');
    let btnDeleteGame = document.getElementById('btn-delete-game');
    let btnReturnStartPage = document.getElementById('return-start-page');
    let btnBack = document.querySelectorAll(".btn-back")
    let mapSizeDisplay = document.getElementById('map-size-display')
    let mapSizeSlider = document.getElementById('input-map-size')
    let inputRegion = document.getElementById('input-region')
    const cityRepository = new CityRepository();
    const weatherRepository = new WeatherService();
    const newsRepository = new NewsService();

    function loadCities() {
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

    function showScreen(screen_id) {
        // Ocultar todas las pantallas
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

        // Mostrar la que se pide
        document.getElementById(screen_id).classList.add('active');
    }

    // Intro → Crear ciudad
    btnNewCity.addEventListener('click', () => {
        showScreen('city-info-page');
        loadCities();
    });

    btnDeleteGame.addEventListener('click', () => {
        showScreen('delete-game-page')
    });

    btnLoadGame.addEventListener('click', () => {
        showScreen('load-game-page');
    })

    btnBack.forEach(function (btn) {
        btn.addEventListener("click", function () {
            showScreen('initial-page')
        })
    })

    btnReturnStartPage.addEventListener('click', () => {
        let response = confirm("¿Desea guardar partida?")

        if (!response) {
            response = confirm("¡Todo su progreso se perderá!")
        }

        if (response) {
            console.clear();
            showScreen('initial-page')
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

    let selectedEmoji = null; 

    btnCreateGame.addEventListener('click', () => {
        const gridSize = parseInt(document.getElementById("input-map-size").value);
        const grid = new Grid(gridSize, gridSize);
        grid.initGrid();

        showScreen('game-page');

        const gridContainer = document.getElementById("grid");
        GridRenderer.render(grid, gridContainer);

        gridContainer.addEventListener("click", (event) => {
            const cell = event.target.closest(".cell");
            if (!cell) return;

            if (selectedEmoji === null) {
                cell.innerHTML = "";
            } else if (selectedEmoji !== null && cell.innerHTML === "") {
                cell.innerHTML = `<h5 class="cell-info">${selectedEmoji}</h5>`;
                const x = cell.dataset.x;
                const y = cell.dataset.y;

                switch (selectedEmoji) {
                    case "🏠":
                        grid.cells[x][y].id = "R1";
                        const house = new ResidentialBuilding("R1","house",1000,5,3,x,y,4);
                        city._buildingManager.addBuilding(house);

                        break;
                    case "🏢":
                        grid.cells[x][y].id = "R2";
                        const apartment = new ResidentialBuilding("R2","apartment",3000,15,10,x,y,12);
                        city._buildingManager.addBuilding(apartment);
                        break;
                    case "🏬":
                        grid.cells[x][y].id = "C1";
                        const store = new CommercialBuilding("C1","store",2000,8,8,x,y,6,500);
                        city._buildingManager.addBuilding(store);
                        break;
                    case "🏣":
                        grid.cells[x][y].id = "C2";
                        const commercial = new CommercialBuilding("C2","commercial-center",8000,25,25,x,y,20,2000);
                        city._buildingManager.addBuilding(commercial);
                        break;
                    case "🏭":
                        grid.cells[x][y].id = "I1";
                        const factory = new IndustrialBuilding("I1","factory",5000,20,15,x,y,15,"money",800);
                        city._buildingManager.addBuilding(factory);
                        break;
                    case "🌾":
                        grid.cells[x][y].id = "I2";
                        const farm = new IndustrialBuilding("I2","farm",3000,0,10,x,y,8,"food",50);
                        city._buildingManager.addBuilding(farm);
                        break;
                    case "👮":
                        grid.cells[x][y].id = "S1";
                        const police = new ServiceBuilding("S1","police-station",4000,15,0,x,y,5,10);
                        city._buildingManager.addBuilding(police);
                        break;
                    case "🚒":
                        grid.cells[x][y].id = "S2";
                        const firefighters = new ServiceBuilding("S2","fire-fighters",4000,15,0,x,y,5,10);
                        city._buildingManager.addBuilding(firefighters);
                        break;
                    case "🏥":
                        grid.cells[x][y].id = "S3";
                        const hospital = new ServiceBuilding("S3","hospital",6000,20,10,x,y,7,10);
                        city._buildingManager.addBuilding(hospital);
                        break;
                    case "⚡":
                        grid.cells[x][y].id = "U1";
                        const powerPlant = new UtilityPlant("U1","power-plant",10000,0,0,x,y,"electricity",200);
                        city._buildingManager.addBuilding(powerPlant);
                        break;
                    case "💧":
                        grid.cells[x][y].id = "U2";
                        const waterPlant = new UtilityPlant("U2","water-plant",8000,20,0,x,y,"water",150);
                        city._buildingManager.addBuilding(waterPlant);
                        break;
                    case "🌳":
                        grid.cells[x][y].id = "P1";
                        const park = new Park("P1","park",1500,0,0,x,y,5);
                        city._buildingManager.addBuilding(park);
                        break;
                    case "🛣":
                        grid.cells[x][y].id = "R";
                        const road = new Road("R","road",x,y);
                        city._buildingManager.addBuilding(road);
                        break;
                }

            }
        });

        let cityName = document.getElementById("city-name")
        let cityMayor = document.getElementById("city-mayor")
        let cityValue = document.getElementById("input-city-name").value;
        let mayorValue = document.getElementById("input-mayor-name").value;

        cityName.textContent = `Ciudad: ${cityValue}`;
        cityMayor.textContent = `Alcalde: ${mayorValue}`;
    });

    buttonList.forEach((btn) => {
        btn.addEventListener('click', () => {
            if (btn === btnDemolish) {
                selectedEmoji = null;
            } else {
                selectedEmoji = btn.dataset.emoji;
            }
            //Para color del boton seleccionado
            buttonList.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    
});