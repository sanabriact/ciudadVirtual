class RoutingHelpers {
   
    static routing(cell, x, y) {
        if (routeMode) {
            const cellData = city.grid.cells[y][x];
            // Solo permite seleccionar edificios, no pasto ni vías
            if (cellData.id === "g" || cellData.id === "R") {
                alert("Selecciona un edificio como origen o destino, no una vía ni terreno vacío.");
                return;
            }

            if (!routeOrigin) {
                // Primer clic: guardar como ORIGEN
                routeOrigin = { x, y };
                cell.classList.add("route-highlight");
                document.getElementById('btn-route').textContent = '🗺️ Selecciona destino...';
            } else {
                // Segundo clic: calcular ruta al DESTINO
                RoutingService.calculateRoute(city.grid, routeOrigin.x, routeOrigin.y, x, y)
                    .then(route => {
                        if (route) RoutingService.highlightRoute(route);
                    });

                // Apagar modo ruta automáticamente
                routeMode = false;
                routeOrigin = null;
                document.getElementById('btn-route').classList.remove('active');
                document.getElementById('btn-route').textContent = '🗺️ Calcular Ruta';
            }
            return; // ← Importante: evita que construya o demuela
        }
    }
}