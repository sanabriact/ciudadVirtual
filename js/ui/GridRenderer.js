class GridRenderer {
    static render(grid, container) {
        const cellSize = 60;
        container.style.display = "grid";
        container.style.gridTemplateColumns = `repeat(${grid.width}, ${cellSize}px)`;
        container.style.gridTemplateRows = `repeat(${grid.height}, ${cellSize}px)`;

        container.innerHTML = "";

        for (let row = 0; row < grid.height; row++) {
            for (let col = 0; col < grid.width; col++) {
                const cell = grid.cells[row][col];
                console.log(`Cell [${row}][${col}]:`, cell);

                const div = document.createElement("div");
                div.classList.add("cell");
                div.dataset.x = cell._x;
                div.dataset.y = cell._y;

                container.appendChild(div);
            }
        }
    }
}