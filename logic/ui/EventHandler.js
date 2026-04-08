let city = null;
let turnSystem = null;
let selectedButton = null;
let loadedMap = null;

// Variables globales para el modo ruta
let routeMode = false;
let routeOrigin = null;

let thereIsCityName = false;
let thereIsMayorName = false;
let thereIsRegion = false;

document.addEventListener("DOMContentLoaded", () => {
    let btnNewCityPage = document.getElementById('btn-new-city-page');
    let btnCreateGame = document.getElementById('btn-create-game');
    let btnLoadGamePage = document.getElementById('btn-load-game-page');
    let btnDeleteGamePage = document.getElementById('btn-delete-game-page');
    let btnReturnStartPage = document.getElementById('return-start-page');
    let btnBack = document.querySelectorAll(".btn-back");
    let btnGameInfo = document.getElementById('btn-game-rules-page');
    let btnLoadGame = document.getElementById('btn-load-game');
    let mapSizeDisplay = document.getElementById('map-size-display');
    let mapSizeSlider = document.getElementById('input-map-size');
    let inputRegion = document.getElementById('input-region');
    let exportButton = document.getElementById('export')
    let btnLoadJSON = document.getElementById('btn-load-json');
    let deleteGameButton = document.getElementById('delete-game-button');
    let btnRoute = document.getElementById('btn-route');
    let constructionsInfo = document.querySelectorAll('.chevron');
    let constructionsInfoDivs = document.querySelectorAll('[id$="-info"]');
    let btnLoadTXT = document.getElementById('btn-load-txt');

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

    btnNewCityPage.addEventListener('click', () => {
        UIhelpers.showScreen('city-info-page');
        ServicesHelpers.loadCities();
    });

    btnDeleteGamePage.addEventListener('click', () => {
        UIhelpers.showScreen('delete-game-page');
        GameHelpers.loadSavedGames('delete-games-list');
    });

    btnLoadGamePage.addEventListener('click', () => {
        UIhelpers.showScreen('load-game-page');
        GameHelpers.loadSavedGames('saved-games-list');
    });

    deleteGameButton.addEventListener('click', () => {
        if (GameHelpers.deleteGame()) {
            UIhelpers.showScreen('initial-page');
        }
    })

    btnGameInfo.addEventListener('click', () => {
        UIhelpers.showScreen('game-info-page')
    });

    btnLoadGame.addEventListener('click', () => {
        GameHelpers.loadCityFromStorage();

        constructionsInfo.forEach(btn => {
            btn.textContent = '∨';
            btn.classList.remove('open');
        });

        constructionsInfoDivs.forEach(div => {
            div.innerHTML = '';
        });

    });

    btnBack.forEach(function (btn) {
        btn.addEventListener("click", function () {
            UIhelpers.showScreen('initial-page')
        })
    });

    btnReturnStartPage.addEventListener('click', () => {
        GameHelpers.returnToStartPage();
    });

    mapSizeSlider.addEventListener('input', () => {
        mapSizeDisplay.textContent = `${mapSizeSlider.value}x${mapSizeSlider.value}`;
    });

    exportButton.addEventListener('click', () => {
        response = confirm("Se guardará un archivo con la información de la ciudad.")

        if (response) {
            GameHelpers.exportToJSON();
        }
    });

    btnLoadJSON.addEventListener('click', () => {
        listenerHelpers.importFromJSON();
    });

    btnLoadTXT.addEventListener('click', () => {
        listenerHelpers.importMapFromFile();
    })

    inputRegion.addEventListener('change', function () {
        let option = this.options[this.selectedIndex];
        let lat = option.dataset.lat;
        let lon = option.dataset.lon;

        ServicesHelpers.getWeatherService(lat, lon);
        ServicesHelpers.getNewsService("us");
    });

    btnCreateGame.addEventListener('click', () => {
        GameHelpers.createNewGame();
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

    constructionsInfo.forEach(btn => {
        btn.addEventListener('click', () => {
            let isOpen = btn.textContent.trim() === '∧';
            let type = btn.previousElementSibling.dataset.type;
            let infoDiv = document.getElementById(btn.dataset.target);

            btn.textContent = isOpen ? '∨' : '∧';
            btn.classList.toggle('open', !isOpen);

            if (!isOpen) {
                let panel = BuildingHelpers.createInfoContainer(type);
                infoDiv.appendChild(panel);
            } else {
                infoDiv.innerHTML = '';
            }

        });
    });

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

    document.querySelectorAll('.resource-edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!city) return;

            const resource = btn.dataset.resource;
            const value = parseInt(document.getElementById(`edit-${resource}`).value) || 0;

            if (resource === 'electricity') city.electricity = value;
            if (resource === 'water') city.water = value;
            if (resource === 'food') city.food = value;

            UIhelpers.updateUI();
        });
    });

    window.addEventListener('load', UIhelpers.adjustGamePageOffset);
    window.addEventListener('resize', UIhelpers.adjustGamePageOffset);
});