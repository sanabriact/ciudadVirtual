class GridRenderer {

    static buildingImages = {
        "R1": "../../assets/icons/House.png",
        "R2": "../../assets/icons/Apartment.png",
        "C1": "../../assets/icons/Store.png",
        "C2": "../../assets/icons/Mall.png",
        "I1": "../../assets/icons/Factory.png",
        "I2": "../../assets/icons/Farm.png",
        "S1": "../../assets/icons/Police-station.png",
        "S2": "../../assets/icons/Firefighter-station.png",
        "S3": "../../assets/icons/Hospital.png",
        "U1": "../../assets/icons/Power-plant.png",
        "U2": "../../assets/icons/Water-plant.png",
        "P1": "../../assets/icons/Park.png",
        "R":  "../../assets/icons/Road.png"
    };

    static render(grid, container) {
    const cellSize = 60;

    container.style.display = "grid";
    container.style.gridTemplateColumns = `repeat(${grid.width}, ${cellSize}px)`;
    container.style.gridTemplateRows = `repeat(${grid.height}, ${cellSize}px)`;
    container.innerHTML = "";

    for (let row = 0; row < grid.height; row++) {
        for (let col = 0; col < grid.width; col++) {
            const cell = grid.cells[row][col];

            const div = document.createElement("div");
            div.classList.add("cell");
            div.dataset.x = col;
            div.dataset.y = row;

            if (cell._id !== "g") {
                const img = GridRenderer.buildingImages[cell._id];
                if (img) {
                    div.innerHTML = `<img src="${img}" class="cell-icon"/>`;
                }
            }

            container.appendChild(div);
        }
    }
}
}