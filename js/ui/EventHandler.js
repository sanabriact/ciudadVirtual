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

    //Funcion cargar ciudades para seleccionar ciudad en Region Geográfica
    //Muchachos, esta parte sirve para después hacer conexión a las APIS de News y Weather, y para mostrar ciudades. Voy a intentar explicarlo lo más facil posible.
    //Aclaro, esta función se llama al iniciar la pantalla de Crear Ciudad, está en las líneas 65-67.
    function loadCities() {
        //Se cambia el option en index.html para mostrar mensaje de cargando ciudades
        inputRegion.innerHTML = '<option value="">— Cargando ciudades —</option>';

        //Se obtienen las ciudades del objeto cityRepository
        cityRepository.getCities()
            .then(function (cities) {
                //Se organizan las ciudades en orden alfabético
                cities.sort(function (city1, city2) {
                    //Funcion que retorna una comparacion entre dos iteradores. En este caso, como son ciudades, retorna el orden entre city1 y city2 con una funcion interna llamada localeCompare.
                    return city1.name.localeCompare(city2.name);
                })
                //Cuando ya se hayan organizado las ciudades, se cambia la etiqueta option en index.html para que muestre mensaje de Selecciona una ciudad.
                inputRegion.innerHTML = '<option value="">— Selecciona una ciudad —</option>';

                //Se iteran todas las ciudades(ya en orden alfabetico)
                cities.forEach(function (city) {
                    //Se crea un elemento llamado option(sencillo de asimilar, ya que se estan SELECCIONANDO ciudades)
                    let option = document.createElement('option')
                    //Para este elemento, se le asignan atributos a partir del id, nombre, latitud y longitud de cada ciudad.
                    //Posteriormente, (no en esta parte de codigo, es una aclaración), latitud y longitud se usan en NewsServices y WeatherServices para mostrar las noticias y el clima de la región geográfica que uno selecciona.
                    option.value = city.id;
                    option.textContent = city.name;
                    option.dataset.lat = city.latitude;
                    option.dataset.lon = city.longitude;
                    //Después, se manda option como un objeto con atributos hacia el inputRegion(la etiqueta del index.html), y se muestra el nombre de la ciudad gracias a textContent. Se le asignan atributos a option ya que posteriormente se necesita esa información, así que queda guardada.
                    inputRegion.appendChild(option);
                })
            })
            //En caso de que algo salga mal, se cambia el option de index.html por Error al cargar ciudades.
            .catch(function (error) {
                console.log("Error al cargar ciudades")
                inputRegion.innerHTML = '<option value="">— Error al cargar ciudades —</option>';
            });
    }

    function showScreen(screenId) {
        // Ocultar todas las pantallas
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

        // Mostrar la que se pide
        document.getElementById(screenId).classList.add('active');
    }

    // Intro → Crear ciudad
    btnNewCity.addEventListener('click', () => {
        showScreen('city-info-page');
        loadCities();
    });

    btnDeleteGame.addEventListener('click', () => {
        showScreen('delete-game-page')
    });

    btnCreateGame.addEventListener('click', () => {

        const gridSize = document.getElementById("input-map-size").value;
        const grid = new Grid(gridSize, gridSize);
        grid.initGrid();

        showScreen('game-page');
        const gridContainer = document.getElementById("grid");
        GridRenderer.render(grid, gridContainer);

        let cityName = document.getElementById("city-name")
        let cityMayor = document.getElementById("city-mayor")
        let cityValue = document.getElementById("input-city-name").value;
        let mayorValue = document.getElementById("input-mayor-name").value;

        cityName.textContent = `Ciudad: ${cityValue}`;
        cityMayor.textContent = `Alcalde: ${mayorValue}`;
    });

    btnLoadGame.addEventListener('click', () => {
        showScreen('load-game-page');
    })

    btnBack.forEach(function(btn){
        btn.addEventListener("click", function(){
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

    gridContainer.addEventListener("click", function (event) {

        const cell = event.target.closest(".cell");
        if (!cell) return;

        if (cell.innerHTML === "") {
            cell.innerHTML = `<h5 class="cell-info">🏢</h3>`;
        } else {
            cell.innerHTML = "";
        }

    });

    mapSizeSlider.addEventListener('input', () => {
        mapSizeDisplay.textContent = `${mapSizeSlider.value}x${mapSizeSlider.value}`;
    })

    //Muchachos, este evento hace que las noticias y el clima funcionen. 
    //Empieza a funcionar desde que se le da click en Region Geografica a una ciudad, cuando se desea crear una CIudad Nueva.
    inputRegion.addEventListener('change', function () {
        //Se llaman todas las etiquetas del HTML necesarias. El this.options es una propiedad de la etiqueta <select></select>. 
        //En este caso se necesita llamar, ya que como les dije en la otra función que hice ahora, de ese select se traen los atributos de latitud y longitud para que funcione la API de noticias. 
        //Por eso se crean variables lat, lon con dataset.lon y dataset.lat.
        let option = this.options[this.selectedIndex];
        let lat = option.dataset.lat;
        let lon = option.dataset.lon;
        let temperatureData = document.getElementById('city-temperature');
        let cityCondition = document.getElementById('city-condition');
        let cityHumidity = document.getElementById("city-humidity");
        let cityWindVelocity = document.getElementById("city-wind-velocity");
        let newsTitle = document.getElementById('news-title');
        let newsInfo = document.getElementById('news-info')

        //Del objeto weatherRepository, se asignan los datos de la API.
        weatherRepository.getWeather(lat, lon)
            .then(function (data) {
                //Se cambia el contenido de la etiqueta temperatureData y cityCondition, por la temperatura y descripcion traída desde la API.
                temperatureData.textContent = `Temperatura: ${data.main.temp}°C`
                cityCondition.textContent = `Condición: ${data.weather[0].description}`
                cityHumidity.textContent = `Humedad: ${data.main.humidity}%`
                cityWindVelocity.textContent = `Velocidad del viento: ${data.wind.speed}m/s`

            })
            .catch(function (error) {
                //Sino se pueden traer los datos de la API, se cambia el contenido de cada etiqueta por un mensaje.
                temperatureData.textContent = `Temperatura: Error al conseguir temperatura.`
                cityCondition.textContent = `Condición: Error al conseguir condición.`
            })

        //Ahora, la API que nos dio el profesor, requiere del codigo del pais. En este caso, para colombia es "co", pero por ahora no salen noticias de cualquier ciudad de Colombia. Entonces, para fines demostrativos, puse el codigo para colombia "us" para que salgan noticias temporales por ahora. Después eso se cambia.
        newsRepository.getNews("us")
            .then(function (data) {
                console.log(data)
                //Se trae el div de id="news-panel" del HTML para todas las noticias.
                let newsPanel = document.getElementById('news-panel');
                //Se le asigna valor de string vacío por ahora.
                newsPanel.innerHTML = '';

                //Se crea una variable, con solo las primeras 3 noticias por ahora. 
                let news = data.articles.slice(0, 5);
                //Se itera cada noticia
                news.forEach(function (article) {
                    //Se crea una carta, como una espaciado entre noticias.
                    //Se crea esta carta como un div.
                    let card = document.createElement('div');
                    //Se le asigna class="card mb-2"
                    card.className = 'card mb-2';
                    //Se agrega el titulo, y la informacion de la noticia
                    card.innerHTML = `
                <div class="card-body">
                    <h5 class="article-title">${article.title}</h6>
                    <p>${article.description}</p>
                    <a href="${article.url}">Link</a>
                    <img src="${article.urlToImage}" alt="news image" class="news-image">
                </div>
            `;  
                    //Se manda esta información al div con id = "news-panel"
                    newsPanel.appendChild(card);
                });
            })
            .catch(function (error) {
                //Sino funciona, entonces se cambia la información de cada etiqueta del HTML, por un mensaje de error.
                newsTitle.textContent = `Título noticia: Error al conseguir el titulo de la noticia`
                newsInfo.textContent = `Descripcion: Error al conseguir descripcion de la noticia.`
            })

    })

})
