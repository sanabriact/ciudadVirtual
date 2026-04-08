class listenerHelpers{
    static setupGridListener() {
        const gridContainer = document.getElementById("grid");
        const newContainer = gridContainer.cloneNode(true);
        gridContainer.parentNode.replaceChild(newContainer, gridContainer);

        newContainer.addEventListener("click", function (event) {
            const cell = event.target.closest(".cell");
            if (!cell) return;

            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);

            RoutingHelpers.routing(cell, x, y);
            GridRenderer.renderCellImage(cell, x, y);

        });
        return newContainer;
    }

    static importFromJSON() {
        const input = document.createElement("input")
        input.type = "file";
        input.accept = ".json";
        input.addEventListener("change", (event) => {
            const file = event.target.files[0]
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    CityBuilderStorage.save(data, CityBuilderStorage.keyCity)
                } catch {
                    alert("Archivo inválido.")
                }
            };
            reader.readAsText(file)
        });

        input.click();
    }

    static importMapFromFile() {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = ".txt"

        input.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const rows = e.target.result
                        .trim()
                        .split("\n")
                        .map(line => line.trim().split(/\s+/));
                    //.split(/\s+/) hace que se revisen los espacios y se cree un arreglo de filas.
                    // Validar que todas las filas tengan el mismo ancho
                    const width = rows[0].length;
                    rows.forEach((row, i) => {
                        if (row.length !== width)
                            throw new Error(`Fila ${i + 1} tiene ${row.length} columnas, se esperaban ${width}.`);
                    });

                    if (rows.length < 15 || rows.length > 30) {
                        alert("El mapa no tiene un tamaño correcto.")
                        return;
                    }

                    const adyacent = [[0, -1], [0, 1], [-1, 0], [1, 0]];
                    let isCorrect = true
                    rows.forEach((row, y) => {
                        row.forEach((cellId, x) => {
                            if (cellId === "g" || cellId === "R") return; // vacío o vía, se salta

                            const hasAdyacentRow = adyacent.some(([dx, dy]) => {
                                const neighborRow = rows[y + dy];
                                const neighbor = neighborRow ? neighborRow[x + dx] : undefined;
                                return neighbor === "R";
                            });

                            if (!hasAdyacentRow) {
                                alert(`El edificio "${cellId}" en (${x}, ${y}) no tiene una vía adyacente.`);
                                isCorrect = false
                            }
                        });
                    });

                    if (isCorrect) {
                        loadedMap = rows;
                        alert("Mapa cargado. Completa los datos de la ciudad y presiona Crear.");
                        document.getElementById('map-size-display').textContent = `${rows.length}x${rows.length}`
                        document.getElementById('input-map-size').value = rows.length;
                    }

                } catch (e) {
                    alert("Formato erróneo.")
                    console.log(e)
                }
            };
            reader.readAsText(file);
        });

        input.click();
    }
}