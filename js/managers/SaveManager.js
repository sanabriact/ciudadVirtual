class SaveManager{

    static key = "city"

    static saveGame(city){
        localStorage.setItem(this.key, JSON.stringify(city));
    }
2
    static loadGame(){
        let data = localStorage.getItem(this.key);
        if (!data) return [];

        let cityPlane = JSON.parse(data)
        
        city = new City(
                cityPlane.name,
                cityPlane.mayor,
                cityPlane.regionLat,
                cityPlane.regionLon,
                cityPlane.width,
                cityPlane.height,
                cityPlane.score,
                cityPlane.hapinessAverage,
                cityPlane.grid
        );

        let citizens = cityPlane.citizenManager.population.map(e=>
            citizen = new Citizen(
                e.id
            );
            citizen.happiness = e.happiness;
        )
        

    }
}