document.addEventListener("DOMContentLoaded", () => {
    function showScreen(screenId) {
        // Ocultar todas las pantallas
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

        // Mostrar la que se pide
        document.getElementById(screenId).classList.add('active');
    }

    let gridContainer = document.getElementById("grid");
    let btnNewCity = document.getElementById('btn-new-city');
    let btnCreateGame = document.getElementById('btn-create-game');
    let btnBackPage = document.getElementById('btn-back-page');
    let btnLoadGame = document.getElementById('btn-load-game');
    let btnReturn = document.getElementById('return');
    let btnReturnStartPage = document.getElementById('return-start-page');

    // Intro → Crear ciudad
    btnNewCity.addEventListener('click', () => {
        showScreen('city-info-page');
    });

    btnLoadGame.addEventListener('click', () => {
        showScreen('load-game-page');
    })

    btnReturn.addEventListener('click', () => {
        showScreen('initial-page')
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

    btnBackPage.addEventListener('click', () => {
        showScreen('initial-page')
    });

    btnReturnStartPage.addEventListener('click', () => {
        let response = confirm("¿Desea guardar partida?")

        if (response) {
            //Guardar información
        } else {
            alert("¡Todo su progreso se perderá!")
        }

        showScreen('initial-page')
    });

})
