class BuildingHelpers {

    static buildNewBuilding(type, x, y) {
        const building = city.buildingManager.createBuilding(type, x, y);

        if (!building) {
            return null;
        }

        if (city.canAfford(building)) {
            city.spendMoney(building);
            city.addBuilding(building);
            city.grid.setCellId(x, y, building.id);
            UIhelpers.updateUI()
            return building;
        } else {
            alert("No tienes suficiente dinero para construir esto.");
            return null;
        }
    }

    static buildValidation(x, y, type) {
        if (type === "road") return true;
        x = parseInt(x);
        y = parseInt(y);

        const adyacent = [[0, -1], [0, 1], [-1, 0], [1, 0]];

        for (const [dx, dy] of adyacent) {
            const row = city.grid.cells[y + dy];
            const cell = row ? row[x + dx] : undefined;
            if (cell && cell.id === 'R') return true;
        }

        return false;
    }

    static getBuildingInfo(type) {
        const info = {

            'house': { name: 'Casa', cost: 1000, capacity: 4, jobs: null, income: null, production: null, electricity: 5, water: 3, food: null, happiness: null, radius: null },
            'apartment': { name: 'Apartamento', cost: 3000, capacity: 12, jobs: null, income: null, production: null, electricity: 15, water: 10, food: null, happiness: null, radius: null },
            'store': { name: 'Tienda', cost: 2000, capacity: null, jobs: 6, income: 500, production: null, electricity: 8, water: null, food: null, happiness: null, radius: null },
            'commercial-center': { name: 'Centro Comercial', cost: 8000, capacity: null, jobs: 20, income: 2000, production: null, electricity: 25, water: null, food: null, happiness: null, radius: null },
            'factory': { name: 'Fábrica', cost: 5000, capacity: null, jobs: 15, income: 800, production: null, electricity: 20, water: 15, food: null, happiness: null, radius: null },
            'farm': { name: 'Granja', cost: 3000, capacity: null, jobs: 8, income: null, production: 50, electricity: null, water: 10, food: 50, happiness: null, radius: null },
            'police-station': { name: 'Policía', cost: 4000, capacity: null, jobs: null, income: null, production: null, electricity: 15, water: null, food: null, happiness: 10, radius: 5 },
            'firefighter-station': { name: 'Bomberos', cost: 4000, capacity: null, jobs: null, income: null, production: null, electricity: 15, water: null, food: null, happiness: 10, radius: 5 },
            'hospital': { name: 'Hospital', cost: 6000, capacity: null, jobs: null, income: null, production: null, electricity: 20, water: 10, food: null, happiness: 10, radius: 7 },
            'power-plant': { name: 'Planta Eléctrica', cost: 10000, capacity: null, jobs: null, income: null, production: 200, electricity: null, water: null, food: null, happiness: null, radius: null },
            'water-plant': { name: 'Planta de Agua', cost: 8000, capacity: null, jobs: null, income: null, production: 150, electricity: 20, water: null, food: null, happiness: null, radius: null },
            'park': { name: 'Parque', cost: 1500, capacity: null, jobs: null, income: null, production: null, electricity: null, water: null, food: null, happiness: 5, radius: null },
            'road': { name: 'Vía', cost: 100, capacity: null, jobs: null, income: null, production: null, electricity: null, water: null, food: null, happiness: null, radius: null },
        };

        return info[type] ?? null;
    }

    static createInfoContainer(type) {
        const data = BuildingHelpers.getBuildingInfo(type);
        if (!data) return null;

        const container = document.createElement('div');
        container.classList.add('building-info-panel');

        let html = `<ul class="building-info-list">`;

        if (data.cost) html += `<li>💰 Costo: $${data.cost.toLocaleString()}</li>`;
        if (data.capacity) html += `<li>👥 Capacidad: ${data.capacity} ciudadanos</li>`;
        if (data.jobs) html += `<li>💼 Empleos: ${data.jobs}</li>`;
        if (data.income) html += `<li>📈 Ingreso: $${data.income}/turno</li>`;
        if (data.production) html += `<li>🏭 Producción: ${data.production}</li>`;
        if (data.electricity) html += `<li>⚡ Electricidad: ${data.electricity} u/t</li>`;
        if (data.water) html += `<li>💧 Agua: ${data.water} u/t</li>`;
        if (data.food) html += `<li>🌾 Alimentos: ${data.food}/turno</li>`;
        if (data.happiness) html += `<li>😊 Felicidad: +${data.happiness}</li>`;
        if (data.radius) html += `<li>📡 Radio: ${data.radius} celdas</li>`;

        html += '</ul>';
        container.innerHTML = html;

        return container;
    }



}