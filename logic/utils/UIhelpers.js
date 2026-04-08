class UIhelpers {

    static showScreen(screen_id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screen_id).classList.add('active');
    }

    static updateUI() {
        const money = document.getElementById('money');
        money.textContent = `💵 $${city.money}`;
        document.getElementById('edit-electricity').value = `${city.electricity}`;
        document.getElementById('edit-water').value = `${city.water}`;
        document.getElementById('edit-food').value = `${city.food}`;
        document.getElementById('population').textContent = `👥 ${city.population.length}`;
        document.getElementById('happiness').textContent = `😊 ${city.calculateHappiness(city.buildings)}%`;
        document.getElementById('score-panel').textContent = `${city.score}`;

        money.classList.remove('money-green', 'money-yellow', 'money-red');

        if (city.money < 1000) {
            money.classList.add('money-red');
        } else if (city.money < 5000) {
            money.classList.add('money-yellow');
        } else {
            money.classList.add('money-green');
        }
    }
    
    static adjustGamePageOffset() {
        const header = document.getElementById('header');
        const gamePage = document.getElementById('game-page');
        if (!header || !gamePage) return;

        const h = header.offsetHeight;
        gamePage.style.paddingTop = h + 'px';

        // Esto hace que map.css use la altura real del header
        document.documentElement.style.setProperty('--header-h', h + 'px');
    }
}