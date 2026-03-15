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

    function loadCities(){
        inputRegion.innerHTML = '<option value="">— Cargando ciudades —</option>';
        cityRepository.getCities()
            .then(function(cities){
                cities.sort(function(city1,city2){
                    return city1.name.localeCompare(city2.name);
                })

                inputRegion.innerHTML = '<option value="">— Selecciona una ciudad —</option>';

                cities.forEach(function(city){
                    let option = document.createElement('option')
                    option.value = city.id;
                    option.textContent = city.name;
                    option.dataset.lat = city.latitude;
                    option.dataset.lon = city.longitude;
                    inputRegion.appendChild(option);
                })
            })
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
