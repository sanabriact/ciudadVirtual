document.addEventListener("DOMContentLoaded", () => {
    function showScreen(screenId) {
        // Ocultar todas las pantallas
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

        // Mostrar la que se pide
        document.getElementById(screenId).classList.add('active');
    }

    // Intro → Crear ciudad
    document.getElementById('btn-new-city').addEventListener('click', () => {
        showScreen('city-info-page');
    });

    document.getElementById('btn-load-game').addEventListener('click', () => {
        showScreen('load-game-page');
    })

    document.getElementById('return').addEventListener('click', () => {
        showScreen('initial-page')
    })

    document.getElementById('btn-create-game').addEventListener('click', () => {
        showScreen('game-page');
    });

    document.getElementById('btn-back-page').addEventListener('click', () => {
        showScreen('initial-page')
    });

    document.getElementById('return-start-page').addEventListener('click', () => {
        let response = confirm("¿Desea guardar partida?")

        if(response){
            //Guardar información
        } else{
            alert("¡Todo su progreso se perderá!")
        }
    
        showScreen('initial-page')
    });

})
