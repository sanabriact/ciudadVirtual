class GridRenderer {
    static render(grid, container) {
        const cellSize = 60;
        container.style.gridTemplateColumns = `repeat(${grid.width}, ${cellSize}px)`;
        container.style.gridTemplateRows = `repeat(${grid.height}, ${cellSize}px)`;

        container.innerHTML = "";

        for (let row = 0; row < grid.height; row++) {
            for (let col = 0; col < grid.width; col++) {
                const cell = grid.cells[row][col];

                const div = document.createElement("div");
                div.classList.add("cell");
                div.dataset.x = col;   // columna = x horizontal
                div.dataset.y = row;   // fila = y vertical

                container.appendChild(div);
            }
        }
    }
}