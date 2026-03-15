document.addEventListener("DOMContentLoaded", () => {
  
    let gridContainer = document.getElementById("grid");
    let btnNewCity = document.getElementById('btn-new-city');
    let btnCreateGame = document.getElementById('btn-create-game');
    let btnBackPage = document.getElementById('btn-back-page');
    let btnLoadGame = document.getElementById('btn-load-game');
    let btnDeleteGame = document.getElementById('btn-delete-game');
    let btnReturn = document.getElementById('return');
    let btnReturnPage = document.getElementById('return-page')
    let btnReturnStartPage = document.getElementById('return-start-page');
    let mapSizeDisplay= document.getElementById('map-size-display')
    let mapSizeSlider = document.getElementById('input-map-size')
    let inputRegion = document.getElementById('input-region')
    const cityRepository = new CityRepository();

    //Funcion cargar ciudades para seleccionar ciudad en Region Geográfica
    //Muchachos, esta parte sirve para después hacer conexión a las APIS de News y Weather, y para mostrar ciudades. Voy a intentar explicarlo lo más facil posible.
    //Aclaro, esta función se llama al iniciar la pantalla de Crear Ciudad, está en las líneas 65-67.
    function loadCities(){
        //Se cambia el option en index.html para mostrar mensaje de cargando ciudades
        inputRegion.innerHTML = '<option value="">— Cargando ciudades —</option>';

        //Se obtienen las ciudades del objeto cityRepository
        cityRepository.getCities()
            .then(function(cities){
                //Se organizan las ciudades en orden alfabético
                cities.sort(function(city1,city2){
                    //Funcion que retorna una comparacion entre dos iteradores. En este caso, como son ciudades, retorna el orden entre city1 y city2 con una funcion interna llamada localeCompare.
                    return city1.name.localeCompare(city2.name);
                })
                //Cuando ya se hayan organizado las ciudades, se cambia la etiqueta option en index.html para que muestre mensaje de Selecciona una ciudad.
                inputRegion.innerHTML = '<option value="">— Selecciona una ciudad —</option>';

                //Se iteran todas las ciudades(ya en orden alfabetico)
                cities.forEach(function(city){
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
            .catch(function(error){
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

    btnLoadGame.addEventListener('click', () => {
        showScreen('load-game-page');
    })

    btnReturnPage.addEventListener('click', () => {
        showScreen('initial-page');
    });

    btnReturn.addEventListener('click', () => {
        showScreen('initial-page')
    })

    btnBackPage.addEventListener('click', () => {
        showScreen('initial-page')
    });

    btnDeleteGame.addEventListener('click', () => {
        showScreen('delete-game-page')
    })
    btnCreateGame.addEventListener('click', () => {

        const gridSize = document.getElementById("input-map-size").value;
        console.log("gridSize:", gridSize);

        const grid = new Grid(gridSize, gridSize);
        console.log("grid creado:", grid);

        grid.initGrid();
        console.log("cells después de initGrid:", grid.cells);

        showScreen('game-page');
        const gridContainer = document.getElementById("grid");
        console.log("gridContainer:", gridContainer);
        GridRenderer.render(grid, gridContainer);

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

    btnReturnStartPage.addEventListener('click', () => {
        let response = confirm("¿Desea guardar partida?")

        if(!response){
            response = confirm("¡Todo su progreso se perderá!")
        }

        if(response){
            showScreen('initial-page')
        }
    });

    mapSizeSlider.addEventListener('input', () => {
        mapSizeDisplay.textContent = `${mapSizeSlider.value}x${mapSizeSlider.value}`;
    })

})
