document.addEventListener("DOMContentLoaded", function() {
    let createGameButton = document.getElementById("btn-create-game");
    let gridContainer = document.getElementById("grid");

    createGameButton.addEventListener("click", () => {
        let gridSize = document.getElementById("input-map-size").value;

        gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 40px)`;
        gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 40px)`;

        let html = "";
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                html += `<div class="cell" data-x="${row}" data-y="${col}"></div>`;

            }
        }
        gridContainer.innerHTML = html;
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
})